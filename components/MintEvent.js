// components/MintEvent.js

import { useAddress, useWallet, useSigner } from "@thirdweb-dev/react";
import { useActiveAccount, useConnectedWallets, useActiveWallet } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import {Optimism} from "@thirdweb-dev/chains";
import styles from "../styles/MintEvent.module.css";
import { ethers } from "ethers";
import {
  HypercertClient,
  formatHypercertData,
  TransferRestrictions
} from "@hypercerts-org/sdk";
import { optimism } from "viem/chains";
import { createWalletClient, custom } from "viem";
import { viemAdapter } from "thirdweb/adapters/viem";
import { useState } from "react";
import { generateMerkleTree, getMerkleProof } from "../utils/merkleTree";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";

const MintEventButton = ({ event, onMintSuccess, onMintError }) => {
  const currentWallet = useAddress();
  const [account, setAccount] = useState(null);
  const [address, setAddress] = useState(null);
  const smartSigner = useSigner();

  const twClient = createThirdwebClient({
    clientId: "22f2a1f2653b1f091455a59951c2ecca",
  });

  console.log("viem optimism : ", optimism);
  console.log("thirdweb optimism : ", Optimism);

  const mintEvent = async () => {
    if (!window.ethereum) {
      console.log("MetaMask is not installed!");
      return;
    }

 

    const viemClientWallet = viemAdapter.walletClient.toViem({
      client : twClient,
      chain : 10,
      account : smartSigner,
    });

    console.log("viemClientWallet", viemClientWallet);
    
    const wallet = createWalletClient({
      account: address,
      chain: optimism,

      transport: custom(window.ethereum),
    });

    try {
      const {
        data: metadata,
        valid,
        errors,
      } = formatHypercertData({
        name: event.name,
        description: `GoodOracle Event: ${event.name} - ${event.location} - ${event.description}`,
        image: event.headerImage,
        external_url: event.additionalInfoLink,
        impactScope: [],
        workTimeframeStart: Math.floor(
          new Date(event.startDate).getTime() / 1000,
        ),
        workTimeframeEnd: Math.floor(new Date(event.endDate).getTime() / 1000),
        impactTimeframeStart: Math.floor(
          new Date(event.startDate).getTime() / 1000,
        ),
        impactTimeframeEnd: 0,
        workScope: event.scopeOfWork,
        contributors: [`Event Facilitator: ${event.creatorWallet}`],
        rights: ["Public Display"],
      });
      if (!valid) {
        console.error("Metadata validation failed:", errors);
        return;
      }

      const restrictions = TransferRestrictions.FromCreatorOnly;
      // Retrieve allowlist from event data
      const allowlist = event.allowListed.map((entry) => ({
        address: entry.wallet,
        units: BigInt(entry.measurement), // Convert measurement to BigInt
      }));
      console.log("allowlist : ", allowlist);

      // Total units are the sum of all individual measurements
      const totalUnits = allowlist.reduce(
        (sum, contributor) => sum + contributor.units,
        BigInt(0),
      );

      // Generate Merkle tree
      const tree = generateMerkleTree(allowlist);
      //console.log("tree : ", tree);
      const root = tree.getHexRoot();

      const testAllowList = [
        {
          address: "0x62B69abC7Aad7623F33ac8820893A37218bffce2",
          units: BigInt(10),
        },
        {
          address: "0x5770b2648B0b9b48E82Fb2A5670e07691Ca77f08",
          units: BigInt(20),
        },
      ];

      const client = new HypercertClient({
        chain: {id :10},
        walletClient: viemClientWallet,
        easContractAddress: currentWallet,
      });

      console.log(Array.isArray(allowlist), allowlist);

      // Mint the hypercert with the allowlist 
     const txHash = await client.createAllowlist({
        allowList: allowlist,
        metaData: metadata,
        totalUnits: totalUnits,
        transferRestriction: restrictions,
      });

    /*  // Mint the hypercert without the allowlist 
      const units = BigInt(10);
      const txHash = await client.mintClaim(metadata, units, restrictions);
      */
      
      console.log("txHash : ", txHash);
      // Store proofs in the database for each address
      allowlist.forEach(async (item) => {
        const proof = getMerkleProof(tree, item.address);
        console.log("Proof:", proof);
        
        try {
          const response = await fetch(`/api/events/modifyDB/${eventId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "updateProof",
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

      

      // Store the tx hash
      const response = await fetch(`/api/events/modifyDB/${event._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateTxHash",
          txHash: txHash, // Ensure this is the correct property for the tx hash
        }),
      });
      const data = await response.json();
      if (data.success) {
        console.log("Transaction hash updated successfully:", data);
        onMintSuccess(tx);
      } else {
        console.error("Failed to update transaction hash:", data.message);
        onMintError(new Error("Failed to update transaction hash"));
      }
    } catch (error) {
      console.error("Failed to mint Hypercert:", error);
      onMintError(error);
    }
  };

  return (
    <div className={styles.mintButtonContainer}>
      <span className={styles.navItem} onClick={mintEvent}>
        <FontAwesomeIcon icon={faCoins} />
        Mint Event
      </span>
    </div>
  );
};

export default MintEventButton;


/*
import { defineChain } from "thirdweb";

const myChain = defineChain(myChainId);
import { polygon } from "thirdweb/chains";

const myChain = polygon;
https://portal.thirdweb.com/typescript/v5/chain
*/