import React, { useState, useEffect } from "react";
import { Allo, Registry } from "@allo-team/allo-v2-sdk";

const ALLO_ADDRESS = "0xe0871238de109E0Af23aF651786d8484c0b0d656";

const AlloTest = () => {
  const [userAddress, setUserAddress] = useState("");
  const [profileId, setProfileId] = useState("");
  const [isProfileOwner, setIsProfileOwner] = useState(false);
  const [isAlloOwner, setIsAlloOwner] = useState(false);
  const [isAnchorOwner, setIsAnchorOwner] = useState(false);
  const [currentFee, setCurrentFee] = useState("");
  const [newFee, setNewFee] = useState("");
  const [status, setStatus] = useState("");
  const [alloAddress, setAlloAddress] = useState("");

  const allo = new Allo({ chain: 10 });
  const registry = new Registry({ chain: 10 });

  useEffect(() => {
    connectToMetaMask();
  }, []);

  setAlloAddress(allo.address);
  console.log(alloAddress);

  const connectToMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await switchToOptimism();
        const [address] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setUserAddress(address);
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

  /*const checkUserProfile = async (address) => {
    try {
      const profiles = await registry.getProfilesByOwner(address);
      if (profiles.length > 0) {
        setProfileId(profiles[0].id);
        setIsProfileOwner(true);
        await checkAlloOwnership(address);
        await checkAnchorOwnership(address, profiles[0].id);
      } else {
        setStatus(
          "No profile found. You need to create a profile to interact with Allo.",
        );
      }
    } catch (error) {
      console.error("Error checking user profile:", error);
      setStatus("Error checking user profile. Check console for details.");
    }
  };*/

  /*const checkAlloOwnership = async (address) => {
    try {
      const alloOwner = await allo.owner();
      console.log("allo 1 : ", alloOwner);
      const alloOwner2 = await registry.getAlloOwner();
      console.log("allo 2 : ", alloOwner2);
      setIsAlloOwner(alloOwner.toLowerCase() === address.toLowerCase());
    } catch (error) {
      console.error("Error checking Allo ownership:", error);
      setStatus("Error checking Allo ownership. Check console for details.");
    }
  };*/

  /*const checkAnchorOwnership = async (address, profileId) => {
    try {
      const isOwner = await registry.isOwnerOfProfile({
        profileId,
        account: address,
      });
      setIsAnchorOwner(isOwner);
    } catch (error) {
      console.error("Error checking Anchor ownership:", error);
      setStatus("Error checking Anchor ownership. Check console for details.");
    }
  };*/

  /*const fetchCurrentFee = async () => {
    try {
      const fee = await allo.getPercentFee();
      setCurrentFee((Number(fee) / 1e12).toString());
    } catch (error) {
      console.error("Error fetching current fee:", error);
      setStatus("Error fetching current fee. Check console for details.");
    }
  };*/

  /*const handleUpdateFee = async () => {
    if (!userAddress) {
      setStatus("Please connect to MetaMask first.");
      return;
    }

    if (!isAlloOwner) {
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
      await fetchCurrentFee();
    } catch (error) {
      console.error("Error updating fee:", error);
      setStatus("Error updating fee. Check console for details.");
    }
  };*/

  return (
    <div>
      <h2>Allo and Anchor Interaction</h2>
      <div>
        {userAddress ? (
          <>
            <p>Connected Address: {userAddress}</p>
            {profileId ? (
              <>
                <p>Profile ID: {profileId}</p>
                <p>Is Profile Owner: {isProfileOwner ? "Yes" : "No"}</p>
                <p>Is Allo Owner: {isAlloOwner ? "Yes" : "No"}</p>
                <p>Is Anchor Owner: {isAnchorOwner ? "Yes" : "No"}</p>
                <h3>Current Percentage Fee: {currentFee}%</h3>
                <h3>ALLO ADDY: {alloAddress}%</h3>
                <h3>Update Percentage Fee</h3>
                <input
                  type="number"
                  value={newFee}
                  onChange={(e) => setNewFee(e.target.value)}
                  placeholder="New fee percentage"
                />
                <button onClick={handleUpdateFee} disabled={!isAlloOwner}>
                  Update Fee
                </button>
              </>
            ) : (
              <>
                <p>No profile found.</p>
                <button onClick={createProfile}>Create Profile</button>
              </>
            )}
          </>
        ) : (
          <button onClick={connectToMetaMask}>Connect to MetaMask</button>
        )}
        {status && <p>{status}</p>}
      </div>
    </div>
  );
};

export default AlloAndAnchorInteraction;
