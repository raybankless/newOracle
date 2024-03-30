// components/AddContributionModal.js
import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import styles from "../styles/AddContributionModal.module.css";

const AddContributionModal = ({ eventId, onClose, contributors }) => {
  const [measurement, setMeasurement] = useState("");
  const [unit, setUnit] = useState("");
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    const qrData = {
      action: "contribute",
      eventId: eventId,
      timestamp: new Date().getTime(),
    };
    const encodedQRData = encodeURIComponent(JSON.stringify(qrData));
    console.log("encodedQRData : ", encodedQRData);
      setQrValue(`${window.location.origin}/dashboard?data=${encodedQRData}`);
    
  }, [eventId]);
  
  console.log("qrValue : ", qrValue);
  
  const handleContributionSubmit = (e) => {
    e.preventDefault();
    console.log("Contribution details:", measurement, unit);
    // Here, implement your logic to handle the contribution details submission.
    onClose(); // Assuming onClose will close the modal.
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.qrCodeContainer}>
          <QRCode value={qrValue} size={256} />
        </div>
        <form onSubmit={handleContributionSubmit} className={styles.contributionForm}>
          <div className={styles.inputsContainer}>
            <div className={styles.formGroup}>
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
          <div className={styles.contributorsList}>
            {/* Minified version of contributors list */}
            
          </div>
          <button type="submit" className={styles.submitButton}>Add Contribution</button>
        </form>
      </div>
    </div>
  );
};

export default AddContributionModal;
