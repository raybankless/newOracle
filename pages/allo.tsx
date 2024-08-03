// pages/allo.tsx
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { alloInteraction } from "../components/AlloContractInteraction.js";

const Allo: React.FC = () => {
  const [percentFee, setPercentFee] = useState<string>("");
  const [baseFee, setBaseFee] = useState<string>("");
  const [treasury, setTreasury] = useState<string>("");
  const [newPercentFee, setNewPercentFee] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [allo, setAllo] = useState<ReturnType<typeof alloInteraction> | null>(
    null,
  );
  const [newBaseFee, setNewBaseFee] = useState<string>("");
  const [newTreasury, setNewTreasury] = useState<string>("");
  const [denominator, setDenominator] = useState<string>("");

  useEffect(() => {
    const initializeAllo = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const alloInstance = alloInteraction(provider);
        setAllo(alloInstance);
        await fetchContractInfo(alloInstance);
      } else {
        setError("Please install MetaMask to use this dApp");
      }
    };

    initializeAllo();
  }, []);

  const fetchContractInfo = async (
    alloInstance: ReturnType<typeof alloInteraction>,
  ) => {
    try {
      const denominatorValue = await alloInstance.getFeeDenominator();
      setDenominator(ethers.utils.formatUnits(denominatorValue, 0));
      
      const percentFeeValue = await alloInstance.getPercentFee();
      setPercentFee(ethers.utils.formatUnits(percentFeeValue, 18));

      const baseFeeValue = await alloInstance.getBaseFee();
      setBaseFee(ethers.utils.formatEther(baseFeeValue));

      const treasuryAddress = await alloInstance.getTreasury();
      setTreasury(treasuryAddress);
    } catch (err) {
      console.error("Failed to fetch contract info:", err);
      setError("Failed to fetch contract information");
    }
  };

  const handleUpdatePercentFee = async () => {
    if (!allo) {
      setError("Allo interaction not initialized");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const percentFeeInWei = ethers.utils.parseUnits(newPercentFee, 16);
      const tx = await allo.updatePercentFee(signer, percentFeeInWei);
      await tx.wait();

      // Refresh the percent fee
      const updatedPercentFee = await allo.getPercentFee();
      setPercentFee(ethers.utils.formatUnits(updatedPercentFee, 18));
      setNewPercentFee("");
    } catch (err) {
      console.error("Failed to update percent fee:", err);
      setError("Failed to update percent fee");
    }
  };

  const handleUpdateBaseFee = async () => {
    if (!allo) {
      setError("Allo interaction not initialized");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const baseFeeInWei = ethers.utils.parseEther(newBaseFee);
      const tx = await allo.updateBaseFee(signer, baseFeeInWei);
      await tx.wait();

      // Refresh the base fee
      const updatedBaseFee = await allo.getBaseFee();
      setBaseFee(ethers.utils.formatEther(updatedBaseFee));
      setNewBaseFee("");
    } catch (err) {
      console.error("Failed to update base fee:", err);
      setError("Failed to update base fee");
    }
  };

  const handleUpdateTreasury = async () => {
    if (!allo) {
      setError("Allo interaction not initialized");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const tx = await allo.updateTreasury(signer, newTreasury);
      await tx.wait();

      // Refresh the treasury address
      const updatedTreasury = await allo.getTreasury();
      setTreasury(updatedTreasury);
      setNewTreasury("");
    } catch (err) {
      console.error("Failed to update treasury:", err);
      setError("Failed to update treasury");
    }
  };

  return (
    <div>
      <h1>Allo Dashboard</h1>
      <p>Current Percent Fee: {percentFee}%</p>
      <p>Base Fee: {baseFee} ETH</p>
      <p>Fee Denominator: {denominator}</p>
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
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Allo;
