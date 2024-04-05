// components/CommunityDashboard.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/CommunityDashboard.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import EditCommunityModal from './EditCommunityModal';

const CommunityDashboard = ({ communityWallet }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [community, setCommunity] = useState(null);

  // Fetch community data from backend
  const fetchCommunity = async () => {
    console.log("Fetching community for wallet:", communityWallet);
    try {
      const response = await fetch(`/api/communities/${communityWallet}`);
      const { success, data } = await response.json();
      if (success) {
        setCommunity(data);
        console.log("Fetched community data:", data);
      } else {
        console.error("Community not found for wallet:", communityWallet);
      }
    } catch (error) {
      console.error("Fetching community failed:", error);
    }
  };

  useEffect(() => {
    fetchCommunity();
  }, [communityWallet]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
    console.log("Opening edit modal for community:", community);
  };

  const handleUpdate = async (updatedCommunity) => {
    console.log("Updating community:", updatedCommunity);
    try {
      const response = await fetch(`/api/communities/updateCommunity/${communityWallet}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updatedCommunity),
      });
      const { success, data } = await response.json();
      if (success) {
        setCommunity(data);
        setIsEditModalOpen(false);
        console.log("Updated community data:", data);
      } else {
        console.error("Update failed for community:", updatedCommunity);
      }
    } catch (error) {
      console.error("Failed to update the community:", error);
    }
  };

  if (!community) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.communityDetail}>
      <div className={styles.header}>
        <div className={styles.imageContainer}>
          <img src={community.image} alt="Community" className={styles.image} />
        </div>
        <div className={styles.info}>
          <span className={styles.communityName}>{community.name}</span>
          <span className={styles.communityWallet}>{`${community.safeWallet.slice(0, 6)}...${community.safeWallet.slice(-4)}`}</span>
          <p>{community.description}</p>
          <a href={community.webLink} target="_blank" rel="noopener noreferrer">Website Link</a>
        </div>
      </div>

      <div className={styles.actions}>
        <span className={styles.actionButton} onClick={() => console.log("Add Contributor Clicked")}>
          <FontAwesomeIcon icon={faPlus} /> Add Contributor
        </span>
        <span className={styles.actionButton} onClick={handleEdit}>
          <FontAwesomeIcon icon={faEdit} /> Edit Community
        </span>
      </div>

      <div className={styles.eventsList}>
        <h3>Community Events</h3>
        {/* Placeholder div for community events listing */}
        <div className={styles.eventItem}>Event 1</div>
        <div className={styles.eventItem}>Event 2</div>
      </div>

      {isEditModalOpen && (
        <EditCommunityModal
          community={community}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default CommunityDashboard;

