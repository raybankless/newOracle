// components/ListEvent.js - Lists events in Dashboard Page, My Collection section
import React, { useEffect, useState } from "react";
import { fetchEvents } from "../pages/api/events/fetch/fetchEvents"; // Adjust the import path as needed
import styles from "../styles/ListEvent.module.css";

const ListEvent = () => {
  const [events, setEvents] = useState([]);

    useEffect(() => {
      fetchEvents(setEvents); // Pass the setState function as a callback
      console.log("LIST EVENT - events ");
      console.log(events);
    }, []);
  
return (
  <div className={styles.listEventsContainer}>
    {events.length > 0 ? (
      <ul className={styles.eventsList}>
        {events.map((event, index) => (
          <li key={index} className={styles.eventItem}>
            <img src={event.metadata.image} alt={event.metadata.name} className={styles.eventImage} />
            <div className={styles.eventContent}>
              <div className={styles.eventHeader}>
                <h3>{event.metadata.name}</h3>
                <span>{event.metadata.percentageOwnership}%</span>
              </div>
              <p>{event.metadata.description}</p>
              <p className={styles.eventDate}>
                {event.metadata.hypercert.work_timeframe.display_value}
              </p>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p>No events found.</p>
    )}
  </div>
);
};

export default ListEvent;
