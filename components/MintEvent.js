// components/MintEvent.js

import { useAddress } from "@thirdweb-dev/react";
import styles from "../styles/MintEvent.module.css";
import { ethers } from "ethers";
import {
  HypercertClient,
  formatHypercertData,
  TransferRestrictions
} from "@hypercerts-org/sdk";
import { optimism } from "viem/chains";
import { createWalletClient, custom } from "viem";
import { useState } from "react";
import { generateMerkleTree, getMerkleProof } from "../utils/merkleTree";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";

const MintEventButton = ({ event, onMintSuccess, onMintError }) => {
  const currentWallet = useAddress();
  const [account, setAccount] = useState(null);
  const [address, setAddress] = useState(null);

  async function switchToOptimism() {
    if (window.ethereum) {
      try {
        // Request to switch to the Optimism network (Mainnet)
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xa" }], // 0xa is the chain ID for Optimism Mainnet
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            // Request to add the Optimism network to MetaMask
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xa",
                  rpcUrl: "https://mainnet.optimism.io",
                  // Additional parameters like the chain name, symbol, and block explorer can be added here
                },
              ],
            });
          } catch (addError) {
            console.error("Error adding Optimism network:", addError);
          }
        }
        console.error("Error switching to Optimism network:", switchError);
      }
    } else {
      console.log("MetaMask is not installed!");
    }
  }

  const mintEvent = async () => {
    if (!window.ethereum) {
      console.log("MetaMask is not installed!");
      return;
    }

    await switchToOptimism();

    await window.ethereum.request({ method: "eth_requestAccounts" }); // Request user to connect their MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    await provider.send("eth_accounts", []);
    const tempAccount = await ethereum.request({ method: "eth_accounts" });
    const tempAddress = await signer.getAddress();
    setAccount(tempAccount);
    setAddress(tempAddress);

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
      console.log("event : ", event);
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
      console.log("tree : ", tree);
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
        chain: { id: 10 },
        walletClient: wallet,
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

      // const tx = await client.mintClaim(metadata, units, restrictions);

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
