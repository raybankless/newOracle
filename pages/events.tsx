// events.tsx - shows ll events of currentWallet.
/*
import { NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "../styles/Events.module.css";
import HomeButton from "../components/HomeButton";
import { useAddress, ConnectWallet } from "@thirdweb-dev/react";
import Link from "next/link";
import CreateEventModal from "../components/CreateEventModal";

const Events: NextPage = () => {
  const currentWallet = useAddress();
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [events, setEvents] = useState<any[]>([]);

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
            <Link className={styles.eventItem} key={event._id} href={`/events/${event._id}`} passHref>
                <div key={event._id} className={styles.eventItem}>
                  <h2 className={styles.textBlack}>{event.name}</h2>
                  <p className={styles.textBlack}>{event.description}</p>
                  <p className={styles.textBlack}>{event.createdAt}</p>
                  {/* Display other event details as needed }
                </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No events found for this wallet.</p>
      )}
       {showModal && <CreateEventModal setShowModal={setShowModal} />}
    </div>
  );
};

export default Events;


*/