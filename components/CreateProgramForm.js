import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import styles from "../styles/CreateEventModal.module.css";
import { alloInteraction } from "../components/AlloContractInteraction";

const ALLO_CONTRACT_ADDRESS = "0xf5f35867AEccF350B55b90E41044F47428950920";
const REGISTRY_CONTRACT_ADDRESS = "0x3787d9680fc5EB34c5f5F75e793d93C98f07d952";
const VAULT_STRATEGY_ADDRESS = "0xeED429051B60b77F0492435D6E3F6115d272fE93";
const OP_TOKEN_ADDRESS = "0x4200000000000000000000000000000000000042";

const CreateProgramForm = ({ onClose, onSuccess, connectedAddress }) => {
  const [programName, setProgramName] = useState("");
  const [error, setError] = useState(null);
  const [detailedError, setDetailedError] = useState(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [isStrategyApproved, setIsStrategyApproved] = useState(false);
  const [isApprovingStrategy, setIsApprovingStrategy] = useState(false);
  const [signer, setSigner] = useState(null);
  const [allo, setAllo] = useState(null);

  useEffect(() => {
    const checkStrategyApproval = async () => {
      if (allo) {
        try {
          const isApproved = await allo.getRegistry().call("isCloneableStrategy", [
            VAULT_STRATEGY_ADDRESS,
          ]);
          setIsStrategyApproved(isApproved);
          console.log("Is strategy approved:", isApproved);
        } catch (error) {
          console.error("Error checking strategy approval:", error);
          setError("Failed to check strategy approval. Please try again.");
        }
      }
    };

    checkStrategyApproval();
  }, [allo]);

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setSigner(signer);
        setConnectedAddress(accounts[0]);
        const alloInstance = alloInteraction(signer);
        setAllo(alloInstance);
        console.log("Connected to MetaMask:", accounts[0]);
        console.log("Allo contract set:", alloInstance);
      } catch (error) {
        console.error("Failed to connect to MetaMask:", error);
        setError("Failed to connect to MetaMask. Please try again.");
      }
    } else {
      setError("MetaMask is not installed. Please install it to continue.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setDetailedError(null);

    if (!allo) {
      setError("Allo contract not initialized. Please try again.");
      return;
    }

    console.log("Starting form submission...");
    try {
      console.log("Creating profile...");
      const createProfileResult = await allo.createProfile({
        args: [Date.now(), programName, [1, ""], connectedAddress, []],
      });
      console.log("Profile created:", createProfileResult.receipt);

      const profileCreatedEvent = createProfileResult.receipt.events.find(
        (event) => event.event === "ProfileCreated"
      );

      if (!profileCreatedEvent) {
        throw new Error(
          "ProfileCreated event not found in transaction receipt."
        );
      }

      const profileId = profileCreatedEvent.args[0];
      console.log("Profile ID:", profileId);

      console.log("Creating pool...");
      const initStrategyData = ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "uint256", "uint256"],
        [0, 0, 0, 0]
      );

      const createPoolResult = await allo.createPool(
        signer,
        profileId,
        VAULT_STRATEGY_ADDRESS,
        initStrategyData,
        OP_TOKEN_ADDRESS,
        0,
        [1, programName],
        [connectedAddress],
        {
          gasLimit: ethers.utils.hexlify(3000000),
        }
      );

      console.log("Pool creation result:", createPoolResult);

      const receipt = await createPoolResult.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed. Check console for details.");
      }

      const poolCreatedEvent = receipt.events.find(
        (event) => event.event === "PoolCreated"
      );

      if (!poolCreatedEvent) {
        console.error("All events:", receipt.events);
        throw new Error(
          "PoolCreated event not found in transaction receipt. Check console for all events."
        );
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
    let detailedErrorMessage = JSON.stringify(
      err,
      Object.getOwnPropertyNames(err),
      2
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
              `0x${err.data.slice(10)}`
            );
            errorMessage = `Custom Error: ${decodedCustomError[0]}`;
            detailedErrorMessage = JSON.stringify(decodedCustomError, null, 2);
          }
        }
      } catch (parseError) {
        console.error("Failed to parse contract error:", parseError);
        detailedErrorMessage +=
          "\n\nFailed to parse contract error: " +
          JSON.stringify(parseError, Object.getOwnPropertyNames(parseError), 2);
      }
    }

    setError(`Error: ${errorMessage}`);
    setDetailedError(detailedErrorMessage);
  };

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.textBlack}>Create a Grant Program</h2>
      {!connectedAddress ? (
        <button onClick={connectToMetaMask}>Connect to MetaMask</button>
      ) : !isStrategyApproved ? (
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
