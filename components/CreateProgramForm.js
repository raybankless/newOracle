import React, { useState } from 'react';
import { useContract, useContractWrite, useAddress, useNetwork, useNetworkMismatch } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import styles from "../styles/CreateEventModal.module.css";

const ALLO_CONTRACT_ADDRESS = "0xf5f35867AEccF350B55b90E41044F47428950920";
const REGISTRY_CONTRACT_ADDRESS = "0x3787d9680fc5EB34c5f5F75e793d93C98f07d952";
const VAULT_STRATEGY_ADDRESS = "0xeED429051B60b77F0492435D6E3F6115d272fE93";
const OP_TOKEN_ADDRESS = "0x4200000000000000000000000000000000000042";

const CreateProgramForm = ({ onClose, onSuccess }) => {
  const [programName, setProgramName] = useState("");
  const [initialFunding, setInitialFunding] = useState("0");
  const [error, setError] = useState(null);
  const address = useAddress();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const { contract: registryContract } = useContract(REGISTRY_CONTRACT_ADDRESS);
  const { contract: alloContract } = useContract(ALLO_CONTRACT_ADDRESS);

  const { mutateAsync: createProfile, isLoading: isCreatingProfile } = useContractWrite(registryContract, "createProfile");
  const { mutateAsync: createPool, isLoading: isCreatingPool } = useContractWrite(alloContract, "createPool");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (networkMismatch) {
      await switchNetwork(10); // 10 is the chain ID for Optimism
      return;
    }

    if (!registryContract || !alloContract) {
      setError("Contracts not initialized. Please try again.");
      return;
    }

    console.log("Starting form submission...");
    try {
      // Create profile
      console.log("Creating profile...");
      const createProfileResult = await createProfile({
        args: [Date.now(), programName, [1, ""], address, []]
      });
      console.log("Profile created:", createProfileResult.receipt);

      // Find the ProfileCreated event and extract the profileId
      const profileCreatedEvent = createProfileResult.receipt.events.find(
        (event) => event.event === "ProfileCreated"
      );

      if (!profileCreatedEvent) {
        throw new Error("ProfileCreated event not found in transaction receipt.");
      }

      const profileId = profileCreatedEvent.args[0];
      console.log("Profile ID:", profileId);

      // Convert initialFunding to wei
      const fundingAmount = ethers.utils.parseEther(initialFunding);

      // Create pool
      console.log("Creating pool...");
      const createPoolResult = await createPool({
        args: [
          profileId,
          VAULT_STRATEGY_ADDRESS,
          "0x", // initStrategyData
          OP_TOKEN_ADDRESS,
          fundingAmount,
          [1, programName], // metadata
          [address] // managers (only connected address)
        ],
        overrides: {
          value: fundingAmount // Send ETH for funding
        }
      });
      console.log("Pool created:", createPoolResult);
      onSuccess && onSuccess(createPoolResult);
      onClose();
    } catch (err) {
      console.error("Failed to create program:", err);
      setError(`Error: ${err.message}`);
    }
  };

  if (isCreatingProfile || isCreatingPool) {
    return <div>Creating program...</div>;
  }

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.textBlack}>Create a Grant Program</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="programName">Program Name</label>
          <input
            id="programName"
            type="text"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Create Program
        </button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default CreateProgramForm;
