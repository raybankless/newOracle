// components/EventDetail.js
import React, { useEffect, useState, useMemo } from "react";
import styles from "../styles/EventDetail.module.css";
import LoginModal from "../components/LoginModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faCoins,
  faNetworkWired,
  faMagnifyingGlass,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import AddContributionModal from "./AddContributionModal";
import { useSigner, useAddress } from "@thirdweb-dev/react";

const EventDetail = ({ eventId, qrCode, currentWallet }) => {
  const [event, setEvent] = useState(null);
  const [showAddContributionModal, setShowAddContributionModal] =
    useState(false);
  const [consoleLog, setConsoleLog] = useState("");
  const signer = useSigner();
  const [qrProcessed, setQRProcessed] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString)
      .toLocaleDateString(undefined, options)
      .replace(/\//g, ".");
  };

  const isFacilitator = useMemo(
    () => event?.creatorWallet === currentWallet,
    [event, currentWallet],
  );
  const isContributor = useMemo(
    () =>
      qrCode && qrCode.action === "contribute" && qrCode.eventId === eventId,
    [qrCode, eventId],
  );

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();
        if (data.success) {
          setEvent(data.event);
          if (isContributor && currentWallet && signer) {
            await processQRCode(qrCode, signer);
          }
        }
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  useEffect(() => {
    if (isContributor && !qrProcessed && currentWallet && signer) {
      processQRCode(qrCode).then(() => {
        setQRProcessed(true); // Ensure this is set after successful QR processing
      });
    }
  }, [qrCode]);

  

  const processQRCode = async (qrData) => {
    if (!qrData || !signer || qrProcessed) return;
    try {
      const signature = await signer.signMessage(`Adding contribution to event with ID: ${qrData.eventId}`);
      setConsoleLog(`Signature ${signature}`);
      // Logic to update the database goes here
      const response = await fetch(`/api/events/updateEvent/${qrData.eventId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          update: { $push: { allowListed: currentWallet } },
        }),
      });

      const data = await response.json();
      if (data.success) {
       // setConsoleLog(`Allowlist updated successfully for event ID: ${qrData.eventId}`);
      } else {
      //  setConsoleLog(`Failed to update allowlist for event ID: ${qrData.eventId}`);
      }
    } catch (error) {
      console.error("Error processing QR data or signing message:", error);
    }
  };
  
  /*
  useEffect(() => {
    const defineRole = async () => {
      //console.log("event3 : ", event.creatorWallet);
      if (
        event &&
        event.creatorWallet=== currentWallet
      ) {
        setIsFacilitator(true);
        console.log("isFacilitator", isFacilitator);
      }
      if (qrCode) {
        setIsContributor(true);
        console.log("isContributor", isContributor);
        //const addBase = await QRDetection(qrCode, currentWallet);
        //setContributionSignature(`QRDetection return ${addBase}`);
        //console.log("addBase : ", addBase);
        try {

          if (qrCode.action !== "contribute" || !qrCode.eventId) {
            console.error("Invalid QR data");
           

            return null;
          }

          console.log("Event ID from QR:", qrCode.eventId);
          

          // Assume `useSigner` hook is used outside and signer object is passed as an argument
          
          const signature = await signer.signMessage(`Adding contribution to event with ID: ${qrCode.eventId}`);
          console.log("Contribution signature:", signature);
          
          // Update the allowListed field in the database for this event
          const response = await fetch(`/api/events/updateEvent/${qrCode.eventId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              update: { $push: { allowListed: currentWallet } },
            }),
          });

          const data = await response.json();
          
          if (data.success) {
            console.log("Allowlist updated successfully", data.event);
            setContributionSignature (`signature: ${data.event.allowListed}` )
          } else {
            console.error("Failed to update allowlist", data.message);
          }

        } catch (error) {
          console.error("Error processing QR data:", error);
          return null;
        }
      }
    };

    defineRole();
  }, [qrCode, currentWallet, event, isFacilitator]);
   */



  if (!event) return <div>Loading...</div>;

  return (
    <div className={styles.eventDetail}>
      <div className={styles.header}>
        <div className={styles.eventImageContainer}>
          {/* Replace img with Image component */}
          <img
            src={event.headerImage}
            alt={event.name}
            className={styles.eventImage}
          />
        </div>

        <div className={styles.eventInfo}>
          <h2>{event.name}</h2>
          <p>
            <FontAwesomeIcon icon={faCalendar} /> {formatDate(event.startDate)}-{" "}
            {formatDate(event.endDate)}
          </p>
          <p>
            <FontAwesomeIcon icon={faMagnifyingGlass} /> {event.scopeOfWork}
          </p>
          <p>{event.description}</p>
        </div>
      </div>
      {!currentWallet && (
        <button
          className={styles.loginButton}
          onClick={() => setShowLoginModal(true)}
        >
          Log In
        </button>
      )}
      {currentWallet && isFacilitator && (
        <div className={styles.eventActions}>
          <span
            className={styles.navItem}
            onClick={() => setShowAddContributionModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Add Contribution
          </span>

          {showAddContributionModal && (
            <AddContributionModal
              eventId={eventId}
              onClose={() => setShowAddContributionModal(false)}
            />
          )}
          <Link href="/" className={styles.navItem}>
            <FontAwesomeIcon icon={faNetworkWired} /> Add IoT Device
          </Link>
          <Link href="/" className={styles.navItem}>
            <FontAwesomeIcon icon={faEdit} /> Edit Event
          </Link>
          <Link href="/" className={styles.navItem}>
            <FontAwesomeIcon icon={faCoins} /> Mint Event
          </Link>
        </div>
      )}
      {currentWallet && isContributor && !isFacilitator && (
        <div className={styles.eventActions}>
          <span className={styles.navItem}>{consoleLog} </span>
          <Link href="/" className={styles.navItem}>
            <FontAwesomeIcon icon={faNetworkWired} /> Join Event
          </Link>
        </div>
      )}
      {showLoginModal && (
        <LoginModal  />
      )}
      <div className={styles.contributorsSection}>
        <span className={styles.contributorsSectionHeader}>Contributors</span>
        {/* List of contributors */}
      </div>
    </div>
  );
};

export default EventDetail;
