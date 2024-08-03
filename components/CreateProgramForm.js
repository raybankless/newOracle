  // components/CreateProgramForm.js
  import React, { useState } from "react";
  import { ethers } from "ethers";
  import styles from "../styles/CreateEventModal.module.css";

  const ALLO_CONTRACT_ADDRESS = "0xf5f35867AEccF350B55b90E41044F47428950920";
  const REGISTRY_CONTRACT_ADDRESS = "0x3787d9680fc5EB34c5f5F75e793d93C98f07d952";
  const VAULT_STRATEGY_ADDRESS = "0xeED429051B60b77F0492435D6E3F6115d272fE93";
  const OP_TOKEN_ADDRESS = "0x4200000000000000000000000000000000000042";

  const ALLO_ABI = ["function createPool(bytes32,address,bytes,address,uint256,(uint256,string),address[]) external returns (uint256)"];
  const REGISTRY_ABI = ["function createProfile(uint256,string,(uint256,string),address,address[]) external returns (bytes32)"];

  const CreateProgramForm = () => {
    const [programName, setProgramName] = useState("");
    const [additionalAdmins, setAdditionalAdmins] = useState([{ walletAddress: "" }]);
    const [poolId, setPoolId] = useState(null);
    const [profileId, setProfileId] = useState(null);
    const [error, setError] = useState(null);

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
      console.log("Starting form submission...");

      try {
        console.log("Connecting to Web3Provider...");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();
        console.log("Connected. Signer address:", signerAddress);

        console.log("Creating contract instances...");
        const registryContract = new ethers.Contract(REGISTRY_CONTRACT_ADDRESS, REGISTRY_ABI, signer);
        const alloContract = new ethers.Contract(ALLO_CONTRACT_ADDRESS, ALLO_ABI, signer);
        console.log("Contract instances created.");

        // Create profile
        console.log("Creating profile...");
        const createProfileTx = await registryContract.createProfile(
          Date.now(), // nonce
          programName,
          [1, ""], // metadata
          signerAddress,
          [] // no additional members
        );
        console.log("Create profile transaction sent:", createProfileTx.hash);

        const createProfileReceipt = await createProfileTx.wait();
        console.log("Create profile transaction receipt:", createProfileReceipt);

        // Assuming the profile ID is returned in the transaction receipt
        const newProfileId = createProfileReceipt.events[0].args[0];
        setProfileId(newProfileId);
        console.log("Profile created with ID:", newProfileId);

        // Create pool
        console.log("Creating pool...");
        const validAdmins = additionalAdmins
          .map(admin => admin.walletAddress)
          .filter(address => ethers.utils.isAddress(address));
        console.log("Valid additional admins:", validAdmins);

        const allAdmins = [signerAddress, ...validAdmins];
        console.log("All admins (including creator):", allAdmins);

        const createPoolTx = await alloContract.createPool(
          newProfileId,
          VAULT_STRATEGY_ADDRESS,
          "0x", // Replace with actual initialization data if needed
          OP_TOKEN_ADDRESS,
          0, // Initial amount
          [1, programName], // metadata
          allAdmins
        );
        console.log("Create pool transaction sent:", createPoolTx.hash);

        const createPoolReceipt = await createPoolTx.wait();
        console.log("Create pool transaction receipt:", createPoolReceipt);

        // Assuming the pool ID is returned in the transaction receipt
        const newPoolId = createPoolReceipt.events[0].args[0].toString();
        setPoolId(newPoolId);
        console.log("Pool created with ID:", newPoolId);

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

    // ... (rest of the component, including the form JSX, remains the same)

  };

  export default CreateProgramForm;
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
