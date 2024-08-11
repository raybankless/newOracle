import React, { useState, useEffect } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import styles from "../styles/CreateEventModal.module.css";
import { alloInteraction } from "../components/AlloContractInteraction";
import { registryInteraction } from "../components/registryInteraction";

const VAULT_STRATEGY_ADDRESS = "0xeED429051B60b77F0492435D6E3F6115d272fE93";
const OP_TOKEN_ADDRESS = "0x4200000000000000000000000000000000000042";

const CreateProgramForm = ({ onClose, onSuccess }) => {
  const [programName, setProgramName] = useState("");
  const [error, setError] = useState(null);
  const address = useAddress();

  const allo = alloInteraction();
  const registry = registryInteraction();

  useEffect(() => {
    const handlePoolCreated = (
      poolId,
      profileId,
      strategy,
      token,
      amount,
      metadata,
    ) => {
      console.log(
        "Pool Created Event:",
        poolId,
        profileId,
        strategy,
        token,
        amount,
        metadata,
      );
    };

    const handleStrategyApproved = (strategy) => {
      console.log("Strategy Approved Event:", strategy);
    };

    allo.listenToPoolCreated(handlePoolCreated);
    allo.listenToStrategyApproved(handleStrategyApproved);

    return () => {
      allo.contract.off("PoolCreated", handlePoolCreated);
      allo.contract.off("StrategyApproved", handleStrategyApproved);
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
      console.log("Creating profile...");
      const createProfileResult = await registry.createProfile(
        Date.now(),
        programName,
        [1, ""],
        address,
        [],
      );

      const profileCreatedEvent = createProfileResult.events.find(
        (event) => event.event === "ProfileCreated",
      );
      const profileId = profileCreatedEvent.args[0];
      const anchorId = profileCreatedEvent.args.anchor;
      console.log("Profile ID:", profileId);
      console.log("Anchor ID:", anchorId);

      

      console.log("Creating pool...");
      const initStrategyData = ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "uint256", "uint256"],
        [0, 0, 0, 0],
      );

      const createPoolResult = await allo.createPool(
        profileId,
        VAULT_STRATEGY_ADDRESS,
        initStrategyData,
        OP_TOKEN_ADDRESS,
        0,
        [1, programName],
        [address],
      );

      const poolCreatedEvent = createPoolResult.events.find(
        (event) => event.event === "PoolCreated",
      );

      if (!poolCreatedEvent) {
        console.error("All events:", createPoolResult.events);
        throw new Error("PoolCreated event not found in transaction receipt.");
      }

      const poolId = poolCreatedEvent.args.poolId;
      console.log("Pool created with ID:", poolId);

      onSuccess && onSuccess({ id: poolId, name: programName });
      onClose();
    } catch (err) {
      console.error("Failed to create program:", err);
      setError(
        "Failed to create program. Please check the console for details.",
      );
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
