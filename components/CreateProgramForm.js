// components/CreateProgramForm.js
import React, { useState } from 'react';
import { useContract, useContractWrite, useAddress } from "@thirdweb-dev/react";
import styles from "../styles/CreateEventModal.module.css";

const ALLO_CONTRACT_ADDRESS = "0xf5f35867AEccF350B55b90E41044F47428950920";
const REGISTRY_CONTRACT_ADDRESS = "0x3787d9680fc5EB34c5f5F75e793d93C98f07d952";
const VAULT_STRATEGY_ADDRESS = "0xeED429051B60b77F0492435D6E3F6115d272fE93";
const OP_TOKEN_ADDRESS = "0x4200000000000000000000000000000000000042";

const CreateProgramForm = ({ onClose }) => {
  const [programName, setProgramName] = useState("");
  const [error, setError] = useState(null);
  const address = useAddress();

  const { contract: alloContract } = useContract(ALLO_CONTRACT_ADDRESS);
  const { contract: registryContract } = useContract(REGISTRY_CONTRACT_ADDRESS);

  const { mutateAsync: createProfile } = useContractWrite(registryContract, "createProfile");
  const { mutateAsync: createPool, isLoading, error: contractError } = useContractWrite(alloContract, "createPool");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    console.log("Starting form submission...");

    try {
      // Create profile
      console.log("Creating profile...");
      const createProfileResult = await createProfile({ 
        args: [Date.now(), programName, [1, ""], address, []]
      });
      console.log("Profile created:", createProfileResult);
      const profileId = createProfileResult.data.profileId;

      // Create pool
      console.log("Creating pool...");
      const createPoolResult = await createPool({ 
        args: [
          profileId,
          VAULT_STRATEGY_ADDRESS,
          "0x", // initStrategyData
          OP_TOKEN_ADDRESS,
          0, // amount
          [1, programName], // metadata
          [address] // managers (only connected address)
        ] 
      });
      console.log("Pool created:", createPoolResult);
      onClose();
    } catch (err) {
      console.error("Failed to create program:", err);
      setError(`Error: ${err.message}`);
    }
  };

  if (isLoading) {
    return <div>Creating program...</div>;
  }

  if (contractError) {
    console.error("Contract error:", contractError);
    return <div>Error creating program. Please check the console for details.</div>;
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