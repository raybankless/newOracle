import { NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "../styles/Events.module.css";
import HomeButton from "../components/HomeButton";
import { useAddress, ConnectWallet } from "@thirdweb-dev/react";
import Link from "next/link";

const Events: NextPage = () => {
  const currentWallet = useAddress();
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [events, setEvents] = useState<any[]>([]); // Adjust typing as necessary

  useEffect(() => {
    const fetchEvents = async () => {
      if (currentWallet) {
        try {
          const res = await fetch(`/api/${currentWallet}`);
          const { data } = await res.json();
          console.log(data);
          setEvents(data);
        } catch (error) {
          console.error("Failed to fetch events:", error);
          // Handle error appropriately, possibly updating UI to inform the user
        }
      }
    };

    fetchEvents();
  }, [currentWallet]); // Fetch events when currentWallet changes

  // Modal component with form for event creation
  const Modal = () => {
    const [eventName, setEventName] = useState("");
    const [headerImage, setHeaderImage] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [additionalInfoLink, setAdditionalInfoLink] = useState('');
    const [scopeOfWork, setScopeOfWork] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    
    const locations = ["Lisbon", "New York", "Istanbul", "Sydney"];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const eventData = {
        name: eventName,
        description: eventDescription,
        scopeOfWork: scopeOfWork.split(",").map((tag) => tag.trim()),
        startDate,
        endDate,
        location: eventLocation,
        headerImage,
        creatorWallet: currentWallet,
      };

      try {
        const response = await fetch("api/events/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });

        const result = await response.json();
        if (result.success) {
          // Handle success - maybe clear form or give user feedback
          setEventName("");
          setEventDescription("");
          setScopeOfWork("");
          setStartDate("");
          setEndDate("");
          setEventLocation("");
          setHeaderImage("");
          console.log("Event created:", result.event);
          setShowModal(false); // Close the modal
        } else {
          // Handle error - give user feedback
          console.error("Failed to create event:", result.error);
        }
      } catch (error) {
        // Handle error - give user feedback
        console.error("An error occurred:", error);
      }
    };

    return (
      <div className={styles.modalBackground}>
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
            >
              &times;
            </span>
            <h2 className={styles.textBlack}>Create a New Event</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.textBlack}>Event Name</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.textBlack}>Event Description</label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.textBlack}>
                  Scope of Work (tags, comma-separated)
                </label>
                <input
                  type="text"
                  value={scopeOfWork}
                  onChange={(e) => setScopeOfWork(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.textBlack}>Event Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.textBlack}>Event End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.textBlack}>Event Location</label>
                <select
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  required
                >
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.textBlack}>
                  Header Image Link
                </label>
                <input
                  type="url"
                  value={headerImage}
                  onChange={(e) => setHeaderImage(e.target.value)}
                />
              </div> 
              <div className={styles.formGroup}>
              <label className={styles.textBlack}>Additional Info Link:</label>
              <input
                id="additionalInfoLink"
                type="text"
                value={additionalInfoLink}
                onChange={(e) => setAdditionalInfoLink(e.target.value)}
                required
              />
              </div> 
              <button type="submit" className={styles.submitButton}>
                Create Event
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.eventsPage}>
      <HomeButton />
      <ConnectWallet />
      <button className={styles.button} onClick={() => setShowModal(true)}>
        Create Event
      </button>
      <h1 className={styles.textBlack}>Events</h1>
      {events.length > 0 ? (
        <div className={styles.eventsList}>
          {events.map((event) => (
            <Link key={event._id} href={`/events/${event._id}`} passHref>
              <a className="eventItem">
                <div key={event._id} className={styles.eventItem}>
                  <h2 className={styles.textBlack}>{event.name}</h2>
                  <p className={styles.textBlack}>{event.description}</p>
                  <p className={styles.textBlack}>{event.creatorWallet}</p>
                  {/* Display other event details as needed */}
                </div>
              </a>
            </Link>
          ))}
        </div>
      ) : (
        <p>No events found for this wallet.</p>
      )}
      {showModal && <Modal />}
    </div>
  );
};

export default Events;
