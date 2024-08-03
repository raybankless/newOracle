// components/CreateProgramForm.js
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import styles from "../styles/CreateEventModal.module.css";

const ALLO_CONTRACT_ADDRESS = "0xf5f35867AEccF350B55b90E41044F47428950920";
const REGISTRY_CONTRACT_ADDRESS = "0x3787d9680fc5EB34c5f5F75e793d93C98f07d952";
const VAULT_STRATEGY_ADDRESS = "0xeED429051B60b77F0492435D6E3F6115d272fE93";
const OP_TOKEN_ADDRESS = "0x4200000000000000000000000000000000000042";

const CreateProgramForm = () => {
  const [programName, setProgramName] = useState("");
  const [additionalAdmins, setAdditionalAdmins] = useState([{ walletAddress: "" }]);
  const [poolId, setPoolId] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [error, setError] = useState(null);
  const [signer, setSigner] = useState(null);
  const [alloContract, setAlloContract] = useState(null);
  const [registryContract, setRegistryContract] = useState(null);

  useEffect(() => {
    const initializeEthers = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          setSigner(signer);

          const alloABI = ["function createPool(bytes32,address,bytes,address,uint256,(uint256,string),address[]) external returns (uint256)"];
          const registryABI = ["function createProfile(uint256,string,(uint256,string),address,address[]) external returns (bytes32)"];

          setAlloContract(new ethers.Contract(ALLO_CONTRACT_ADDRESS, alloABI, signer));
          setRegistryContract(new ethers.Contract(REGISTRY_CONTRACT_ADDRESS, registryABI, signer));
        } catch (error) {
          console.error("Failed to connect to MetaMask", error);
          setError("Failed to connect to MetaMask. Please make sure it's installed and unlocked.");
        }
      } else {
        setError("MetaMask is not installed. Please install it to use this feature.");
      }
    };

    initializeEthers();
  }, []);

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

  const createProfile = async () => {
    if (!registryContract) {
      throw new Error("Registry contract is not initialized");
    }

    const tx = await registryContract.createProfile(
      Date.now(), // nonce
      programName,
      [1, ""], // metadata
      await signer.getAddress(),
      [] // no additional members
    );

    const receipt = await tx.wait();
    const event = receipt.events.find(e => e.event === "ProfileCreated");
    return event.args.profileId;
  };

  const createPoolWithAllo = async (profileId) => {
    if (!alloContract) {
      throw new Error("Allo contract is not initialized");
    }

    const validAdmins = additionalAdmins
      .map(admin => admin.walletAddress)
      .filter(address => ethers.utils.isAddress(address));

    const allAdmins = [await signer.getAddress(), ...validAdmins];

    const tx = await alloContract.createPool(
      profileId,
      VAULT_STRATEGY_ADDRESS,
      "0x", // Replace with actual initialization data if needed
      OP_TOKEN_ADDRESS,
      0, // Initial amount
      [1, programName], // metadata
      allAdmins
    );

    const receipt = await tx.wait();
    const event = receipt.events.find(e => e.event === "PoolCreated");
    return event.args.poolId.toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!signer) {
      setError("No wallet connected. Please connect your wallet.");
      return;
    }

    try {
      const newProfileId = await createProfile();
      setProfileId(newProfileId);
      console.log("Profile created with ID:", newProfileId);

      const newPoolId = await createPoolWithAllo(newProfileId);
      setPoolId(newPoolId);
      console.log("Pool created with ID:", newPoolId);
    } catch (err) {
      console.error("Failed to create profile or pool", err);
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
