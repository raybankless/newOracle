import React, { useState } from "react";
import { ethers } from "ethers";
import { HypercertClient } from "@hypercerts-org/sdk";
import { useAddress } from "@thirdweb-dev/react";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import styles from "../styles/MintEvent.module.css";

const MintEventButton = ({ event, onMintSuccess, onMintError }) => {
  const currentWallet = useAddress();
  // Additional state and functions would go here...

  const mintWithAllowlist = async () => {
    if (!currentWallet) {
      console.error("No wallet connected!");
      return;
    }

    // Retrieve allowlist from event data
    const allowlist = event.allowListed.map((entry) => ({
      address: entry.wallet,
      units: BigInt(entry.measurement), // Convert measurement to BigInt
    }));

    // Generate leaf nodes for the Merkle tree
    const leaves = allowlist.map((entry) =>
      ethers.utils.solidityKeccak256(
        ["address", "uint256"],
        [entry.address, entry.units]
      )
    );

    // Create the Merkle tree
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

    // Get the Merkle root (this should be recorded on-chain when creating the allowlist)
    const root = tree.getHexRoot();

    // For each allowlist entry, get their proof and mint their fraction
    for (const entry of allowlist) {
      const leaf = ethers.utils.solidityKeccak256(
        ["address", "uint256"],
        [entry.address, entry.units]
      );
      const proof = tree.getHexProof(leaf);
      }
      // Create a new HypercertClient and mint the token
      const hypercertClient = new HypercertClient({
        // Your HypercertClient configuration...
      });

      try {
        const tx = await hypercertClient.mintClaimFractionFromAllowlist({
          claimId: event._id, // Use the correct Hypercert ID
          proof,
          units: entry.units,
          // Other required parameters...
        });

        console.log("Minted fraction for address:", entry.address);
        // Handle post-mint logic, e.g., updating the UI
      } catch (error) {
        console.error("Minting error for address:", entry.address, error);
        // Handle errors, e.g., updating the UI
      }
    
  };

  return (
    <div className={styles.mintButtonContainer}>
      <button className={styles.mintButton} onClick={mintWithAllowlist}>
        Mint With Allowlist
      </button>
    </div>
  );
};

export default MintEventButton;





app.post('/api/events/modifyDB/${eventId}', async (req, res) => {
  
  
  







  // Respond with success message
  res.json({ success: true, message: 'Hypercert minted and proofs stored.', txHash });
});

import { generateMerkleTree, getMerkleProof } from '../../../utils/merkleTree';

// Retrieve allowlist from event data
const allowlist = event.allowListed.map((entry) => ({
  address: entry.wallet,
  units: BigInt(entry.measurement), // Convert measurement to BigInt
}));

// Generate Merkle tree
const tree = generateMerkleTree(allowlist);
const root = tree.getHexRoot();

// Mint the hypercert with the allowlist (root) (pseudo code)
const txHash = await hypercerts.createAllowlist({
  allowList,
  metaData,
  totalUnits,
  transferRestrictions: TransferRestrictions.FromCreatorOnly,
});

// Store proofs in the database for each address
allowlist.forEach(async (item) => {
  const proof = getMerkleProof(tree, item.address);
  // Update your Event model to include the proof for the address
  try {
    const response = await fetch(`/api/events/modifyDB/${eventId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: 'updateProof',
        proof: proof,
      }),
    });

    const data = await response.json();
    if (data.success) {
      console.log("Contribution added successfully : ", data.event);
      setMeasurement("");
      setUnit("");
    } else {
      console.error("Failed to add contribution:", data.message);
    }
  } catch (error) {
    console.error("Failed to submit contribution:", error);
  }
});

[object Object],[object Object],[object Object]

