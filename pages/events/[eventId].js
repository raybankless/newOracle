// pages/events/[eventId].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAddress } from "@thirdweb-dev/react";
import {
  HypercertClient,
  formatHypercertData,
  TransferRestrictions,
} from "@hypercerts-org/sdk";
import HomeButton from "../../components/HomeButton";
import LoginModal from "../../components/LoginModal";
import MintEventButton from "../../components/MintEvent";
import styles from "../../styles/EventDetail.module.css";
import { ethers } from "ethers";
import hypercertABI from "../../abis/hypercertABI.json";
import { createWalletClient, custom } from 'viem';
import {optimism} from "viem/chains";

export default function EventDetail() {
  const router = useRouter();
  const { eventId } = router.query;
  const [event, setEvent] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const currentWallet = useAddress();
  const contractAddress = "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07";
  const [hypercertData, setHypercertData] = useState("");
  

  useEffect(() => {
    if (!eventId) return;
    console.log("Fetching event details for eventId:", eventId);
    fetch(`/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Event details fetched successfully:", data.event);
          setEvent(data.event);
        } else {
          // Redirect or handle the error if the event is not found
          router.push("/events");
        }
      })
      .catch((error) => {
        console.error("Could not fetch the event:", error);
        router.push("/events");
      });
  }, [eventId, currentWallet, router]);

  async function switchToOptimism() {
    if (window.ethereum) {
      try {
        // Request to switch to the Optimism network (Mainnet)
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xa' }], // 0xa is the chain ID for Optimism Mainnet
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            // Request to add the Optimism network to MetaMask
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xa',
                rpcUrl: 'https://mainnet.optimism.io',
                // Additional parameters like the chain name, symbol, and block explorer can be added here
              }],
            });
          } catch (addError) {
            console.error('Error adding Optimism network:', addError);
          }
        }
        console.error('Error switching to Optimism network:', switchError);
      }
    } else {
      console.log('MetaMask is not installed!');
    }
  }

  // Function to end the event and create a Hypercert
  const endEvent = async () => {
    
    const response = await fetch(`/api/events/endEvent/${eventId}`, {
      method: "POST",
    });
    const data = await response.json();
    
    if (data.success) {
      await switchToOptimism();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_accounts", []);
      const account = await ethereum.request({method: 'eth_accounts'});
      const signer = provider.getSigner();
      const address = account[0];
      const wallet =  createWalletClient({
        account : address,
        chain : optimism,
        transport : custom (window.ethereum),
      })
      console.log(wallet)
      
      const contract = new ethers.Contract(contractAddress, hypercertABI, signer);
      try {
        const {
          data: metadata,
          valid,
          errors,
        } = formatHypercertData({
          name: event.name,
          description: `${event.location}  -  ${event.description}`,
          image: event.headerImage,
          external_url: event.additionalInfoLink,
          impactScope: [],
          workTimeframeStart: Math.floor(
            new Date(event.startDate).getTime() / 1000,
          ),
          workTimeframeEnd: Math.floor(
            new Date(event.endDate).getTime() / 1000,
          ),
          impactTimeframeStart: Math.floor(
            new Date(event.startDate).getTime() / 1000,
          ),
          impactTimeframeEnd: 0,
          workScope: event.scopeOfWork,
          contributors: [`Event Admin: ${event.creatorWallet}`],
          rights: ["Public Display"],
        });
        if (!valid) {
          console.error("Metadata validation failed:", errors);
          return;
        }
        setHypercertData(JSON.stringify(metadata)); 
        
        
        const units = BigInt(100);
        const restrictions = TransferRestrictions.FromCreatorOnly;
        
            /*  // Mint the Hypercert with contract interaction
              try {
                console.log("hypercertData");
                console.log(hypercertData);
                const tx = await contract.mintClaim(address, units, hypercertData, restrictions);
                await tx.wait(); // Wait for the transaction to be mined
                console.log("Mint successful", tx);
              } catch (error) {
                console.error("Mint failed", error);
              }*/

         // Mint the Hypercert with hypercert client
        const client = new HypercertClient({
          chain : { id: 10 },
          walletClient: wallet,
          easContractAddress : currentWallet,
        });
        
        console.log("hypertcertData");
        console.log(hypercertData);
        console.log("metadata");
        console.log(metadata);

        
       try {
          const tx = await client.mintClaim(
            metadata,
            units,
            restrictions,
          );
          console.log("Hypercert minted:", tx);
        } catch (mintError) {
          console.error("tx error:", mintError );
         console.error("tx error:", mintError.transcationHash );
         console.error("tx error.payload:", mintError.payload );
        }
      



      } catch (error) {
        console.error("Failed to create Hypercert:", error);
      }
    
    } else {
      alert("Failed to end the event.");
    }
  };
  
  const showLoginButton = !currentWallet;
  const showEndEventButton =
    currentWallet && event?.creatorWallet === currentWallet;

  if (!event) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <HomeButton />
      <h1 className={styles.textBlack}>{event.name}</h1>
      <p className={styles.textBlack}>{event.description}</p>
      <p className={styles.textBlack}>{event.creatorWallet}</p>
      <p className={styles.textBlack}>{event.startDate}</p>
      {/* Conditional button rendering based on user connection and role */}
      {showLoginButton && (
        <button
          className={styles.loginButton}
          onClick={() => setShowLoginModal(true)}
        >
          Log In
        </button>
      )}
      {showEndEventButton && (
        <div>
          <button onClick={endEvent} className={styles.endEventButton}>
            End Event
          </button>
          <MintEventButton 
            event={event} 
            onMintSuccess={(tx) => console.log('Minted successfully', tx)}
            onMintError={(error) => console.error('Minting error', error)}
          />
        </div>
      )}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
}
