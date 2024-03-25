// components/AddContributionModal.js
import React from "react";
import styles from "../styles/AddContributionModal.module.css"; // Create appropriate styles

const ContributionModal = ({ show, children, onClose }) => {
  if (!show) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {children}
        <button onClick={onClose} className={styles.closeButton}>Close</button>
      </div>
    </div>
  );
};

export default ContributionModal;