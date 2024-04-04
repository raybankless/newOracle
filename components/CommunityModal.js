// components/CommunityModal.js

import React, { useState, useEffect } from 'react';
import styles from '../styles/CommunityModal.module.css';
import { createThirdwebClient } from "thirdweb";
import { createWallet, injectedProvider, MetaMaskWallet } from "thirdweb/wallets";
import {ethers} from "ethers";
import SafeApiKit from '@safe-global/api-kit'
import { ApiKit, SafeService } from '@safe-global/api-kit';


const CommunityModal = ({ isOpen, onClose }) => {
  

  const [walletAddress, setWalletAddress ] =  useState ("");
  const [safeWallets, setSafeWallets] = useState([]);
  const safeService = new SafeApiKit({
    chainId: 10n,
    // Optional. txServiceUrl must be used to set a custom service. For example on chains where Safe doesn't run services.
    txServiceUrl: 'https://safe-transaction-optimism.safe.global'
  })

  /* const apiKit = new ApiKit({
    chainId: 10n,
    // Optional. txServiceUrl must be used to set a custom service. For example on chains where Safe doesn't run services.
    txServiceUrl: 'https://safe-transaction-optimism.safe.global'
  }) */

  
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
  // if user has metamask installed, connect to it
  const connect = async () => 
  {
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
    setWalletAddress(tempAddress);
    console.log("Connected to MetaMask:", walletAddress);

    //const safes = await safeService.getSafesByOwner(walletAddress)
    //console.log("Safes:", safes);
    
  }

  useEffect(() => {
    if (isOpen) {
      connect();
    }
    
  }, [isOpen]);

  useEffect(() => {
    if (walletAddress) {
      fetchSafeWallets();
    }
  }, [walletAddress]);

  const fetchSafeWallets = async () => {
    try {
      const safesResponse = await safeService.getSafesByOwner(walletAddress);
      setSafeWallets(safesResponse.safes); // Adjust according to the actual response structure
      console.log("Fetched Safe Wallets:", safesResponse.safes);
    } catch (error) {
      console.error("Error fetching Safe Wallets:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Create Community</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.modalBody}>
          {/* Community creation form will go here */}
          <ul>
            {safeWallets.map((safeWallet) => (
              <li key={safeWallet}>{safeWallet}</li> // Adjust based on the structure of safeWallets
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommunityModal;




