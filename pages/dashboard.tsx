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
import CommunitiesGrid from "../components/CommunitiesGrid";
import { ethers } from "ethers";

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
  const [communities, setCommunities] = useState([]);
  const [address, setAddress] = useState("");

  const openCommunityModal = () => setIsCommunityModalOpen(true);
  const closeCommunityModal = () => setIsCommunityModalOpen(false);

  const openCommunityDashboard = (communityWallet: string) => {
    setSelectedCommunityId(communityWallet);
    setShowCommunityDashboard(true);
    setIsCommunityModalOpen(false);
  };

  const handleCommunitySelect = (communityId: string) => {
    setSelectedCommunityId(communityId);
    setShowCommunityDashboard(true); // Assuming you have a state to toggle the community dashboard visibility
  };

  interface EthereumError extends Error {
    code?: number;
  }

  async function switchToOptimism() {
    if (window.ethereum) {
      try {
        // Request to switch to the Optimism network (Mainnet)
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xa" }], // 0xa is the chain ID for Optimism Mainnet
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        // assert the type of switchError to be EthereumError
        const error = switchError as EthereumError;
        if (error.code === 4902) {
          try {
            // Request to add the Optimism network to MetaMask.
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xa",
                  rpcUrl: "https://mainnet.optimism.io",
                  // Additional parameters like the chain name, symbol, and block explorer can be added here.
                },
              ],
            });
          } catch (addError) {
            // You can assert addError type similarly if needed
            console.error("Error adding Optimism network:", addError);
          }
        }
        console.error("Error switching to Optimism network:", switchError);
      }
    } else {
      console.log("MetaMask is not installed!");
    }
  }

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const response = await fetch('/api/events/getAll');
        const data = await response.json();
        if (data.success) {
          setEvents(data.events);
        } else {
          console.error('Failed to fetch events:', data.message);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    // Fetch all communities
    const fetchAllCommunities = async () => {
      try {
        const response = await fetch('/api/communities/getAll');
        const data = await response.json();
        if (data.success) {
          setCommunities(data.data);
        } else {
          console.error('Failed to fetch communities:', data.message);
        }
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };

    fetchAllEvents();
    fetchAllCommunities();
    }, []);

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
        {showCommunityDashboard && selectedCommunityId ? (
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
            <EventsGrid events={events.slice(0, 8)} onEventSelect={handleEventSelect} />
            <h2>Communities</h2>
            <CommunitiesGrid
              communities={communities.slice(0, 8)}
              onCommunitySelect={handleCommunitySelect}
            />
            <h2>Tasks</h2>
            {showCreateEventModal && (
              <CreateEventModal setShowModal={setShowCreateEventModal} onEventCreated ={handleEventSelect} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
