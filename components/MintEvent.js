// components/MintEvent.js

import { useAddress } from "@thirdweb-dev/react";
import styles from "../styles/MintEvent.module.css";
import { ethers } from "ethers";
import {
  HypercertClient,
  formatHypercertData,
  TransferRestrictions,
} from "@hypercerts-org/sdk";
import { optimism } from "viem/chains";
import { createWalletClient, custom } from "viem";
import { useState } from "react";

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

  async function testTx() {
    try {
      console.log(event);
      const response = await fetch(`/api/events/modifyDB/${event._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "updateTxHash",
            txHash: "testHash", // Ensure this is the correct property for the tx hash
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
      console.error("Failed to submit contribution:", error);
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

    console.log("account");
    console.log(account);
    console.log("adress");
    console.log(address);

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
        contributors: [`Event Admin: ${event.creatorWallet}`],
        rights: ["Public Display"],
      });
      if (!valid) {
        console.error("Metadata validation failed:", errors);
        return;
      }

      const units = BigInt(100);
      const restrictions = TransferRestrictions.FromCreatorOnly;

      // Minting the Hypercert
      const client = new HypercertClient({
        chain: { id: 10 },
        walletClient: wallet,
        easContractAddress: currentWallet,
      });

      const tx = await client.mintClaim(metadata, units, restrictions);

      // Call the updated event API endpoint to store the tx hash
      const response = await fetch(`/api/events/modifyDB/${event._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "updateTxHash",
            txHash: tx, // Ensure this is the correct property for the tx hash
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
      <button className={styles.mintButton} onClick={mintEvent}>
        Mint Event
      </button>
      <button className={styles.mintButton} onClick={testTx}>
        Test tx
      </button>
    </div>
  );
};

export default MintEventButton;
