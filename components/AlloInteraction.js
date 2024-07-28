// components/AlloContractInteraction.js
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xe0871238de109E0Af23aF651786d8484c0b0d656";
const INFURA_ID = "6561b6462f824490b0bec934ada8dd65";

const ABI = [
  // Add only the functions you need here. For example:
  "function getFeeDenominator() public pure returns (uint256)",
  "function getPercentFee() external view returns (uint256)",
  "function getBaseFee() external view returns (uint256)",
  "function getTreasury() external view returns (address)",
  "function getRegistry() external view returns (address)",
];

const AlloInteraction = () => {
  const [contractInfo, setContractInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContractInfo = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          `https://optimism-mainnet.infura.io/v3/${INFURA_ID}`,
        );
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

        const [feeDenominator, percentFee, baseFee, treasury, registry] =
          await Promise.all([
            contract.getFeeDenominator(),
            contract.getPercentFee(),
            contract.getBaseFee(),
            contract.getTreasury(),
            contract.getRegistry(),
          ]);

        setContractInfo({
          feeDenominator: feeDenominator.toString(),
          percentFee: ethers.utils.formatUnits(percentFee, 18),
          baseFee: ethers.utils.formatUnits(baseFee, 18),
          treasury,
          registry,
        });
      } catch (err) {
        console.error("Error fetching contract info:", err);
        setError(
          err.message ||
            "An error occurred while fetching contract information",
        );
      }
    };

    fetchContractInfo();
  }, []);

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

export default AlloInteraction;
