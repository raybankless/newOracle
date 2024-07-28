// components/AlloContractInteraction.js
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xe0871238de109E0Af23aF651786d8484c0b0d656";
const INFURA_ID = "6561b6462f824490b0bec934ada8dd65";

const ABI = [
  "function getFeeDenominator() public pure returns (uint256)",
  "function updatePercentFee(uint256 _percentFee) external",
  "function getPercentFee() external view returns (uint256)",
  "function getBaseFee() external view returns (uint256)",
  "function getTreasury() external view returns (address)",
  "function getRegistry() external view returns (address)",
];

const AlloContractInteraction = () => {
  const [contractInfo, setContractInfo] = useState(null);
  const [error, setError] = useState(null);
  const [newPercentFee, setNewPercentFee] = useState("");

  useEffect(() => {
    const fetchContractInfo = async () => {
      console.log("Starting fetchContractInfo function");
      try {
        console.log("Creating provider");
        const provider = new ethers.providers.JsonRpcProvider(
          `https://optimism-mainnet.infura.io/v3/${INFURA_ID}`,
        );
        console.log("Provider created:", provider);

        console.log("Creating contract instance");
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        console.log("Contract instance created:", contract);

        console.log("Calling contract methods");
        const feeDenominator = await contract.getFeeDenominator();
        console.log("feeDenominator:", feeDenominator.toString());

        const percentFee = await contract.getPercentFee();
        console.log("percentFee:", percentFee.toString());

        const baseFee = await contract.getBaseFee();
        console.log("baseFee:", baseFee.toString());

        const treasury = await contract.getTreasury();
        console.log("treasury:", treasury);

        const registry = await contract.getRegistry();
        console.log("registry:", registry);

        console.log("Setting contract info state");
        setContractInfo({
          feeDenominator: feeDenominator.toString(),
          percentFee: ethers.utils.formatUnits(percentFee, 18),
          baseFee: ethers.utils.formatUnits(baseFee, 18),
          treasury,
          registry,
        });
        console.log("Contract info state set");
      } catch (err) {
        console.error("Error in fetchContractInfo:", err);
        setError(
          err.message ||
            "An error occurred while fetching contract information",
        );
      }
    };

    console.log("Calling fetchContractInfo");
    fetchContractInfo();
  }, []);

  console.log("Rendering component");
  console.log("Current contractInfo:", contractInfo);
  console.log("Current error:", error);

  const updatePercentFee = async () => {
    try {
      console.log("Starting updatePercentFee function");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      console.log("Signer address:", signerAddress);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Additional check: Get the current percent fee
      const currentFee = await contract.getPercentFee();
      console.log(
        "Current percent fee:",
        ethers.utils.formatUnits(currentFee, 18),
      );

      // Convert the percentage to the correct format (18 decimal places)
      // Ensure the input is treated as a percentage (e.g., 10 for 10%)
      const percentFeeInWei = ethers.utils.parseUnits(
        (parseFloat(newPercentFee) / 100).toString(),
        18,
      );
      console.log("New percent fee in wei:", percentFeeInWei.toString());

      // Additional check: Estimate gas
      const gasEstimate =
        await contract.estimateGas.updatePercentFee(percentFeeInWei);
      console.log("Estimated gas:", gasEstimate.toString());

      // Try to send the transaction
      // If it fails due to permissions, it will throw an error
      const tx = await contract.updatePercentFee(percentFeeInWei, {
        gasLimit: gasEstimate.mul(120).div(100), // Add 20% buffer to the estimate
      });
      console.log("Transaction sent:", tx.hash);

      const receipt = await tx.wait();
      console.log("Transaction confirmed in block:", receipt.blockNumber);

      // Refresh the contract info after updating
      await fetchContractInfo();

      console.log("Percentage fee updated successfully");
    } catch (err) {
      console.error("Error updating percentage fee:", err);
      if (err.error && err.error.data) {
        console.error("Error data:", err.error.data);
      }
      if (err.message.includes("Ownable: caller is not the owner")) {
        setError(
          "You are not the contract owner. Only the owner can update the percentage fee.",
        );
      } else {
        setError(
          err.message || "An error occurred while updating the percentage fee",
        );
      }
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!contractInfo) {
    return <p>Loading contract information...</p>;
  }

  return (
    <div>
      <h2 style={{ color: "black" }}>Allo Contract Information</h2>
      <p style={{ color: "black" }}>
        Fee Denominator: {contractInfo.feeDenominator}
      </p>
      <p style={{ color: "black" }}>Percent Fee: {contractInfo.percentFee}%</p>
      <p style={{ color: "black" }}>Base Fee: {contractInfo.baseFee} ETH</p>
      <p style={{ color: "black" }}>
        Treasury Address: {contractInfo.treasury}
      </p>
      <p style={{ color: "black" }}>
        Registry Address: {contractInfo.registry}
      </p>
      <h3 style={{ color: "black" }}>Update Percentage Fee</h3>
      <input
        type="number"
        step="0.01"
        value={newPercentFee}
        onChange={(e) => setNewPercentFee(e.target.value)}
        placeholder="New Percentage Fee (e.g., 10 for 10%)"
      />
      <button onClick={updatePercentFee}>Update Fee</button>

      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default AlloContractInteraction;
