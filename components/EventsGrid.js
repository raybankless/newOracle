// components/EventsGrid.js

import styles from '../styles/EventsGrid.module.css'; // Make sure to create this CSS file
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options).replace(/\//g, '.');;
};
const EventsGrid = ({ events }) => {
  console.log (events)
return (
  <div className={styles.eventsGrid}>
    {events.slice(0, 4).map((event, index) => (
      <div key={index} className={styles.eventCard}>
        <img src={event.headerImage} alt={event.name} className={styles.eventImage} />
        <div className={styles.eventInfo}>
          <span className={styles.eventName}>{event.name}</span>
          <p className={styles.eventDate}>{formatDate(event.startDate)}</p> {/* Truncate the description */}
        </div>
      </div>
    ))}
  </div>
);
};

export default EventsGrid;


