// components/CreateProgramForm.js
import React, { useState } from 'react';
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import styles from "../styles/CreateEventModal.module.css";

const ALLO_CONTRACT_ADDRESS = "0xf5f35867AEccF350B55b90E41044F47428950920";
const REGISTRY_CONTRACT_ADDRESS = "0x3787d9680fc5EB34c5f5F75e793d93C98f07d952";
const VAULT_STRATEGY_ADDRESS = "0xeED429051B60b77F0492435D6E3F6115d272fE93";
const OP_TOKEN_ADDRESS = "0x4200000000000000000000000000000000000042";

const CreateProgramForm = () => {
  const [programName, setProgramName] = useState('');
  const [additionalAdmins, setAdditionalAdmins] = useState([{ walletAddress: '' }]);
  const [poolId, setPoolId] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [error, setError] = useState(null);
  const address = "0xBd55b361700c3349794aF68879B8a9E0921640Ed";

  const { contract: alloContract } = useContract(ALLO_CONTRACT_ADDRESS);
  const { contract: registryContract } = useContract(REGISTRY_CONTRACT_ADDRESS);

  const { mutateAsync: createProfile } = useContractWrite(registryContract, "createProfile");
  const { mutateAsync: createPool } = useContractWrite(alloContract, "createPool");

  const fetchProfileInfo = async (profileId) => {
    try {
      const profileInfo = await registryContract.call("getProfileById", [profileId]);
      console.log("Profile Info:", profileInfo);
      return profileInfo;
    } catch (error) {
      console.error("Error fetching profile info:", error);
    }
  };

  const fetchPoolInfo = async (poolId) => {
    try {
      const poolInfo = await alloContract.call("getPool", [poolId]);
      console.log("Pool Info:", poolInfo);
      return poolInfo;
    } catch (error) {
      console.error("Error fetching pool info:", error);
    }
  };

  const handleAddAdmin = () => {
    setAdditionalAdmins([...additionalAdmins, { walletAddress: "" }]);
  };

  const handleAdminChange = (index, value) => {
    const newAdmins = [...additionalAdmins];
    newAdmins[index].walletAddress = value;
    setAdditionalAdmins(newAdmins);
  };

  const handleRemoveAdmin = (index) => {
    const newAdmins = additionalAdmins.filter((_, i) => i !== index);
    setAdditionalAdmins(newAdmins);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!address) {
      console.error("No wallet connected");
      setError("No wallet connected. Please connect your wallet.");
      return;
    }

    try {
      // First, create a profile
      console.log("Creating profile...");
      const profileData = await createProfile({
        args: [
          Date.now(), // nonce
          programName,
          { protocol: 1, pointer: "" }, // metadata
          address,
          [] // no additional members
        ],
      });
      console.log("Profile creation full response:", profileData);

      if (!profileData || !profileData.receipt) {
        throw new Error("Unexpected response structure from profile creation");
      }

      console.log("Profile creation full receipt:", profileData.receipt);

      let newProfileId;
      if (profileData.receipt.events) {
        console.log("Profile creation events:", profileData.receipt.events);
        const profileCreatedEvent = profileData.receipt.events.find(e => e.event === "ProfileCreated");
        if (profileCreatedEvent) {
          newProfileId = profileCreatedEvent.args.profileId;
        }
      }

      if (!newProfileId) {
        console.warn("ProfileCreated event not found. Attempting to deduce profile ID...");
        // Here you might implement alternative ways to get the profile ID
        // For now, we'll throw an error
        throw new Error("Could not determine new profile ID");
      }

      setProfileId(newProfileId);
      console.log("Profile created with ID:", newProfileId);

      // Fetch and log profile info
      const profileInfo = await fetchProfileInfo(newProfileId);
      console.log("Fetched profile info:", profileInfo);

      // Then, create the pool
      console.log("Creating pool...");
      const allAdmins = [address, ...additionalAdmins.map(admin => admin.walletAddress).filter(a => a)];
      const poolData = await createPool({
        args: [
          newProfileId,
          VAULT_STRATEGY_ADDRESS,
          "0x", // Replace with actual initialization data if needed
          OP_TOKEN_ADDRESS,
          0, // Initial amount
          { protocol: 1, pointer: programName },
          allAdmins
        ],
      });
      console.log("Pool creation full response:", poolData);

      if (!poolData || !poolData.receipt) {
        throw new Error("Unexpected response structure from pool creation");
      }

      console.log("Pool creation full receipt:", poolData.receipt);

      let newPoolId;
      if (poolData.receipt.events) {
        console.log("Pool creation events:", poolData.receipt.events);
        const poolCreatedEvent = poolData.receipt.events.find(e => e.event === "PoolCreated");
        if (poolCreatedEvent) {
          newPoolId = poolCreatedEvent.args.poolId.toString();
        }
      }

      if (!newPoolId) {
        console.warn("PoolCreated event not found. Attempting to deduce pool ID...");
        // Here you might implement alternative ways to get the pool ID
        // For example, you could query the contract for the latest pool ID
        // For now, we'll log a warning but continue
        console.error("Could not determine new pool ID");
      } else {
        setPoolId(newPoolId);
        console.log("Pool created with ID:", newPoolId);

        // Fetch and log pool info
        const poolInfo = await fetchPoolInfo(newPoolId);
        console.log("Fetched pool info:", poolInfo);
      }

      // Log the transaction hash for reference
      console.log("Pool creation transaction hash:", poolData.receipt.transactionHash);

    } catch (err) {
      console.error("Failed to create profile or pool", err);
      console.error("Error details:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
      if (err.receipt) {
        console.error("Transaction receipt:", err.receipt);
      }
      if (err.data) {
        console.error("Error data:", err.data);
      }
      setError(`Error: ${err.message}`);
    }
  };

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
        <div className={styles.formGroup}>
          <h3>Additional Admins</h3>
          {additionalAdmins.map((admin, index) => (
            <div key={index} style={{ display: "flex", marginBottom: "10px" }}>
              <input
                type="text"
                value={admin.walletAddress}
                onChange={(e) => handleAdminChange(index, e.target.value)}
                placeholder="Wallet Address"
              />
              <button
                type="button"
                onClick={() => handleRemoveAdmin(index)}
                className={styles.closeButton}
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddAdmin}
            className={styles.submitButton}
            style={{ marginTop: "10px", width: "auto" }}
          >
            + Add Admin
          </button>
        </div>
        <button type="submit" className={styles.submitButton}>
          Create Program
        </button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
      {poolId && (
        <div>
          <h3>Program Created!</h3>
          <p>Pool ID: {poolId}</p>
          <p>Profile ID: {profileId}</p>
        </div>
      )}
    </div>
  );
};

export default CreateProgramForm;
