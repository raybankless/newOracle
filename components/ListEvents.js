/*
// components/ListEvents.js
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  HypercertClient
} from "@hypercerts-org/sdk";
//import { optimism } from "viem/chains";
//import { createWalletClient, custom } from "viem";
import styles from "../styles/ListEvents.module.css";

const ListEvents = () => {
  const [events, setEvents] = useState([]);
  const fetchEvents = async () => {
    if (!window.ethereum) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_accounts", []);
    const account = await ethereum.request({method: 'eth_accounts'});
    const address = account[0];

    const wallet = createWalletClient({
      account: address,
      chain: optimism,
      transport: custom(window.ethereum),
    });

    const client = new HypercertClient({
      chain: { id: 10 },
      walletClient: wallet,
      easContractAddress: address,
    });

    const indexer = client.indexer;

    try {
      const ownedEvents = await indexer.claimsByOwner(account);
      setEvents(ownedEvents);
      console.log("Events:", events);
    } catch (error) {
      console.error("Failed to fetch owned events:", error);
    }
  };
  useEffect(() => {


    fetchEvents();

  });

  return (
    <div className={styles.listEventsContainer}>
      <h2 className={styles.h2}>My Collection</h2>
      {events.length > 0 ? (
        <ul className={styles.eventsList}>
          {events.map((event, index) => (
            <li key={index} className={styles.eventItem}>

              <p>{event.name}</p>
              <p>{event.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );

};

export default ListEvents;

*/