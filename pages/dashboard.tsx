// pages/dashboard.tsx
import { useEffect, useState } from "react";
import { useAddress, useSigner } from "@thirdweb-dev/react";
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
import { useRouter } from "next/router";
import { QRDetection } from "../utils/QRDetection";

const Dashboard = () => {
  const currentWallet = useAddress();
  const [events, setEvents] = useState<Event[]>([]);
  const mockCommunities = getMockCommunities();
  const mockTasks = getMockTasks();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const router = useRouter();
  const [qrSend, setQrSend] = useState(null);

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

  useEffect(() => {
    const handleQRData = async () => {
    let queryData = router.query.data;
    // This ensures queryData is a string
    if (Array.isArray(queryData)) {
      queryData = queryData[0];
    }
    
    if (queryData) {
      try {
        const decodedData = decodeURIComponent(queryData);
        const qrData = JSON.parse(decodedData);

        if (qrData.action === "contribute" && qrData.eventId) {
          console.log("Event ID from QR:", qrData.eventId);
          setSelectedEventId(qrData.eventId);
          setQrSend (qrData);
        }
      } catch (error) {
        console.error("Error parsing QR data:", error);
      }
    }
    
  }

    if (router.isReady) {
      handleQRData();
    }
  }, [router.isReady, router.query.data, currentWallet]);

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  /*useEffect(() => {
    let queryData = router.query.data;
    if (Array.isArray(queryData)) {
      queryData = queryData[0];
    }
    console.log("queryData1 : ", queryData)
    
    if (queryData) {
      try {
        const decodedData = decodeURIComponent(queryData);
        const qrData = JSON.parse(decodedData);

        if (qrData.action === "contribute" && qrData.eventId) {
          console.log("Event ID from QR:", qrData.eventId);
          setSelectedEventId(qrData.eventId);
        }
      } catch (error) {
        console.error("Error parsing QR data:", error);
      }
    }
  }, [router.query]);

*/

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        {selectedEventId ? (
          <EventDetail eventId={selectedEventId} qrCode={qrSend } currentWallet={currentWallet} />
        ) : (
          <>
            <div className={styles.headerWithButton}>
              <h1>Locals</h1>
              <div
                className={styles.createButton}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <FontAwesomeIcon icon={faPlus} /> Create
                {showDropdown && (
                  <div className={styles.dropdownContent}>
                    <a onClick={() => setShowCreateEventModal(true)}>Event</a>
                    <Link href="/create-task">Task</Link>
                    <Link href="/create-community">Community</Link>
                  </div>
                )}
              </div>
            </div>
            <h2>Events</h2>
            <EventsGrid events={events}  onEventSelect={handleEventSelect} />
            <h2>Tasks</h2>
            <h2>Communities</h2>
            {showCreateEventModal && (
              <CreateEventModal setShowModal={setShowCreateEventModal} />
            )}
          </>
        )}
      </main>
      
    </div>
  );
};

export default Dashboard;
