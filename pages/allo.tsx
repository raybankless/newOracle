// pages/allo.tsx
import React, { useState, useEffect } from "react";
import { createThirdwebClient } from "thirdweb";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import { ethers } from "ethers";
import { alloInteraction } from "../components/AlloContractInteraction";
import styles from "../styles/Allo.module.css";

const client = createThirdwebClient({
  clientId: "22f2a1f2653b1f091455a59z951c2ecca",
});

const ALLO_CONTRACT_ADDRESS = "0xf5f35867AEccF350B55b90E41044F47428950920"; // Replace with your contract address
const STRATEGY_ADDRESS = "0xeED429051B60b77F0492435D6E3F6115d272fE93"; // Update with your strategy address

const Allo: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [percentFee, setPercentFee] = useState<string>("");
  const [baseFee, setBaseFee] = useState<string>("");
  const [treasury, setTreasury] = useState<string>("");
  const [newPercentFee, setNewPercentFee] = useState<string>("");
  const [newBaseFee, setNewBaseFee] = useState<string>("");
  const [newTreasury, setNewTreasury] = useState<string>("");

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const wallet = createWallet("io.metamask");
      if (injectedProvider("io.metamask")) {
        const account = await wallet.connect({ client });
        setWalletAddress(account.address);
        console.log("Connected to MetaMask:", account);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const allo = alloInteraction(signer);
        fetchContractInfo(allo);
      } else {
        throw new Error("MetaMask is not installed");
      }
    } catch (err: any) {
      console.error("MetaMask connection failed:", err);
      setError(err.message || "An unknown error occurred");
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchContractInfo = async (
    allo: ReturnType<typeof alloInteraction>,
  ) => {
    try {
      console.log("Fetching contract info...");
      const percentFeeValue = await allo.getPercentFee();
      const baseFeeValue = await allo.getBaseFee();
      const treasuryAddress = await allo.getTreasury();

      setPercentFee(ethers.utils.formatUnits(percentFeeValue, 16));
      setBaseFee(ethers.utils.formatEther(baseFeeValue));
      setTreasury(treasuryAddress);
      console.log("Contract info fetched successfully");
    } catch (err: any) {
      console.error("Failed to fetch contract info:", err);
      setError(`Failed to fetch contract info: ${err.message}`);
    }
  };

  const handleUpdatePercentFee = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const allo = alloInteraction(signer);
      const tx = await allo.updatePercentFee(
        signer,
        ethers.utils.parseUnits(newPercentFee, 16),
      );
      await tx.wait();
      setNewPercentFee("");
      fetchContractInfo(allo);
      console.log("Percent fee updated successfully");
    } catch (err: any) {
      console.error("Failed to update percent fee:", err);
      setError(`Failed to update percent fee: ${err.message}`);
    }
  };

  const handleUpdateBaseFee = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const allo = alloInteraction(signer);
      const tx = await allo.updateBaseFee(
        signer,
        ethers.utils.parseEther(newBaseFee),
      );
      await tx.wait();
      setNewBaseFee("");
      fetchContractInfo(allo);
      console.log("Base fee updated successfully");
    } catch (err: any) {
      console.error("Failed to update base fee:", err);
      setError(`Failed to update base fee: ${err.message}`);
    }
  };

  const handleUpdateTreasury = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const allo = alloInteraction(signer);
      const tx = await allo.updateTreasury(signer, newTreasury);
      await tx.wait();
      setNewTreasury("");
      fetchContractInfo(allo);
      console.log("Treasury updated successfully");
    } catch (err: any) {
      console.error("Failed to update treasury:", err);
      setError(`Failed to update treasury: ${err.message}`);
    }
  };

  const handleCreateProgram = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const allo = alloInteraction(signer);

      // Ensure this is a valid profile ID that exists in the Registry contract
      const profileId = ethers.utils.id("profileId");
      const strategy = STRATEGY_ADDRESS;
      const initData = "0x"; // This might need to be actual initialization data
      const token = ethers.constants.AddressZero; // Using ETH
      const amount = ethers.utils.parseEther("1");
      const metadata = {
        protocol: 1,
        pointer: "QmYwAPJzv5CZsnAzt8auVZRnLRG3FGMyz5bnF2C6UrQ1zK"
      };
      const managers = [await signer.getAddress()];

      console.log("Creating pool with the following parameters:");
      console.log("Profile ID:", profileId);
      console.log("Strategy:", strategy);
      console.log("Init Data:", initData);
      console.log("Token:", token);
      console.log("Amount:", amount.toString());
      console.log("Metadata:", metadata);
      console.log("Managers:", managers);

      const tx = await allo.createPool(
        profileId,
        strategy,
        initData,
        token,
        amount,
        metadata,
        managers,
        { value: amount } // Include this if you're funding with ETH
      );

      await tx.wait();
      console.log("Program created successfully");
    } catch (err) {
      console.error("Failed to create program:", err);
      setError(`Failed to create program: ${err.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Allo Dashboard</h1>
      <div className={styles.connectWalletContainer}>
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className={styles.button}
        >
          {isConnecting ? "Connecting..." : "Connect to MetaMask"}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
      {walletAddress && (
        <div className={styles.infoSection}>
          <p>Connected Wallet Address: {walletAddress}</p>
          <p>Base Fee: {baseFee} ETH</p>
          <p>Percentage Fee: {percentFee}%</p>
          <p>Treasury Address: {treasury}</p>
          <div>
            <input
              type="text"
              value={newPercentFee}
              onChange={(e) => setNewPercentFee(e.target.value)}
              placeholder="New Percentage Fee"
            />
            <button onClick={handleUpdatePercentFee} className={styles.button}>
              Update Percentage Fee
            </button>
          </div>
          <div>
            <input
              type="text"
              value={newBaseFee}
              onChange={(e) => setNewBaseFee(e.target.value)}
              placeholder="New Base Fee (ETH)"
            />
            <button onClick={handleUpdateBaseFee} className={styles.button}>
              Update Base Fee
            </button>
          </div>
          <div>
            <input
              type="text"
              value={newTreasury}
              onChange={(e) => setNewTreasury(e.target.value)}
              placeholder="New Treasury Address"
            />
            <button onClick={handleUpdateTreasury} className={styles.button}>
              Update Treasury
            </button>
          </div>
          <div>
            <button onClick={handleCreateProgram} className={styles.button}>
              Create Program
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Allo;
