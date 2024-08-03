// pages/allo.tsx
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { alloInteraction } from "../components/AlloContractInteraction.js";
import { useConnect } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

const Allo = () => {
  const [percentFee, setPercentFee] = useState("");
  const [baseFee, setBaseFee] = useState("");
  const [treasury, setTreasury] = useState("");
  const [newPercentFee, setNewPercentFee] = useState("");
  const [error, setError] = useState(null);
  const [allo, setAllo] = useState(null);
  const [newBaseFee, setNewBaseFee] = useState("");
  const [newTreasury, setNewTreasury] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const { connect, isConnecting, connectionError } = useConnect();

  const handleConnect = async () => {
    try {
      console.log("Attempting to connect to MetaMask...");
      await connect(async () => {
        const wallet = createWallet("io.metamask");
        await wallet.connect();
        console.log("Successfully connected to MetaMask");
        setIsConnected(true);
        return wallet;
      });
    } catch (err) {
      console.error("MetaMask connection failed:", err);
      setError(`MetaMask connection failed: ${err.message}`);
    }
  };

  useEffect(() => {
    const initializeAllo = async () => {
      if (typeof window.ethereum !== "undefined" && isConnected) {
        console.log("Initializing Allo interaction...");
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const alloInstance = alloInteraction(provider);
          setAllo(alloInstance);
          await fetchContractInfo(alloInstance);
          console.log("Allo interaction initialized successfully");
        } catch (err) {
          console.error("Failed to initialize Allo interaction:", err);
          setError(`Failed to initialize Allo: ${err.message}`);
        }
      } else if (isConnected) {
        console.error("MetaMask not detected");
        setError("Please install MetaMask to use this dApp");
      }
    };

    if (isConnected) {
      initializeAllo();
    }
  }, [isConnected]);

  const fetchContractInfo = async (alloInstance) => {
    try {
      console.log("Fetching contract info...");
      const percentFeeValue = await alloInstance.getPercentFee();
      const baseFeeValue = await alloInstance.getBaseFee();
      const treasuryAddress = await alloInstance.getTreasury();

      setPercentFee(ethers.utils.formatUnits(percentFeeValue, 18));
      setBaseFee(ethers.utils.formatEther(baseFeeValue));
      setTreasury(treasuryAddress);

      console.log("Contract info fetched successfully");
    } catch (err) {
      console.error("Failed to fetch contract info:", err);
      setError(`Failed to fetch contract info: ${err.message}`);
    }
  };

  const handleUpdatePercentFee = async () => {
    if (!allo) {
      console.error("Allo interaction not initialized");
      setError("Allo interaction not initialized");
      return;
    }

    try {
      console.log("Updating percent fee...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const percentFeeInWei = ethers.utils.parseUnits(newPercentFee, 16);
      const tx = await allo.updatePercentFee(signer, percentFeeInWei);
      console.log("Update percent fee transaction sent:", tx.hash);
      await tx.wait();
      console.log("Update percent fee transaction confirmed");

      const updatedPercentFee = await allo.getPercentFee();
      setPercentFee(ethers.utils.formatUnits(updatedPercentFee, 18));
      setNewPercentFee("");
      console.log("Percent fee updated successfully");
    } catch (err) {
      console.error("Failed to update percent fee:", err);
      setError(`Failed to update percent fee: ${err.message}`);
    }
  };

  const handleUpdateBaseFee = async () => {
    if (!allo) {
      console.error("Allo interaction not initialized");
      setError("Allo interaction not initialized");
      return;
    }

    try {
      console.log("Updating base fee...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const baseFeeInWei = ethers.utils.parseEther(newBaseFee);
      const tx = await allo.updateBaseFee(signer, baseFeeInWei);
      console.log("Update base fee transaction sent:", tx.hash);
      await tx.wait();
      console.log("Update base fee transaction confirmed");

      const updatedBaseFee = await allo.getBaseFee();
      setBaseFee(ethers.utils.formatEther(updatedBaseFee));
      setNewBaseFee("");
      console.log("Base fee updated successfully");
    } catch (err) {
      console.error("Failed to update base fee:", err);
      setError(`Failed to update base fee: ${err.message}`);
    }
  };

  const handleUpdateTreasury = async () => {
    if (!allo) {
      console.error("Allo interaction not initialized");
      setError("Allo interaction not initialized");
      return;
    }

    try {
      console.log("Updating treasury address...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const tx = await allo.updateTreasury(signer, newTreasury);
      console.log("Update treasury transaction sent:", tx.hash);
      await tx.wait();
      console.log("Update treasury transaction confirmed");

      const updatedTreasury = await allo.getTreasury();
      setTreasury(updatedTreasury);
      setNewTreasury("");
      console.log("Treasury address updated successfully");
    } catch (err) {
      console.error("Failed to update treasury:", err);
      setError(`Failed to update treasury: ${err.message}`);
    }
  };

  return (
    <div>
      <h1>Allo Dashboard</h1>
      {!isConnected ? (
        <button onClick={handleConnect} disabled={isConnecting}>
          {isConnecting ? 'Connecting...' : 'Connect to MetaMask for Allo'}
        </button>
      ) : (
        <>
          <p>Current Percent Fee: {percentFee}%</p>
          <p>Base Fee: {baseFee} ETH</p>
          <p>Treasury Address: {treasury}</p>
          <div>
            <input
              type="text"
              value={newPercentFee}
              onChange={(e) => setNewPercentFee(e.target.value)}
              placeholder="New Percent Fee"
            />
            <button onClick={handleUpdatePercentFee}>Update Percent Fee</button>
          </div>
          <div>
            <input
              type="text"
              value={newBaseFee}
              onChange={(e) => setNewBaseFee(e.target.value)}
              placeholder="New Base Fee (ETH)"
            />
            <button onClick={handleUpdateBaseFee}>Update Base Fee</button>
          </div>
          <div>
            <input
              type="text"
              value={newTreasury}
              onChange={(e) => setNewTreasury(e.target.value)}
              placeholder="New Treasury Address"
            />
            <button onClick={handleUpdateTreasury}>Update Treasury</button>
          </div>
        </>
      )}
      {(error || connectionError) && <p style={{ color: "red" }}>{error || connectionError.message}</p>}
    </div>
  );
};

export default Allo;