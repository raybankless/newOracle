  // components/EventDetail.js
  import React, { useEffect, useState } from 'react';
  import styles from '../styles/EventDetail.module.css';
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faCoins, faNetworkWired, faMagnifyingGlass, faCalendar } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
  
  const EventDetail = ({ eventId, onBack }) => {
    const [event, setEvent] = useState(null);

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options).replace(/\//g, '.');
    };
  
    useEffect(() => {
      const fetchEventDetails = async () => {
        try {
          const response = await fetch(`/api/events/${eventId}`);
          const { event } = await response.json();
          setEvent(event);
          console.log(event);
        } catch (error) {
          console.error("Failed to fetch event details:", error);
        }
      };
  
      fetchEventDetails();
    }, [eventId]);
    
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
        <h1>{event.name}</h1>
        <p><FontAwesomeIcon icon={faCalendar}  /> {formatDate(event.startDate)} - {formatDate(event.endDate)} </p>
        <p><FontAwesomeIcon icon={faMagnifyingGlass}  /> {event.scopeOfWork} </p>
        <p>{event.description}</p>
      </div>
    </div>
      <div className={styles.eventActions}>
        <Link href="/" className={styles.navItem}><FontAwesomeIcon icon={faPlus}  /> Add contribution</Link>
        <Link href="/" className={styles.navItem}><FontAwesomeIcon icon={faNetworkWired}  /> Add IoT Device</Link>
        <Link href="/" className={styles.navItem}><FontAwesomeIcon icon={faEdit} /> Edit Event</Link>
        <Link href="/" className={styles.navItem}><FontAwesomeIcon icon={faCoins} /> Mint Event</Link>
      </div>
    <div className={styles.contributorsSection}>
      <h2>Contributors</h2>
      {/* List of contributors */}
    </div>
  </div>
);
};

export default EventDetail;

