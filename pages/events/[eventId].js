// pages/events/[eventId].js -shows single event, event settings, mint event
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAddress, embeddedWallet, ConnectWallet, useSigner } from "@thirdweb-dev/react";
import { EmbeddedWallet } from "thirdweb/wallets";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Optimism } from "@thirdweb-dev/chains";
import HomeButton from "../../components/HomeButton";
import LoginModal from "../../components/LoginModal";
import ContributionModal from "../../components/AddContributionModal";
import MintEventButton from "../../components/MintEvent";
import styles from "../../styles/EventDetail.module.css";
import QRCode from "qrcode.react";

export default function EventDetail() {
  const router = useRouter();
  const { eventId } = router.query;
  const [event, setEvent] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const currentWallet = useAddress();
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const connectedWallet = useSigner();
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const sdk = new ThirdwebSDK(Optimism);

  useEffect(() => {
    if (!eventId) return;
    console.log("Fetching event details for eventId:", eventId);
    fetch(`/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Event details fetched successfully:", data.event);
          setEvent(data.event);
        } else {
          // Redirect or handle the error if the event is not found
          router.push("/events");
        }
      })
      .catch((error) => {
        console.error("Could not fetch the event:", error);
        router.push("/events");
      });
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      const qrAction = queryParams.get("qr");
      if (
        qrAction === "contribute" &&
        currentWallet &&
        event &&
        currentWallet.toLowerCase() !== event.creatorWallet.toLowerCase()
      ) {
        requestContributionSignature();
      }
    }
    if (showQRModal) {
      setQrValue(
        `${window.location.href}?qr=contribute&ts=${new Date().getTime()}`,
      );
    }
  }, [eventId, currentWallet, router, showQRModal]);

  const showLoginButton = !currentWallet;
  const showEndEventButton =
    currentWallet && event?.creatorWallet === currentWallet;

  const requestContributionSignature = async () => {
    // if (!window.ethereum)
    // return alert("MetaMask is required to sign messages.");

    try {
      /*  const message = `Adding contribution to ${event?.name}.`;
      const signer = new ethers.providers.Web3Provider(
        window.ethereum,
      ).getSigner();
      const signature = await signer.signMessage(message);
*/
      const signature = await connectedWallet.signMessage(
          `Adding contribution to ${event?.name}.`,
        );
      if (signature) {
        console.log("Contribution signature:", signature);
        // Proceed to verify the signature and update the allowlist
        // Display the signature in a warning message
        setWarningMessage(`Signature: ${signature}`);
        setShowWarning(true);

        await updateAllowlist(currentWallet);
      } else {
        setWarningMessage(`Signature Failed`);
        setShowWarning(true);
      }
    } catch (error) {
      console.error("Error signing message for contribution:", error);
    }
  };

  const QRModal = () => (
    <ContributionModal show={showQRModal} onClose={() => setShowQRModal(false)}>
      <QRCode value={qrValue} size={256} />
      {/* You can add more inputs under the QR code here */}
    </ContributionModal>
  );

  // Function to update allowlist
  const updateAllowlist = async (userAddress) => {
    // Verify the signature in your backend before updating
    // Assuming verification is done, call updateEvent API to update allowlist
    const response = await fetch(`/api/events/updateEvent/${eventId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        update: {
          $push: { allowListed: userAddress },
        },
      }),
    });

    const data = await response.json();
    if (data.success) {
      console.log("Allowlist updated successfully");
      // Refresh the page or update the state as needed
    } else {
      console.error("Failed to update allowlist:", data.message);
    }
  };

  if (!event) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <HomeButton />
      <ConnectWallet />
      <h1 className={styles.textBlack}>{event.name}</h1>
      <p className={styles.textBlack}>{event.description}</p>
      <p className={styles.textBlack}>{event.creatorWallet}</p>
      <p className={styles.textBlack}>{event.startDate}</p>
      {/* Conditional button rendering based on user connection and role */}
      {showLoginButton && (
        <button
          className={styles.loginButton}
          onClick={() => setShowLoginModal(true)}
        >
          Log In
        </button>
      )}
      {showEndEventButton && (
        <div>
          <button onClick={() => setShowQRModal(true)}>Add Contribution</button>
          <button onClick={() => requestContributionSignature()}>
            Sign Message
          </button>
          <MintEventButton
            event={event}
            onMintSuccess={(tx) => console.log("Minted successfully", tx)}
            onMintError={(error) => console.error("Minting error", error)}
          />
        </div>
      )}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
      {showQRModal && <QRModal />}
    </div>
  );
}
