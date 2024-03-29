// pages/dashboard.tsx
import { useEffect, useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import Sidebar from "../components/Sidebar";
import EventsGrid from "../components/EventsGrid";
import { getMockCommunities, getMockTasks } from "../utils/mockData";
import styles from "../styles/Dashboard.module.css"; // Make sure to update/create this CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import CreateEventModal from "../components/CreateEventModal";
import EventDetail from "../components/EventDetail";
import RightSidebar from "../components/RightSidebar";
import Event from "../models/Event";

const Dashboard = () => {
  const currentWallet = useAddress();
  const [events, setEvents] = useState<Event[]>([]);
  const mockCommunities = getMockCommunities();
  const mockTasks = getMockTasks();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (currentWallet) {
        try {
          const res = await fetch(`/api/${currentWallet}`);
          const { data } = await res.json();
          if (data && Array.isArray(data)) {
            // Sort the events based on the createdAt field in descending order
            const sortedEvents = data.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );

            setEvents(sortedEvents);
          }
        } catch (error) {
          console.error("Failed to fetch events:", error);
        }
      }
    };
    fetchEvents();
  }, [currentWallet]);

  const handleEventSelect = (eventId) => {
    setSelectedEventId(eventId);
  };

  const handleBack = () => {
    setSelectedEventId(null); // Go back to grid view
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        {selectedEventId ? (
          <EventDetail eventId={selectedEventId} onBack={handleBack} />
        ) : (
          <>
            <EventsGrid events={events} onEventSelect={handleEventSelect} />
            <h2>Tasks</h2>
            <h2>Communities</h2>
          </>
        )}
      </main>
      <RightSidebar />
    </div>
  );
};

export default Dashboard;
