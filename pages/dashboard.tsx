// pages/dashboard.tsx
import { useEffect, useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import Sidebar from "../components/Sidebar";
import EventsGrid from "../components/EventsGrid";
import styles from "../styles/Dashboard.module.css"; // Make sure to update/create this CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import CreateEventModal from "../components/CreateEventModal";
import EventDetail from "../components/EventDetail";
import { useRouter } from "next/router";
import CommunityModal from "../components/CommunityModal";
import CommunityDashboard from "../components/CommunityDashboard";

const Dashboard = () => {
  const currentWallet = useAddress();
  const [events, setEvents] = useState<Event[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const router = useRouter();
  const [qrSend, setQrSend] = useState(null);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState("");
  const [showCommunityDashboard, setShowCommunityDashboard] = useState(false);

  const openCommunityModal = () => setIsCommunityModalOpen(true);
  const closeCommunityModal = () => setIsCommunityModalOpen(false);

  const openCommunityDashboard = (communityWallet: string) => {
    setSelectedCommunityId(communityWallet);
    setShowCommunityDashboard(true);
    setIsCommunityModalOpen(false);
  };
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
            setQrSend(qrData);
          }
        } catch (error) {
          console.error("Error parsing QR data:", error);
        }
      }
    };

    if (router.isReady) {
      handleQRData();
    }
  }, [router.isReady, router.query.data, currentWallet]);

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        {showCommunityDashboard ? (
          <CommunityDashboard communityWallet={selectedCommunityId} />
        ) : selectedEventId ? (
          <EventDetail
            eventId={selectedEventId}
            qrCode={qrSend}
            currentWallet={currentWallet}
          />
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
                    <a onClick={openCommunityModal}>Community</a>
                  </div>
                )}
              </div>
            </div>
            <CommunityModal
              isOpen={isCommunityModalOpen}
              onClose={closeCommunityModal}
              onOpenCommunityDashboard={openCommunityDashboard}
            />
            <h2>Events</h2>
            <EventsGrid events={events} onEventSelect={handleEventSelect} />
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
