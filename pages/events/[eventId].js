// pages/events/[eventId].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/EventDetail.module.css'; // Make sure the path to your CSS module is correct
import HomeButton from '../../components/HomeButton';
import { useAddress } from "@thirdweb-dev/react";

export default function EventDetail() {
  const router = useRouter();
  const { eventId } = router.query;
  const [event, setEvent] = useState(null);

  const currentWallet = useAddress();
  
  // Fetch event details
  useEffect(() => {
    if (!eventId || !currentWallet) return;
    console.log('Fetching event details for eventId:', eventId);
    fetch(`/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log('Event details fetched successfully:', data.event);
          setEvent(data.event);
        } else {
          // Redirect or handle the error if the event is not found
          router.push('/events');
        }
      })
      .catch((error) => {
        console.error("Could not fetch the event:", error);
        router.push('/events');
      });
  }, [eventId, currentWallet, router]);

  // Function to end the event and create a Hypercert
  const endEvent = async () => {
    const response = await fetch(`/api/events/endEvent/${eventId}`, {
      method: 'POST',
    });
    const data = await response.json();
    if (data.success) {
      alert('Event ended successfully. Hypercert creation initiated.');
      router.push('/events'); // Optionally, redirect to the events listing or another page
    } else {
      alert('Failed to end the event.');
    }
  };

  if (!event) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <HomeButton />
      <h1 className={styles.textBlack}>{event.name}</h1>
      <p className={styles.textBlack} >{event.description}</p>
      <p className={styles.textBlack} >{event.creatorWallet}</p>
      <p className={styles.textBlack} >{event.startDate}</p>
      {/* Display other details of the event as needed */}
      <button onClick={endEvent} className={styles.endEventButton}>End Event</button>
    </div>
  );
}