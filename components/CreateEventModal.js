  import React, { useState } from 'react';
import styles from '../styles/CreateEventModal.module.css';
import { useAddress } from "thirdweb/react";
// /components/CreateEventModal.js - Modal component with form for event creation
const CreateEventModal = ({setShowModal, onEventCreated}) => {
  const [eventName, setEventName] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [additionalInfoLink, setAdditionalInfoLink] = useState('');
  const [scopeOfWork, setScopeOfWork] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const currentWallet = useAddress();
  

  const locations = ["Lisbon", "New York", "Istanbul", "Sydney"];

  const handleSubmit = async (e) => {
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
      additionalInfoLink,
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
        setAdditionalInfoLink ("");
        console.log("Event created:", result.event._id);
        onEventCreated(result.event._id);
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

export default CreateEventModal;