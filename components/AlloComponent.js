// components/AlloComponent.js
import React, { useState, useEffect } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { createWallet } from "thirdweb/wallets";
import { useConnect, useSetActiveWallet } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { ethers } from "ethers";
import CreateProgramForm from "./CreateProgramForm";
import ProgramsGrid from "./ProgramsGrid";
import styles from "../styles/Allo.module.css";
import { useAlloInteraction } from "./AlloContractInteraction";

const client = createThirdwebClient({
  clientId: "22f2a1f2653b1f091455a59951c2ecca", // Replace with your actual client ID
});

const AlloComponent = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");
  const [isCreateProgramModalOpen, setIsCreateProgramModalOpen] =
    useState(false);
  const [programs, setPrograms] = useState([]);
  const [percentFee, setPercentFee] = useState("");
  const [baseFee, setBaseFee] = useState("");
  const [treasury, setTreasury] = useState("");
  const [newPercentFee, setNewPercentFee] = useState("");
  const [newBaseFee, setNewBaseFee] = useState("");
  const [newTreasury, setNewTreasury] = useState("");
  const setActiveAccount = useSetActiveWallet();

  const {
    connect,
    isConnecting: isThirdwebConnecting,
    error: thirdwebError,
  } = useConnect();
  const address = useAddress();

  const {
    getPercentFee,
    getBaseFee,
    getTreasury,
    updatePercentFee,
    updateBaseFee,
    updateTreasury,
  } = useAlloInteraction();

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connect(async () => {
        const wallet = createWallet("io.metamask");
        const account = await wallet.connect({
          client, // Pass the thirdweb client here
        });
        await setActiveAccount(wallet);
        console.log("Connected to MetaMask:", account.address);
        return wallet;
      });
    } catch (err) {
      console.error("MetaMask connection failed:", err);
      setError(err.message || "An unknown error occurred");
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchContractInfo = async () => {
    try {
      const percentFeeValue = await getPercentFee.data;
      const baseFeeValue = await getBaseFee.data;
      const treasuryAddress = await getTreasury.data;

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
  }, [address, getPercentFee, getBaseFee, getTreasury]);

  const handleUpdatePercentFee = async () => {
    try {
      await updatePercentFee.mutateAsync({
        args: [ethers.utils.parseUnits(newPercentFee, 16)],
      });
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
      await updateBaseFee.mutateAsync({
        args: [ethers.utils.parseEther(newBaseFee)],
      });
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
      await updateTreasury.mutateAsync({ args: [newTreasury] });
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
          disabled={isConnecting || isThirdwebConnecting}
          className={styles.button}
        >
          {isConnecting || isThirdwebConnecting
            ? "Connecting..."
            : "Connect to MetaMask"}
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
          onSuccess={handleCreateProgramSuccess}
        />
      )}
    </div>
  );
};

export default AlloComponent;
