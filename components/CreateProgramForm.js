// components/CreateProgramForm.js
import React, { useState, useEffect } from 'react';
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
  const address = useAddress();

  const { contract: alloContract } = useContract(ALLO_CONTRACT_ADDRESS);
  const { contract: registryContract } = useContract(REGISTRY_CONTRACT_ADDRESS);

  const { mutateAsync: createProfile } = useContractWrite(registryContract, "createProfile");
  const { mutateAsync: createPool } = useContractWrite(alloContract, "createPool");

  const handleAddAdmin = () => {
    setAdditionalAdmins([...additionalAdmins, { walletAddress: '' }]);
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
    if (!address) {
      console.error("No wallet connected");
      return;
    }

    try {
      // First, create a profile
      const profileData = await createProfile({
        args: [
          Date.now(), // nonce
          programName,
          { protocol: 1, pointer: "" }, // metadata
          address,
          [] // no additional members
        ],
      });
      const newProfileId = profileData.receipt.events[0].args.profileId;
      setProfileId(newProfileId);
      console.log("Profile created with ID:", newProfileId);

      // Then, create the pool
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
      const newPoolId = poolData.receipt.events[0].args.poolId.toString();
      setPoolId(newPoolId);
      console.log("Pool created with ID:", newPoolId);
    } catch (err) {
      console.error("Failed to create profile or pool", err);
    }
  };

  useEffect(() => {
    if (poolId) {
      // Fetch and display pool information
      console.log("Pool created with ID:", poolId);
      // Here you would typically fetch more details about the pool
    }
  }, [poolId]);

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
            <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
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
            style={{ marginTop: '10px', width: 'auto' }}
          >
            + Add Admin
          </button>
        </div>
        <button type="submit" className={styles.submitButton}>
          Create Program
        </button>
      </form>
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