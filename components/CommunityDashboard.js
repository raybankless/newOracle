// components/CommunityDashboard.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/CommunityDashboard.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import EditCommunityModal from './EditCommunityModal';
import CreateEventModal from "../components/CreateEventModal";
import EventsGrid from "../components/EventsGrid";

const CommunityDashboard = ({ communityWallet }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [community, setCommunity] = useState(null);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
   const [events, setEvents] = useState([]);
  const [comWalletLoaded, setComWalletLoaded] = useState(false);
  // Fetch community data from backend
  const fetchCommunity = async () => {
    console.log("Fetching community for wallet:", communityWallet);
    try {
      const response = await fetch(`/api/communities/${communityWallet}`);
      const { success, data } = await response.json();
      if (success) {
        setCommunity(data);
        console.log("Fetched community data:", data);
        
        // Fetch events associated with the community
        try {
          const eventsResponse = await fetch(`/api/events/byCommunity?communityWallet=${communityWallet}`);
          const eventsData = await eventsResponse.json();
          if (eventsData.success) {
            setEvents(eventsData.events);
          } else {
            console.error("Failed to fetch events for community wallet:", communityWallet);
          }
        } catch (error) {
          console.error("Fetching community or events failed:", error);
        }
      } else {
        console.error("Community not found for wallet:", communityWallet);
      }
    } catch (error) {
      console.error("Fetching community failed:", error);
    }
  };

  const handleEventCreated = async (eventId) => {
    console.log("New event created with ID:", eventId);
    // After receiving the eventId, call the API to update the event with the safeWallet
    try {
      console.log("Attempting to update event with safeWallet:", communityWallet)
      await fetch(`/api/events/modifyDB/${eventId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addCommunity", // Assuming this action is handled in your API
          safeWallet: communityWallet,
        }),
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then(data => {
        console.log('Success 2:', data);
      }).catch(error => {
        console.error('Error:', error);
      });
      console.log(`Event ${eventId} associated with community ${communityWallet}`);
    } catch (error) {
      console.error("Failed to associate event with community:", error);
    }
  };

  useEffect(() => {
    if (!comWalletLoaded){
    fetchCommunity();
    setComWalletLoaded(true);
    }
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

  const toggleCreateEventModal = () => {
    setShowCreateEventModal(true);
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
        <span className={styles.actionButton} onClick={toggleCreateEventModal}>
          <FontAwesomeIcon icon={faPlus} /> Create Event
        </span>
        {showCreateEventModal && (
          <CreateEventModal setShowModal={setShowCreateEventModal} onEventCreated={handleEventCreated} />
        )}
        <span className={styles.actionButton} onClick={handleEdit}>
          <FontAwesomeIcon icon={faEdit} /> Edit Community
        </span>

        <span className={styles.actionButton} onClick={handleEdit}>
          <FontAwesomeIcon icon={faEdit} /> mock
        </span>
      </div>

      <div className={styles.eventsList}>
        <h3>Community Events</h3>
        <EventsGrid events={events} onEventSelect={() => {}} />
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

