// components/CommunityDashboard.js

import React from 'react';
import styles from '../styles/CommunityDashboard.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faCoins,
  faNetworkWired,
  faMagnifyingGlass,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";

const CommunityDashboard = ({ communityWallet }) => {
  // Mock community data
  const mockCommunity = {
    name: "Mock Community Name",
    image: "https://placehold.co/200x200/aed6af/586558?text=GoodOracle",
    description: "A short description of the mock community.",
    safeWallet: communityWallet,
    webLink: "https://example.com",
  };
  
  return (
      <div className={styles.communityDetail}>
        <div className={styles.header}>
          <div className={styles.imageContainer}>
            <img src={mockCommunity.image} alt="Community" className={styles.image} />
          </div>
          <div className={styles.info}>
            <span className={styles.communityName}>{mockCommunity.name}</span>
            <span className={styles.communityWallet} >{`${mockCommunity.safeWallet.slice(0, 4)}.......${mockCommunity.safeWallet.slice(-6)}`}</span>
            <p>{mockCommunity.description}</p>
            <a href={mockCommunity.webLink} target="_blank" rel="noopener noreferrer">Website Link</a>
          </div>
        </div>

        <div className={styles.actions}>
          {/* Placeholder for actions like edit, add events etc. */}
          <span className={styles.actionButton}><FontAwesomeIcon icon={faPlus} />Create Event</span>
          <span className={styles.actionButton}><FontAwesomeIcon icon={faEdit} />Edit Community</span>
          
          {/* Add more actions as needed */}
        </div>

        <div className={styles.eventsList}>
          <h3>Community Events</h3>
          {/* Placeholder div for community events listing */}
          <div className={styles.eventItem}>Event 1</div>
          <div className={styles.eventItem}>Event 2</div>
          {/* Add more events as placeholders */}
        </div>
      </div>
    );
  };

export default CommunityDashboard;

