// components/AlloContractInteraction.js
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xe0871238de109E0Af23aF651786d8484c0b0d656";
const INFURA_ID = "6561b6462f824490b0bec934ada8dd65";

const ABI = [
  "function getFeeDenominator() public pure returns (uint256)",
  "function getPercentFee() external view returns (uint256)",
  "function getBaseFee() external view returns (uint256)",
  "function getTreasury() external view returns (address)",
  "function getRegistry() external view returns (address)",
];

const AlloContractInteraction = () => {
  const [contractInfo, setContractInfo] = useState(null);
  const [error, setError] = useState(null);

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

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!contractInfo) {
    return <p>Loading contract information...</p>;
  }

  return (
    <div>
      <h2>Allo Contract Information</h2>
      <p>Fee Denominator: {contractInfo.feeDenominator}</p>
      <p>Percent Fee: {contractInfo.percentFee}%</p>
      <p>Base Fee: {contractInfo.baseFee} ETH</p>
      <p>Treasury Address: {contractInfo.treasury}</p>
      <p>Registry Address: {contractInfo.registry}</p>
    </div>
  );
};

export default AlloContractInteraction;
