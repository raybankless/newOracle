import { useEffect, useState } from 'react';
import { useEmbeddedWallet } from '@thirdweb-dev/react';
import { HypercertClient } from "@hypercerts-org/sdk";
import { formatHypercertData, TransferRestrictions } from "@hypercerts-org/sdk";
import { viemAdapter } from "thirdweb/adapters/viem";

const HypercertCreator = ({ eventData }) => {
  const [creationStatus, setCreationStatus] = useState('');

  const useCreateHypercert = async () => {
    const embeddedWallet = useEmbeddedWallet();

    // Convert embeddedWallet to viem wallet client using the adapter
    const walletClient = await viemAdapter.walletClient.toViem({ client, chain, embeddedWallet });
    const client = new HypercertClient({
      chainId: 10, // Adjust according to your chain
      walletClient,
    });

    // Format event data to Hypercert metadata
    const { data: metadata, valid, errors } = formatHypercertData({
      // Populate with eventData fields
    });

    if (!valid) {
      console.error(errors);
      setCreationStatus('Metadata invalid');
      return;
    }

    try {
      // Mint hypercert with formatted metadata
      const totalUnits = BigInt(10000);
      const tx = await client.mintClaim(metadata, totalUnits, TransferRestrictions.FromCreatorOnly);
      console.log('Hypercert minted:', tx);
      setCreationStatus('Hypercert minted successfully');
    } catch (error) {
      console.error('Failed to mint hypercert:', error);
      setCreationStatus('Failed to mint hypercert');
    }
  };

  // Use this function to trigger Hypercert creation from your "End Event" button
  // e.g., onClick={() => createHypercert()}

  
};

export default HypercertCreator;