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
