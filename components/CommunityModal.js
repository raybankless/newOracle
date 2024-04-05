// components/AddCommunityModal.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/CommunityModal.module.css';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';

const CommunityModal = ({ isOpen, onClose, onOpenCommunityDashboard }) => {
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

  const createCommunity = async (wallet) => {
    console.log("Creating community with wallet:", wallet);
    const communityData = {
      name: "Mock Community Name", // You might want to change this to be dynamic or input by the user
      image: "https://placehold.co/200x200/aed6af/586558?text=GoodOracle", // Same here
      description: "A description for your community", // And here
      safeWallet: selectedSafe.address, // Assuming 'selectedSafe' holds the selected safeWallet address
      ownerWallets: owners, // 'walletAddress' is the current user's wallet address
      webLink: "https://example.com", // Example web link
    };

    console.log("Creating community with data:", communityData);
    
    try {
      const response = await fetch('/api/communities/createCommunity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(communityData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Community created:', data);
        // Here you can handle the UI response, such as closing the modal or showing a success message
      } else {
        throw new Error('Failed to create community');
      }
    } catch (error) {
      console.error('Error creating community:', error);
      // Handle the error in your UI
    }
    onOpenCommunityDashboard (wallet);
  };
  
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
            <span className={styles.explanation}>The signers of the Safe will be community admins.</span>
            <table className={styles.safeWalletsTable}>

              <tbody>
                {safeWallets.map((safeWallet, index) => (
                  <React.Fragment key={index}>
                    <tr onClick={() => toggleSafeDetails(safeWallet)} className={styles.tableRow}>
                      <td>
                        <img
                          src={`https://source.boringavatars.com/marble/28/${safeWallet}?colors=E63946,F4A261,2A9D8F,264653,F4A261`}
                          alt="Avatar"
                          className={styles.avatar}
                        />
                      </td>
                      <td>{`${safeWallet.slice(0, 10)}.......${safeWallet.slice(-10)}`}</td>
                      <td></td> 
                    </tr>
                    {expandedSafe === safeWallet && (
                    <tr className={styles.detailsRow} id={`details-${safeWallet}`}>
                      <td colSpan="3" className={styles.detailsCell}>
                        <div className={styles.detailsCellInner} style={{ overflow: "hidden", transition: "max-height 0.5s ease" }}>
                          <span className={styles.signer}>Signers:</span>
                          {owners.map((owner, index) => (
                            <p key={index}>
                              <img src={`https://source.boringavatars.com/beam/20/${owner}?colors=E63946,F4A261,2A9D8F,264653,F4A261`} alt="Owner Avatar" className={styles.ownerAvatar} />
                              {`${owner.slice(0, 10)}.......${owner.slice(-10)}`}
                            </p>
                          ))}
                          <div className={styles.threshold}>
                            <span className={styles.thresholdText} >Threshold:</span>
                            <span className={styles.thresholdValue}>{threshold} of {owners.length}</span>
                          </div>
                          
                        </div>
                        <div className={styles.loadButtonConatiner}>
                          <button onClick={() => createCommunity(safeWallet)} className ={styles.loadButton} >Load Community</button>
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