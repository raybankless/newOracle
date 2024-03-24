// pages/api/events/fetch/fetchEvents.js
import { ethers } from "ethers";
import { HypercertClient } from "@hypercerts-org/sdk";
import { optimism } from "viem/chains";
import { createWalletClient, custom } from "viem";

export async function fetchEvents(setEventsCallback) {
  if (!window.ethereum) return;

  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts = await provider.listAccounts();
  if (accounts.length === 0) return; // No accounts connected
  const account = accounts[0]; // Use the first account

  const wallet = createWalletClient({
    account: account,
    chain: optimism,
    transport: custom(window.ethereum),
  });

  const client = new HypercertClient({
    chain: { id: 10 },
    walletClient: wallet,
    easContractAddress: account,
  });

  try {
    const ownedEvents = await client.indexer.claimsByOwner(account);
    const eventsWithMetadata = await Promise.all(
      ownedEvents.claims.map(async (event) => {
        // Skip fetching metadata for events with invalid or empty URIs
        if (!event.uri || event.uri.startsWith('{') || event.uri === '') {
          console.log(`Skipping event due to invalid or empty URI: ${event.uri}`);
          return null;
        }

        try {
          const metadata = await client.storage.getMetadata(event.uri);
          return {
            ...event,
            metadata: metadata,
          };
        } catch (error) {
          console.error(`Failed to fetch metadata for event:`, error);
          return null;
        }
      })
    );

    // Filter out null values (events without valid metadata)
    const validEventsWithMetadata = eventsWithMetadata.filter(event => event !== null);
    setEventsCallback(validEventsWithMetadata);
  } catch (error) {
    console.error("Failed to fetch owned events:", error);
  }
}
