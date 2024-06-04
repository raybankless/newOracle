// pages/api/events/fetch/fetchEvents.js
import { HypercertClient } from "@hypercerts-org/sdk";
import {
  createThirdwebClient,
  useAddress,
  useSigner as thirdwebUseSigner,
} from "@thirdweb-dev/react";
import { viemAdapter } from "thirdweb/adapters/viem";
import { useState } from 'react';

// Custom hook for wallet
function useWallet() {
  const [currentWallet, setCurrentWallet] = useState(useAddress());
  return currentWallet;
}

// Custom hook for signer
function useSignerHook() {
  const [smartSigner, setSmartSigner] = useState(thirdwebUseSigner());
  return smartSigner;
}

export async function fetchEvents(setEventsCallback) {
  const twClient = createThirdwebClient({
    clientId: "22f2a1f2653b1f091455a59z951c2ecca",
  });

  //sign
  const viemClientWallet = viemAdapter.walletClient.toViem({
    client: twClient,
    chain: 10,
    account: useSignerHook,
  });
  const client = new HypercertClient({
    chain: { id: 10 },
    walletClient: viemClientWallet,
    easContractAddress: useWallet,
  });

  try {
    const ownedEvents = await client.indexer.claimsByOwner(account);
    const eventsWithMetadata = await Promise.all(
      ownedEvents.claims.map(async (event) => {
        if (!event.uri || event.uri.startsWith("{") || event.uri === "") {
          return null;
        }
        try {
          const metadata = await client.storage.getMetadata(event.uri);
          if (metadata.description.startsWith("GoodOracle Event:")) {
            return {
              ...event,
              metadata: metadata,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error(`Failed to fetch metadata for event:`, error);
          return null;
        }
      })
    );

    const validEventsWithMetadata = eventsWithMetadata.filter(
      (event) => event !== null,
    );
    setEventsCallback(validEventsWithMetadata);
  } catch (error) {
    console.error("Failed to fetch owned events:", error);
  }
}