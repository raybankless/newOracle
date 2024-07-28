import React, { useState, useEffect } from "react";
import {
  createPublicClient,
  http,
  createWalletClient,
  custom,
  encodeFunctionData,
  parseAbi,
} from "viem";
import { optimism } from "viem/chains";
import { Allo, Registry } from "@allo-team/allo-v2-sdk";

const ALLO_ADDRESS = "0xe0871238de109E0Af23aF651786d8484c0b0d656";

const alloABI = parseAbi([
  "function updatePercentFee(uint256 _percentFee)",
  "function getPercentFee() view returns (uint256)",
]);

const AlloInteraction = () => {
  const [newFee, setNewFee] = useState("");
  const [status, setStatus] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [currentFee, setCurrentFee] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  const publicClient = createPublicClient({
    chain: optimism,
    transport: http(),
  });

  const allo = new Allo({ chain: 10 });
  const registry = new Registry({ chain: 10 });

  useEffect(() => {
    connectToMetaMask();
  }, []);

  const connectToMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await switchToOptimism();
        const [address] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setUserAddress(address);
        await fetchCurrentFee();
        await checkOwnership(address);
      } catch (error) {
        console.error("Failed to connect to MetaMask:", error);
        setStatus("Failed to connect to MetaMask. Please try again.");
      }
    } else {
      setStatus(
        "MetaMask is not installed. Please install it to use this feature.",
      );
    }
  };

  const switchToOptimism = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xa" }], // 0xa is the chain ID for Optimism Mainnet
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xa",
                  chainName: "Optimism Mainnet",
                  nativeCurrency: {
                    name: "Ether",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://mainnet.optimism.io"],
                  blockExplorerUrls: ["https://optimistic.etherscan.io"],
                },
              ],
            });
          } catch (addError) {
            console.error(
              "Failed to add Optimism network to MetaMask:",
              addError,
            );
          }
        }
        console.error("Failed to switch to Optimism network:", switchError);
      }
    }
  };

  const checkOwnership = async (address) => {
    try {
      const alloOwner = await registry.getAlloOwner();
      setIsOwner(alloOwner.toLowerCase() === address.toLowerCase());
    } catch (error) {
      console.error("Error checking ownership:", error);
    }
  };

  const fetchCurrentFee = async () => {
    try {
      const fee = await allo.getPercentFee();
      setCurrentFee((Number(fee) / 1e12).toString());
    } catch (error) {
      console.error("Error fetching current fee:", error);
      setStatus("Error fetching current fee. Check console for details.");
    }
  };

  const handleUpdateFee = async () => {
    if (!userAddress) {
      setStatus("Please connect to MetaMask first.");
      return;
    }

    if (!isOwner) {
      setStatus("Error: You don't have permission to update the fee.");
      return;
    }

    try {
      const walletClient = createWalletClient({
        chain: optimism,
        transport: custom(window.ethereum),
      });

      const feePercentage = BigInt(parseFloat(newFee) * 1e12);

      const data = encodeFunctionData({
        abi: alloABI,
        functionName: "updatePercentFee",
        args: [feePercentage],
      });

      const hash = await walletClient.sendTransaction({
        account: userAddress,
        to: ALLO_ADDRESS,
        data: data,
      });

      setStatus("Transaction sent. Waiting for confirmation...");
      await publicClient.waitForTransactionReceipt({ hash });
      setStatus("Percentage fee updated successfully!");
      await fetchCurrentFee(); // Refresh the current fee
    } catch (error) {
      console.error("Error updating fee:", error);
      setStatus("Error updating fee. Check console for details.");
    }
  };

  return (
    <div>
      <h2>Allo Interaction</h2>
      <div>
        {userAddress ? (
          <>
            <p>Connected Address: {userAddress}</p>
            <p>Is Allo Owner: {isOwner ? "Yes" : "No"}</p>
          </>
        ) : (
          <button onClick={connectToMetaMask}>Connect to MetaMask</button>
        )}
        <h3>Current Percentage Fee: {currentFee}%</h3>
        <h3>Update Percentage Fee</h3>
        <input
          type="number"
          value={newFee}
          onChange={(e) => setNewFee(e.target.value)}
          placeholder="New fee percentage"
        />
        <button onClick={handleUpdateFee} disabled={!isOwner}>
          Update Fee
        </button>
        {status && <p>{status}</p>}
      </div>
    </div>
  );
};

export default AlloInteraction;
