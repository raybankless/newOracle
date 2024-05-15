// components/EventsGrid.js

import styles from '../styles/EventsGrid.module.css'; // Make sure to create this CSS file

const EventsGrid = ({ events, onEventSelect }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options).replace(/\//g, '.');
  };

  return (
    <div className={styles.eventsGrid}>
      {events.slice(0, 4).map((event) => (
        <div key={event._id} className={styles.eventCard} onClick={() => onEventSelect(event._id)}>
          <img src={event.headerImage || "defaultImage.jpg"} alt={event.name} className={styles.eventImage} />
          <div className={styles.eventInfo}>
            <span className={styles.eventName}>{event.name}</span>
            <p className={styles.eventDate}>{formatDate(event.startDate)}</p>
          </div>
        </div>
      ))}

    </div>
     

  );
};

export default EventsGrid;

