import React, { useState, useEffect } from 'react';
import styles from '../styles/CommunityModal.module.css';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';

const CommunityModal = ({ isOpen, onClose }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [safeWallets, setSafeWallets] = useState([]);
  const [expandedSafe, setExpandedSafe] = useState(null);
  const [selectedSafe, setSelectedSafe] = useState(null);
  const [owners, setOwners] = useState([]);
  const [threshold, setThreshold] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const connectToBlockchain = async () => {
      if (!window.ethereum) {
        console.log("MetaMask is not installed!");
        return;
      }
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    };
    if (isOpen) connectToBlockchain();
  }, [isOpen]);

  useEffect(() => {
    const fetchSafeWallets = async () => {
      if (!walletAddress) return;
      try {
        const response = await fetch(`https://safe-transaction-optimism.safe.global/api/v1/owners/${walletAddress}/safes/`, {
          headers: { 'Accept': 'application/json' },
        });
        if (!response.ok) {
          throw new Error(`Error fetching safes: ${response.statusText}`);
        }
        const data = await response.json();
        setSafeWallets(data.safes);
      } catch (error) {
        console.error("Error fetching Safe Wallets:", error);
      }
    };
    fetchSafeWallets();
  }, [walletAddress]);

  const toggleSafeDetails = async (safeWallet) => {
    const contentElementId = `details-${safeWallet}`;
    if (expandedSafe === safeWallet) {
      // Collapse if already expanded
      document.getElementById(contentElementId).style.maxHeight = null;
      setExpandedSafe(null);
    } else {
      // Expand new safe details...
      setIsLoading(true); // Start loading
      try {
        const response = await fetch(`https://safe-transaction-optimism.safe.global/api/v1/safes/${safeWallet}`, {
          headers: { 'Accept': 'application/json' },
        });
        if (!response.ok) {
          throw new Error(`Error fetching safes: ${response.statusText}`);
        }
        const data = await response.json();
        setSelectedSafe(data);
        setOwners(data.owners);
        setThreshold(data.threshold);

        // Ensure previous expanded details are collapsed
        if (expandedSafe) {
          document.getElementById(`details-${expandedSafe}`).style.maxHeight = null;
        }
        setExpandedSafe(safeWallet);

        // Wait for state and DOM update
        setTimeout(() => {
          document.getElementById(contentElementId).style.maxHeight = `${document.getElementById(contentElementId).scrollHeight}px`;
          setIsLoading(false);
        }, 0);
      } catch (error) {
        console.error("Error fetching Safe Wallets:", error);
        setIsLoading(false);
        setExpandedSafe(null);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalBackdrop} ${isLoading ? styles.loadingCursor : ''}`} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Create Community</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.modalBody}>
          <table className={styles.safeWalletsTable}>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Wallet</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {safeWallets.map((safeWallet, index) => (
                <React.Fragment key={index}>
                  <tr onClick={() => toggleSafeDetails(safeWallet)} className={styles.tableRow}>
                    <td>
                      <img
                        src={`https://source.boringavatars.com/beam/28/${safeWallet}?colors=E63946,F4A261,2A9D8F,264653,F4A261`}
                        alt="Avatar"
                        className={styles.avatar}
                      />
                    </td>
                    <td>{`${safeWallet.slice(0, 6)}...${safeWallet.slice(-4)}`}</td>
                    <td>
                      {isLoading ? <span>Loading...</span> : <span>View Details</span>}
                    </td>
                  </tr>
                  {expandedSafe === safeWallet && (
                    <tr className={styles.detailsRow}>
                      <td colSpan="3" className={styles.detailsCell}>
                        <div className={styles.detailsCellInner}>
                          <p>Owners: {owners.join(', ')}</p>
                          <p>Threshold: {threshold}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommunityModal;