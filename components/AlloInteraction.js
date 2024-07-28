import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Allo } from "@allo-team/allo-v2-sdk";

const AlloInteraction = () => {
  const [newFee, setNewFee] = useState("");
  const [status, setStatus] = useState("");
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    connectToMetaMask();
  }, []);

  const connectToMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await switchToOptimism();
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setUserAddress(accounts[0]);
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

  const handleUpdateFee = async () => {
    if (!userAddress) {
      setStatus("Please connect to MetaMask first.");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const allo = new Allo({
        chain: 10,
        rpc: "https://mainnet.optimism.io",
        address: "0xe0871238de109E0Af23aF651786d8484c0b0d656",
        signer: signer,
      });

      const feePercentage = ethers.utils.parseUnits(newFee, 12);
      const txData = allo.updatePercentFee(feePercentage);

      const tx = await signer.sendTransaction({
        to: txData.to,
        data: txData.data,
      });

      setStatus("Transaction sent. Waiting for confirmation...");
      await tx.wait();
      setStatus("Percentage fee updated successfully!");
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
          <p>Connected Address: {userAddress}</p>
        ) : (
          <button onClick={connectToMetaMask}>Connect to MetaMask</button>
        )}
        <h3>Update Percentage Fee</h3>
        <input
          type="number"
          value={newFee}
          onChange={(e) => setNewFee(e.target.value)}
          placeholder="New fee percentage"
        />
        <button onClick={handleUpdateFee}>Update Fee</button>
        {status && <p>{status}</p>}
      </div>
    </div>
  );
};

export default AlloInteraction;
