// pages/api/events/fetch/fetchEvents.js
import { HypercertClient } from "@hypercerts-org/sdk";
import {
  createThirdwebClient,
  useAddress,
  useSigner,
} from "@thirdweb-dev/react";
import { viemAdapter } from "thirdweb/adapters/viem";

const currentWallet = useAddress();
const smartSigner = useSigner();

export async function fetchEvents(setEventsCallback) {
  const twClient = createThirdwebClient({
    clientId: "22f2a1f2653b1f091455a59z951c2ecca",
  });
//sign
  const viemClientWallet = viemAdapter.walletClient.toViem({
    client: twClient,
    chain: 10,
    account: smartSigner,
  });
  const client = new HypercertClient({
    chain: { id: 10 },
    walletClient: viemClientWallet,
    easContractAddress: currentWallet,
  });

  try {
    const ownedEvents = await client.indexer.claimsByOwner(account);
    const eventsWithMetadata = await Promise.all(
      ownedEvents.claims.map(async (event) => {
        // Skip fetching metadata for events with invalid or empty URIs
        if (!event.uri || event.uri.startsWith("{") || event.uri === "") {
          //console.log(`Skipping event due to invalid or empty URI: ${event.uri}`,);
          return null;
        }

        try {
          const metadata = await client.storage.getMetadata(event.uri);
          // Check if the description starts with "GoodOracle Event"
          if (metadata.description.startsWith("GoodOracle Event:")) {
            return {
              ...event,
              metadata: metadata,
            };
          } else {
            //  console.log(`Skipping event as it's not marked as a GoodOracle Event: ${metadata.description}`);
            return null;
          }
        } catch (error) {
          console.error(`Failed to fetch metadata for event:`, error);
          return null;
        }
      }),
    );

    // Filter out null values (events without valid metadata)
    const validEventsWithMetadata = eventsWithMetadata.filter(
      (event) => event !== null,
    );
    setEventsCallback(validEventsWithMetadata);
  } catch (error) {
    console.error("Failed to fetch owned events:", error);
  }
}
