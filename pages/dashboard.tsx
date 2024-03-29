/* // dashboard.tsx
import { NextPage } from "next";
import styles from "../styles/Dashboard.module.css"; // Ensure you have this CSS file in your styles directory
import ListEvent from "../components/ListEvent";
import { useState } from "react";
import Link from "next/link";
import CreateEventModal from "../components/CreateEventModal";
import { ConnectWallet } from "@thirdweb-dev/react";


const Dashboard: NextPage = () => {
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <span className={styles.gradientText0}>GoodOracle</span>
          </h1>
        </div>
        <div className={styles.wallet}>
          <ConnectWallet />
        </div>
      </header>

      <nav className={styles.navigation}>
        <Link href={`/events`} className={styles.navLink}>
          <p>Events</p>
        </Link>
        <Link href="/" className={styles.navLink}>
          <p>Task Boards</p>
        </Link>
        <Link href="/" className={styles.navLink}>
          <p>Communities</p>
        </Link>
      </nav>


      <div className={styles.listEventConatiner}>
        <h2 className={styles.collectionTitle}>My Collection</h2>
        <button
          className={styles.navButton}
          onClick={() => setShowModal(true)}
        >
          Create Event
        </button>
      
        <ListEvent />
      </div>
      {showModal && <CreateEventModal setShowModal={setShowModal} />}
    </div>
    
  );
};

export default Dashboard;
*/

// pages/dashboard.tsx
import { useEffect, useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import Sidebar from "../components/Sidebar";
import EventsGrid from "../components/EventsGrid";
import { getMockCommunities, getMockTasks } from "../utils/mockData";
import styles from "../styles/Dashboard.module.css"; // Make sure to update/create this CSS file

const Dashboard = () => {
  const currentWallet = useAddress();
  const [events, setEvents] = useState([]);
  const mockCommunities = getMockCommunities();
  const mockTasks = getMockTasks();

  useEffect(() => {
    const fetchEvents = async () => {
      if (currentWallet) {
        try {
          const res = await fetch(`/api/${currentWallet}`);
          const { data } = await res.json();
          const sortedEvents = data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
          setEvents(sortedEvents);
        } catch (error) {
          console.error("Failed to fetch events:", error);
        }
      }
    };

    fetchEvents();
  }, [currentWallet]);

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <h1>Locals</h1>
        <h2>Events</h2>
        <EventsGrid events={events} />
        <h2>Communities</h2>
        {/* Render your communities here using mock data */}
        <h2>Tasks</h2>
        {/* Render your tasks here using mock data */}
      </main>
    </div>
  );
};

export default Dashboard;
