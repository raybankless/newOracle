// components/ListEvent.js - Lists events in Dashboard Page, My Collection section
import React, { useEffect, useState } from "react";
import { fetchEvents } from "../pages/api/events/fetch/fetchEvents"; // Adjust the import path as needed
import styles from "../styles/ListEvent.module.css";

const ListEvent = () => {
  const [events, setEvents] = useState([]);

    useEffect(() => {
      fetchEvents(setEvents); // Pass the setState function as a callback
    }, []);
  console.log("LIST EVENT - events ");
  console.log(events);
  return (
    <div className={styles.listEventsContainer}>
      {events.length > 0 ? (
        <ul className={styles.eventsList}>
          {events.map((event, index) => (
            <li key={index} className={styles.eventItem}>
              <p>{event.id}</p>
              <p>{event.uri}</p>
              <p>{event.metadata.name }</p>
              <p>{event.metadata.descripton }</p>
              <p>{event.metadata.image }</p>
              <p>{event.metadata.external_url }</p>
              <p>{event.metadata.work_scope }</p>
              <p>{event.metadata.work_timeframe }</p>
              <p>{event.metadata.contributors }</p>
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
