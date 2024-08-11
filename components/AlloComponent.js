import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CreateProgramForm from "./CreateProgramForm";
import ProgramsGrid from "./ProgramsGrid";
import styles from "../styles/Allo.module.css";
import { alloInteraction } from "./AlloContractInteraction";

const AlloComponent = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");
  const [isCreateProgramModalOpen, setIsCreateProgramModalOpen] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [percentFee, setPercentFee] = useState("");
  const [baseFee, setBaseFee] = useState("");
  const [treasury, setTreasury] = useState("");
  const [newPercentFee, setNewPercentFee] = useState("");
  const [newBaseFee, setNewBaseFee] = useState("");
  const [newTreasury, setNewTreasury] = useState("");

  const [address, setAddress] = useState("");
  const interaction = alloInteraction(); 

  const handleConnect = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed!");
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      console.log("Connected to MetaMask:", userAddress);

      setAddress(userAddress);
    } catch (err) {
      console.error("MetaMask connection failed:", err);
      setError(err.message || "An unknown error occurred");
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchContractInfo = async () => {
    try {
      const percentFeeValue = await interaction.getPercentFee();
      const baseFeeValue = await interaction.getBaseFee();
      const treasuryAddress = await interaction.getTreasury();

      setPercentFee(percentFeeValue?.toString() || "");
      setBaseFee(baseFeeValue?.toString() || "");
      setTreasury(treasuryAddress || "");
    } catch (err) {
      console.error("Failed to fetch contract info:", err);
      setError("Failed to fetch contract info");
    }
  };

  useEffect(() => {
    if (address) {
      fetchContractInfo();
    }
  }, [address]);

  const handleUpdatePercentFee = async () => {
    try {
      await interaction.updatePercentFee(ethers.utils.parseUnits(newPercentFee, 18));
      setNewPercentFee("");
      fetchContractInfo();
      console.log("Percent fee updated successfully");
    } catch (err) {
      console.error("Failed to update percent fee:", err);
      setError(`Failed to update percent fee: ${err.message}`);
    }
  };

  const handleUpdateBaseFee = async () => {
    try {
      await interaction.updateBaseFee(ethers.utils.parseEther(newBaseFee));
      setNewBaseFee("");
      fetchContractInfo();
      console.log("Base fee updated successfully");
    } catch (err) {
      console.error("Failed to update base fee:", err);
      setError(`Failed to update base fee: ${err.message}`);
    }
  };

  const handleUpdateTreasury = async () => {
    try {
      await interaction.updateTreasury(newTreasury);
      setNewTreasury("");
      fetchContractInfo();
      console.log("Treasury updated successfully");
    } catch (err) {
      console.error("Failed to update treasury:", err);
      setError(`Failed to update treasury: ${err.message}`);
    }
  };

  const openCreateProgramModal = () => {
    setIsCreateProgramModalOpen(true);
  };

  const closeCreateProgramModal = () => {
    setIsCreateProgramModalOpen(false);
  };

  const handleCreateProgramSuccess = (program) => {
    if (program && program.id) {
      setPrograms((prevPrograms) => [...prevPrograms, program]);
      console.log("New program added:", program);
    } else {
      console.error("Invalid program data:", program);
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
      {address && (
        <>
          <div className={styles.infoSection}>
            <p>Connected Wallet Address: {address}</p>
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
              <button
                onClick={handleUpdatePercentFee}
                className={styles.button}
              >
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
              <button
                onClick={openCreateProgramModal}
                className={styles.button}
              >
                Create Program
              </button>
            </div>
          </div>
          <div className={styles.programsSection}>
            <h2>Programs</h2>
            <ProgramsGrid programs={programs} />
          </div>
        </>
      )}
      {isCreateProgramModalOpen && (
        <CreateProgramForm
          onClose={closeCreateProgramModal}
          onSubmit={handleCreateProgramSuccess}
        />
      )}
    </div>
  );
};

export default AlloComponent;