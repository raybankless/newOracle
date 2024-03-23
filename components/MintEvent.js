import React from "react";
import { useAddress } from "@thirdweb-dev/react";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,s
} from "thirdweb/react";
import { ethers } from "ethers";
import {
  HypercertClient,
  formatHypercertData,
  TransferRestrictions,
} from "@hypercerts-org/sdk";
import { optimism } from "viem/chains";
import { createWalletClient, custom } from "viem";
import styles from '../styles/MintEvent.module.css';

const MintEventButton = ({ event, onMintSuccess, onMintError }) => {
  const currentWallet = useAddress();
  const twAccount = useActiveAccount();
  const twChain = useActiveWalletChain();
  const twWallet = useActiveWallet();

  console.log("twAccount");
  console.log(twAccount);
  console.log("twChain");
  console.log(twChain);
  console.log("twWallet");
  console.log(twWallet);

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
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
    } catch (error) {
      console.log("provider");
      console.log(error);
    }

    await provider.send("eth_accounts", []);
    const account = await ethereum.request({ method: "eth_accounts" });
    const address = account[0];

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
        description: `${event.location}  -  ${event.description}`,
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

      /*  // Mint the Hypercert with contract interaction
            try {
              console.log("hypercertData");
              console.log(hypercertData);
              const tx = await contract.mintClaim(address, units, hypercertData, restrictions);
              await tx.wait(); // Wait for the transaction to be mined
              console.log("Mint successful", tx);
            } catch (error) {
              console.error("Mint failed", error);
            }*/

      // Mint the Hypercert with hypercert client
      const client = new HypercertClient({
        chain: { id: 10 },
        walletClient: wallet,
        easContractAddress: currentWallet,
      });

      try {
        const tx = await client.mintClaim(metadata, units, restrictions);
        onMintSuccess(tx);
      } catch (mintError) {
        onMintError(mintError);
      }
    } catch (error) {
      console.error("Failed to create Hypercert:", error);
    }
  };

  return (
    <div className={styles.mintButtonContainer}>
      <button className={styles.mintButton} onClick={mintEvent}>
        Mint Hypercert
      </button>
    </div>
  );
};

export default MintEventButton;
