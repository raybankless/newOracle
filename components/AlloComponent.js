import React, { useState, useEffect } from "react";
import { createWalletClient, custom, decodeErrorResult, createPublicClient, http } from "viem";
import { optimism } from "viem/chains";
import { Allo, Registry } from "@allo-team/allo-v2-sdk";
import ProgramsGrid from "./ProgramsGrid";
import styles from "../styles/Allo.module.css";
import { abi, abi as alloAbi } from "@allo-team/allo-v2-sdk/dist/Allo/allo.config";

const VAULT_STRATEGY_ADDRESS = "0xeED429051B60b77F0492435D6E3F6115d272fE93";
const OP_TOKEN_ADDRESS = "0x4200000000000000000000000000000000000042";

const AlloComponent = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");
  const [programs, setPrograms] = useState([]);
  const [percentFee, setPercentFee] = useState("");
  const [baseFee, setBaseFee] = useState("");
  const [treasury, setTreasury] = useState("");
  const [newPercentFee, setNewPercentFee] = useState("");
  const [newBaseFee, setNewBaseFee] = useState("");
  const [newTreasury, setNewTreasury] = useState("");
  const [address, setAddress] = useState("");
  const [programName, setProgramName] = useState("");
  const [walletClient, setWalletClient] = useState(null);

  useEffect(() => {
    const checkProvider = async () => {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const userAddress = accounts[0];

        const client = createWalletClient({
          account: userAddress,
          chain: optimism,
          transport: custom(window.ethereum),
        });

        setWalletClient(client);
        setAddress(userAddress);
        setIsConnected(true);
      } else {
        setError("Ethereum provider (MetaMask) is not installed.");
      }
    };
    checkProvider();
  }, []);

  // Initialize SDK instances using the chain ID directly
  const allo = walletClient ? new Allo({ chain: 10 }) : null;
  const registry = walletClient ? new Registry({ chain: 10 }) : null;

  const handleConnect = async () => {
    if (!walletClient) {
      setError("MetaMask is not installed!");
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const userAddress = accounts[0];

      if (userAddress) {
        console.log("Connected to MetaMask:", userAddress);
        setAddress(userAddress);
        setIsConnected(true);
      } else {
        setError("Failed to retrieve account address.");
      }
    } catch (err) {
      console.error("MetaMask connection failed:", err);
      setError(err.message || "An unknown error occurred");
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchContractInfo = async () => {
    if (!allo) return;
    try {
      const percentFeeValue = await allo.getPercentFee();
      const baseFeeValue = await allo.getBaseFee();
      const treasuryAddress = await allo.getTreasury();

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
    if (!allo) return;
    try {
      await allo.updatePercentFee(BigInt(newPercentFee) * BigInt(10 ** 18)); // Convert percentage to wei
      setNewPercentFee("");
      fetchContractInfo();
      console.log("Percent fee updated successfully");
    } catch (err) {
      console.error("Failed to update percent fee:", err);
      setError(`Failed to update percent fee: ${err.message}`);
    }
  };

  const handleUpdateBaseFee = async () => {
    if (!allo) return;
    try {
      await allo.updateBaseFee(BigInt(newBaseFee) * BigInt(10 ** 18)); // Convert ETH to wei
      setNewBaseFee("");
      fetchContractInfo();
      console.log("Base fee updated successfully");
    } catch (err) {
      console.error("Failed to update base fee:", err);
      setError(`Failed to update base fee: ${err.message}`);
    }
  };

  const handleUpdateTreasury = async () => {
    if (!allo) return;
    try {
      await allo.updateTreasury(newTreasury);
      setNewTreasury("");
      fetchContractInfo();
      console.log("Treasury updated successfully");
    } catch (err) {
      console.error("Failed to update treasury:", err);
      setError(`Failed to update treasury: ${err.message}`);
    }
  };

  const handleCreateProgramSuccess = async () => {
    if (!registry || !allo || !address || !programName) return;

    try {
      console.log("Checking if the wallet has a profile...");
      let profile = await registry.getProfileByAnchor("0x27ceDB4755a7F3bF3798337B7D47b1a8Fa97f681");
      if (profile) {
        console.log("Wallet already has a profile with ID:", profile.id);
      } else {
        console.log("Creating profile...");
        profile = await registry.createProfile({
          metadata: [1, ""],
          owner: address,
          name: address,
        });
        console.log("Profile ID:", profile.id);
      }

      // Add strategy to cloneable strategies
      const addedStrategy = await allo.addToCloneableStrategies(VAULT_STRATEGY_ADDRESS);
      console.log("Adding strategy to cloneable strategies...", addedStrategy);

      console.log("Creating pool...");
      const txData = allo.createPool({
        profileId: profile.id,
        strategy: VAULT_STRATEGY_ADDRESS,
        initStrategyData: "0x",
        token: OP_TOKEN_ADDRESS,
        amount: 0,
        metadata: [1, programName],
        managers: [address],
      });

      console.log("Transaction data:", txData);

      const txHash = await walletClient.sendTransaction({
        data: txData.data,
        to: txData.to,
        value: BigInt(txData.value || 0),  // Handle the value field as BigInt
      });

      console.log(`Transaction hash: ${txHash}`);

      // Create a public client for waiting for the transaction receipt
      const publicClient = createPublicClient({
        chain: optimism,
        transport: http(),
      });

      // Wait for the transaction receipt using publicClient
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      console.log("Transaction receipt:", receipt);

      if (receipt.status === 'reverted') {
        // Decode error from receipt
        const error = decodeErrorResult({
          data: receipt.logs, // or wherever your logs or revert reason data is
          abi: abi, // Reference the imported ABI here
        });

        console.error("Transaction failed with error:", error);
        setError(`Transaction failed with error: ${error}`);
      } else {
        // Get the pool ID from the event if successful
        const poolId = await allo.getPoolCreatedEvent(txHash);

        if (poolId) {
          setPrograms((prevPrograms) => [...prevPrograms, { id: poolId, name: programName }]);
          setProgramName(""); // Reset program name field after creation
        }
      }
    } catch (err) {
      console.error("Failed to create program:", err);
      setError("Failed to create program. Please check the console for details.");
    }
  };



  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Allo Dashboard</h1>
      <div className={styles.connectWalletContainer}>
        <button
          onClick={handleConnect}
          disabled={isConnecting || isConnected}
          className={styles.button}
        >
          {isConnecting
            ? "Connecting..."
            : isConnected
              ? "Connected"
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
              <input
                type="text"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                placeholder="Program Name"
              />
              <button
                onClick={handleCreateProgramSuccess}
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
    </div>
  );
};

export default AlloComponent;


