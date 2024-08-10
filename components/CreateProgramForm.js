import React, { useState, useEffect } from "react";
import { useAddress, useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import styles from "../styles/CreateEventModal.module.css";
import { useAlloInteraction } from "../components/AlloContractInteraction";
import { useRegistryInteraction } from "../utils/registryInteraction";

const ALLO_CONTRACT_ADDRESS = "0xf5f35867AEccF350B55b90E41044F47428950920";
const REGISTRY_CONTRACT_ADDRESS = "0x3787d9680fc5EB34c5f5F75e793d93C98f07d952";
const VAULT_STRATEGY_ADDRESS = "0xeED429051B60b77F0492435D6E3F6115d272fE93";
const OP_TOKEN_ADDRESS = "0x4200000000000000000000000000000000000042";

const CreateProgramForm = ({ onClose, onSuccess }) => {
  const [programName, setProgramName] = useState("");
  const [error, setError] = useState(null);
  const [detailedError, setDetailedError] = useState(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [isApprovingStrategy, setIsApprovingStrategy] = useState(false);
  const address = useAddress();

  const { createPool, getPercentFee, getBaseFee, getTreasury } = useAlloInteraction();
  const { createProfile } = useRegistryInteraction();

  const { contract: alloContract } = useContract(ALLO_CONTRACT_ADDRESS);

  const { data: isCloneableStrategy, isLoading: isCheckingStrategy } = useContractRead(
    alloContract,
    "isCloneableStrategy",
    [VAULT_STRATEGY_ADDRESS]
  );

  const { mutateAsync: addToCloneableStrategies } = useContractWrite(
    alloContract,
    "addToCloneableStrategies"
  );

  useEffect(() => {
    const fetchContractInfo = async () => {
      try {
        const [percentFee, baseFee, treasury] = await Promise.all([
          getPercentFee.data,
          getBaseFee.data,
          getTreasury.data,
        ]);
        console.log("Contract info fetched:", { percentFee, baseFee, treasury });
      } catch (err) {
        console.error("Failed to fetch contract info:", err);
      }
    };
    fetchContractInfo();
  }, [getPercentFee, getBaseFee, getTreasury]);

  const approveStrategy = async () => {
    setIsApprovingStrategy(true);
    try {
      console.log("Adding strategy to cloneable list...");
      const result = await addToCloneableStrategies({ args: [VAULT_STRATEGY_ADDRESS] });
      console.log("Strategy added to cloneable list:", result);
    } catch (error) {
      console.error("Failed to approve strategy:", error);
      setError("Failed to approve strategy. Please try again or contact the administrator.");
    } finally {
      setIsApprovingStrategy(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setDetailedError(null);

    if (!address) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      console.log("Creating profile...");
      const createProfileResult = await createProfile.mutateAsync({
        args: [Date.now(), programName, [1, ""], address, []],
      });

      const profileCreatedEvent = createProfileResult.receipt.events.find(
        (event) => event.event === "ProfileCreated"
      );

      if (!profileCreatedEvent) {
        throw new Error("ProfileCreated event not found in transaction receipt.");
      }

      const profileId = profileCreatedEvent.args[0];
      console.log("Profile ID:", profileId);
      console.log("Anchor Address:", profileCreatedEvent.args.anchor);

      console.log("Creating pool...");
      const initStrategyData = ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "uint256", "uint256"],
        [0, 0, 0, 0]
      );

      const createPoolResult = await createPool.mutateAsync({
        args: [
          profileId,
          VAULT_STRATEGY_ADDRESS,
          initStrategyData,
          OP_TOKEN_ADDRESS,
          0, // 0 initial funding
          [1, programName], // metadata
          [address], // managers (only connected address)
        ],
        overrides: {
          gasLimit: 3000000, // Adjust this value based on your needs
        },
      });

      console.log("Pool creation result:", createPoolResult);

      const poolCreatedEvent = createPoolResult.receipt.events.find(
        (event) => event.event === "PoolCreated"
      );

      if (!poolCreatedEvent) {
        console.error("All events:", createPoolResult.receipt.events);
        throw new Error("PoolCreated event not found in transaction receipt.");
      }

      const poolId = poolCreatedEvent.args.poolId;
      console.log("Pool created with ID:", poolId);

      onSuccess && onSuccess({ id: poolId, name: programName });
      onClose();
    } catch (err) {
      console.error("Failed to create program:", err);
      handleError(err);
    }
  };

  const handleError = (err) => {
    let errorMessage = "An unknown error occurred";
    let detailedErrorMessage = JSON.stringify(err, Object.getOwnPropertyNames(err), 2);

    if (err instanceof Error) {
      errorMessage = err.message;
    }

    if (err.reason) {
      errorMessage = `Contract error: ${err.reason}`;
    }

    setError(`Error: ${errorMessage}`);
    setDetailedError(detailedErrorMessage);
  };

  if (isCheckingStrategy) {
    return <div>Checking strategy approval...</div>;
  }

  if (!isCloneableStrategy) {
    return (
      <div>
        <p>Strategy is not approved for cloning. Please approve it first.</p>
        <button onClick={approveStrategy} disabled={isApprovingStrategy}>
          {isApprovingStrategy ? "Approving..." : "Approve Strategy"}
        </button>
      </div>
    );
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
      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={() => setShowErrorDetails(!showErrorDetails)}>
            {showErrorDetails ? "Hide" : "Show"} Details
          </button>
          {showErrorDetails && (
            <pre className={styles.errorDetails}>{detailedError}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateProgramForm;