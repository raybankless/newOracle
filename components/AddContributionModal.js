// components/AddContributionModal.js
import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import styles from "../styles/AddContributionModal.module.css";
import { useAddress } from "@thirdweb-dev/react";

const AddContributionModal = ({ eventId, onClose }) => {
  const [latestContributor, setLatestContributor] = useState("");
  const [shortenedWallet, setShortenedWallet] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [unit, setUnit] = useState("");
  const [qrValue, setQrValue] = useState("");
  const currentWallet = useAddress();
  const [avatarURL, setAvatarURL] = useState("");

  useEffect(() => {
    const qrData = {
      action: "contribute",
      eventId: eventId,
      timestamp: new Date().getTime(),
    };
    
    const encodedQRData = encodeURIComponent(JSON.stringify(qrData));

    setQrValue(`${window.location.origin}/dashboard?data=${encodedQRData}`);
  }, [eventId]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch(`/api/events/${eventId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("data : ", data);
            const allowListed = data.event.allowListed;
            if (allowListed.length > 0) {
              // Assuming allowListed is an array of objects with 'wallet', 'measurement', and 'unit'
              const lastContributor = allowListed[allowListed.length - 1];
              console.log("lastContributor : ", lastContributor);
              setLatestContributor(lastContributor);
            }
          }
        })
        .catch((error) =>
          console.error("Failed to fetch event details:", error),
        );
    }, 20000); // Poll every 20 seconds

    return () => clearInterval(intervalId);
  }, [eventId]);

  useEffect(() => {
    if (latestContributor) {
      setShortenedWallet(
        latestContributor.wallet.slice(0, 6) +
          "..." +
          latestContributor.wallet.slice(-4),
      );
      setAvatarURL(
        `https://source.boringavatars.com/beam/28/${currentWallet}?colors=CCCC66,A8BF73,80B380,80B380,34999B`,
      );
    }
  }, [latestContributor]);

  // Handle form submission
  const handleContributionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/events/modifyDB/${eventId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: 'updateContribution',
          wallet: latestContributor.wallet,
          measurement: measurement,
          unit: unit
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Contribution added successfully : ", data.event);
        setMeasurement("");
        setUnit("");
        // Optionally refresh contributors list immediately
        /*   fetch(`/api/events/${eventId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
                setEvent(data.event);
            }
          });*/
      } else {
        console.error("Failed to add contribution:", data.message);
      }
    } catch (error) {
      console.error("Failed to submit contribution:", error);
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalHeaderText}>Add Contribution</h3>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.qrCodeContainer}>
          <QRCode value={qrValue} size={256} />
        </div>
        <form
          onSubmit={handleContributionSubmit}
          className={styles.contributionForm}
        >
          <div className={styles.inputsContainer}>
            <div className={styles.formGroup}>
              {latestContributor && (
                <div className={styles.latestContributorContainer}>
                  <img
                    className={styles.latestContributorAvatar}
                    src={avatarURL}
                    alt="Latest Contributor Avatar"
                  />
                  <div className={styles.latestContributor}>
                    {shortenedWallet}
                  </div>
                </div>
              )}
              <label>Measurement:</label>
              <input
                type="number"
                value={measurement}
                onChange={(e) => setMeasurement(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Unit:</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>
            Add Contribution
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddContributionModal;
