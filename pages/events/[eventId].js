// pages/events/[eventId].js -shows single event, event settings, mint event
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAddress, embeddedWallet } from "@thirdweb-dev/react";
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
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    if (!eventId) return;
    fetchEventDetails();

    if (typeof window !== "undefined") {
      const qrAction = sessionStorage.getItem("qrAction");
      if (qrAction && qrAction === "contribute") {
        requestContributionSignature();
        sessionStorage.removeItem("qrAction"); // Clear the QR action
      }
    }

    if (showQRModal) {
      setQrValue(
        `${window.location.href}?qr=contribute&ts=${new Date().getTime()}`,
      );
    }
  }, [eventId, currentWallet, router, showQRModal]);

  const fetchEventDetails = async () => {
    const response = await fetch(`/api/events/${eventId}`);
    const data = await response.json();
    if (data.success) {
      setEvent(data.event);
    } else {
      router.push("/events");
    }
  };

  const requestContributionSignature = async () => {
    try {
      const message = `Adding contribution to ${event?.name}.`;
      const signature = await embeddedWallet.sign(message);
      if (signature) {
        setWarningMessage(`Signature: ${signature}`);
        setShowWarning(true);
        updateAllowlist(currentWallet);
      } else {
        setWarningMessage("Signature Failed");
        setShowWarning(true);
      }
    } catch (error) {
      console.error("Error signing message for contribution:", error);
    }
  };

  const updateAllowlist = async (userAddress) => {
    const response = await fetch(`/api/events/updateEvent/${eventId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ update: { $push: { allowListed: userAddress } } }),
    });
    const data = await response.json();
    if (!data.success) {
      console.error("Failed to update allowlist:", data.message);
    }
  };

  return (
    <div className={styles.container}>
      <HomeButton />
      <h1 className={styles.textBlack}>{event?.name}</h1>
      <p className={styles.textBlack}>{event?.description}</p>
      <p className={styles.textBlack}>{event?.creatorWallet}</p>
      <p className={styles.textBlack}>{event?.startDate}</p>
      {currentWallet && event?.creatorWallet === currentWallet && (
        <button onClick={() => setShowQRModal(true)}>Add Contribution</button>
      )}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
      {showQRModal && <QRModal />}
      {showWarning && (
        <div className="warningMessage">
          <p>{warningMessage}</p>
          <button onClick={() => setShowWarning(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
