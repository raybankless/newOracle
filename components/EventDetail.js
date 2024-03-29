// components/EventDetail.js
import React, { useEffect, useState } from 'react';
import styles from '../styles/EventDetail.module.css';

const EventDetail = ({ eventId, onBack }) => {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        const { event } = await response.json();
        setEvent(event);
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (!event) return <div>Loading...</div>;

  return (
    <div className={styles.eventDetail}>
      <button onClick={onBack}>Back to Events</button>
      <img src={event.headerImage || "defaultImage.jpg"} alt={event.name} />
      <h2>{event.name}</h2>
      {/* Additional event details here */}
    </div>
  );
};

export default EventDetail;