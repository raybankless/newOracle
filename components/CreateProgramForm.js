/*import React, { useState, useEffect } from "react";
import { createWalletClient, custom, formatUnits } from "viem";
import { optimism } from "viem/chains";
import { Allo, Registry } from "@allo-team/allo-v2-sdk";
import styles from "../styles/CreateEventModal.module.css";

const VAULT_STRATEGY_ADDRESS = "0xeED429051B60b77F0492435D6E3F6115d272fE93";
const OP_TOKEN_ADDRESS = "0x4200000000000000000000000000000000000042";

const CreateProgramForm = ({ onClose, onSuccess, address }) => {
  const [programName, setProgramName] = useState("");
  const [error, setError] = useState(null);

  // Initialize viem wallet client
  const walletClient = createWalletClient({
    chain: optimism,
    transport: custom(window.ethereum),
  });

  // Initialize SDK instances
  const allo = new Allo({ optimism, walletClient });
  const registry = new Registry({ chainId: 10, walletClient });

  useEffect(() => {
    const handlePoolCreated = (poolId, profileId, strategy, token, amount, metadata) => {
      console.log("Pool Created Event:", poolId, profileId, strategy, token, amount, metadata);
    };

    const handleStrategyApproved = (strategy) => {
      console.log("Strategy Approved Event:", strategy);
    };

    const handleBaseFeePaid = (poolId, fee) => {
      console.log("Base Fee Paid Event:", poolId.toString(), formatUnits(fee, 18)); // Assuming the fee is in wei
    };

    // Listen to events
    allo.on("PoolCreated", handlePoolCreated);
    allo.on("StrategyApproved", handleStrategyApproved);
    allo.on("BaseFeePaid", handleBaseFeePaid);

    return () => {
      // Clean up event listeners
      allo.off("PoolCreated", handlePoolCreated);
      allo.off("StrategyApproved", handleStrategyApproved);
      allo.off("BaseFeePaid", handleBaseFeePaid);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!address) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      console.log("Checking if the wallet has a profile...");
      let profile = await registry.getProfileByAnchor(address);
      if (profile) {
        console.log("Wallet already has a profile with ID:", profile.id);
      } else {
        console.log("Creating profile...");
        profile = await registry.createProfile({
          metadata: [1, ""],
          owner: address,
          name: programName,
        });
        console.log("Profile ID:", profile.id);
      }

      console.log("Checking if strategy is clonable...");
      const isClonable = await allo.isCloneableStrategy(VAULT_STRATEGY_ADDRESS);
      if (!isClonable) {
        console.log("Adding strategy to clonable strategies...");
        await allo.addCloneableStrategy(VAULT_STRATEGY_ADDRESS);
      }

      console.log("Creating pool...");
      const initStrategyData = allo.encodeStrategyData({
        merkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
        startTime: 0,
        endTime: 0,
        allocationAmount: 0,
      });

      const pool = await allo.createPool({
        profileId: profile.id,
        strategy: VAULT_STRATEGY_ADDRESS,
        initStrategyData,
        token: OP_TOKEN_ADDRESS,
        amount: 0,
        metadata: [1, programName],
        managers: [address],
      });

      console.log("Pool created successfully:", pool);

      onSuccess && onSuccess({ id: pool.id, name: programName });
      onClose();
    } catch (err) {
      console.error("Failed to create program:", err);
      setError("Failed to create program. Please check the console for details.");
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
        <button type="submit" className={styles.submitButton}>
          Create Program
        </button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default CreateProgramForm;
*/