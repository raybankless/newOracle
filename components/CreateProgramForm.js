import React, { useState, useEffect } from "react";
import {
  useContract,
  useContractWrite,
  useContractRead,
  useAddress,
  useNetwork,
  useNetworkMismatch,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import styles from "../styles/CreateEventModal.module.css";

const ALLO_CONTRACT_ADDRESS = "0xf5f35867AEccF350B55b90E41044F47428950920";
const REGISTRY_CONTRACT_ADDRESS = "0x3787d9680fc5EB34c5f5F75e793d93C98f07d952";
const VAULT_STRATEGY_ADDRESS = "0xeED429051B60b77F0492435D6E3F6115d272fE93";
const OP_TOKEN_ADDRESS = "0x4200000000000000000000000000000000000042";

const CreateProgramForm = ({ onClose, onSuccess }) => {
  const [programName, setProgramName] = useState("");
  const [error, setError] = useState(null);
  const [detailedError, setDetailedError] = useState(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [isStrategyApproved, setIsStrategyApproved] = useState(false);
  const [isApprovingStrategy, setIsApprovingStrategy] = useState(false);

  const address = useAddress();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const { contract: registryContract } = useContract(REGISTRY_CONTRACT_ADDRESS);
  const { contract: alloContract } = useContract(ALLO_CONTRACT_ADDRESS);

  const { mutateAsync: createProfile, isLoading: isCreatingProfile } =
    useContractWrite(registryContract, "createProfile");
  const { mutateAsync: createPool, isLoading: isCreatingPool } =
    useContractWrite(alloContract, "createPool");
  const { mutateAsync: addToCloneableStrategies } = useContractWrite(
    alloContract,
    "addToCloneableStrategies",
  );

  const { data: isCloneableStrategy, isLoading: isCheckingStrategy } =
    useContractRead(alloContract, "isCloneableStrategy", [
      VAULT_STRATEGY_ADDRESS,
    ]);

  useEffect(() => {
    if (!isCheckingStrategy) {
      setIsStrategyApproved(isCloneableStrategy);
      console.log("Is strategy cloneable:", isCloneableStrategy);
    }
  }, [isCheckingStrategy, isCloneableStrategy]);

  const approveStrategy = async () => {
    setIsApprovingStrategy(true);
    try {
      const result = await addToCloneableStrategies({
        args: [VAULT_STRATEGY_ADDRESS],
      });
      console.log("Strategy approved:", result);
      setIsStrategyApproved(true);
    } catch (error) {
      console.error("Failed to approve strategy:", error);
      setError(
        "Failed to approve strategy. Please try again or contact the administrator.",
      );
    } finally {
      setIsApprovingStrategy(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setDetailedError(null);

    if (networkMismatch) {
      await switchNetwork(10); // 10 is the chain ID for Optimism
      return;
    }

    if (!registryContract || !alloContract) {
      setError("Contracts not initialized. Please try again.");
      return;
    }

    if (!isStrategyApproved) {
      setError("Strategy is not approved. Please approve the strategy first.");
      return;
    }

    console.log("Starting form submission...");
    try {
      // Create profile
      console.log("Creating profile...");
      const createProfileResult = await createProfile({
        args: [Date.now(), programName, [1, ""], address, []],
      });
      console.log("Profile created:", createProfileResult.receipt);

      const profileCreatedEvent = createProfileResult.receipt.events.find(
        (event) => event.event === "ProfileCreated",
      );

      if (!profileCreatedEvent) {
        throw new Error(
          "ProfileCreated event not found in transaction receipt.",
        );
      }

      const profileId = profileCreatedEvent.args[0];
      console.log("Profile ID:", profileId);

      // Create pool with minimal initialization
      console.log("Creating pool...");
      const createPoolResult = await createPool({
        args: [
          profileId,
          VAULT_STRATEGY_ADDRESS,
          "0x", // minimal initStrategyData
          OP_TOKEN_ADDRESS,
          0, // 0 initial funding
          [1, programName], // metadata
          [address], // managers (only connected address)
        ],
      });
      console.log("Pool creation result:", createPoolResult);

      if (createPoolResult.receipt.status === 0) {
        console.error("Transaction receipt:", createPoolResult.receipt);
        throw new Error("Transaction failed. Check console for details.");
      }

      const poolCreatedEvent = createPoolResult.receipt.events.find(
        (event) => event.event === "PoolCreated",
      );

      if (!poolCreatedEvent) {
        console.error("All events:", createPoolResult.receipt.events);
        throw new Error(
          "PoolCreated event not found in transaction receipt. Check console for all events.",
        );
      }

      const poolId = poolCreatedEvent.args.poolId;
      console.log("Pool created with ID:", poolId);

      onSuccess && onSuccess({ id: poolId, name: programName });
      onClose();
    } catch (err) {
      console.error("Failed to create program:", err);

      let errorMessage = "An unknown error occurred";
      let detailedErrorMessage = JSON.stringify(
        err,
        Object.getOwnPropertyNames(err),
        2,
      );

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      if (err.reason) {
        errorMessage = `Contract error: ${err.reason}`;
      }

      if (err.data) {
        try {
          const decodedError = alloContract.interface.parseError(err.data);
          if (decodedError) {
            errorMessage = `Contract Error: ${decodedError.name}`;
            detailedErrorMessage = JSON.stringify(decodedError, null, 2);
            console.error("Decoded contract error:", decodedError);
          } else {
            const customErrorId = err.data.slice(0, 10);
            const customErrors = {
              "0x08c379a0": "Error(string)",
            };
            if (customErrors[customErrorId]) {
              const decodedCustomError = ethers.utils.defaultAbiCoder.decode(
                [customErrors[customErrorId]],
                `0x${err.data.slice(10)}`,
              );
              errorMessage = `Custom Error: ${decodedCustomError[0]}`;
              detailedErrorMessage = JSON.stringify(
                decodedCustomError,
                null,
                2,
              );
            }
          }
        } catch (parseError) {
          console.error("Failed to parse contract error:", parseError);
          detailedErrorMessage +=
            "\n\nFailed to parse contract error: " +
            JSON.stringify(
              parseError,
              Object.getOwnPropertyNames(parseError),
              2,
            );
        }
      }

      if (
        errorMessage.toLowerCase().includes("gas required exceeds allowance")
      ) {
        errorMessage =
          "Transaction failed: Insufficient gas. Try increasing the gas limit.";
      } else if (errorMessage.toLowerCase().includes("execution reverted")) {
        errorMessage =
          "Transaction reverted by the contract. This could be due to failing a condition check. Check your inputs and try again.";
      }

      setError(`Error: ${errorMessage}`);
      setDetailedError(detailedErrorMessage);
    }
  };

  if (isCheckingStrategy) {
    return <div>Checking strategy approval...</div>;
  }

  if (isCreatingProfile || isCreatingPool) {
    return <div>Creating program...</div>;
  }

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.textBlack}>Create a Grant Program</h2>
      {!isStrategyApproved ? (
        <div>
          <p>Strategy is not approved for cloning. Please approve it first.</p>
          <button onClick={approveStrategy} disabled={isApprovingStrategy}>
            {isApprovingStrategy ? "Approving..." : "Approve Strategy"}
          </button>
        </div>
      ) : (
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
      )}
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
