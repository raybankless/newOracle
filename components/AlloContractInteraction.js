// components/alloInteraction.js
import { ethers } from "ethers";

const ALLO_CONTRACT_ADDRESS = "0xf5f35867AEccF350B55b90E41044F47428950920";
const ABI = [
  "function getFeeDenominator() public pure returns (uint256)",
  "function updatePercentFee(uint256 _percentFee) external",
  "function getPercentFee() external view returns (uint256)",
  "function getBaseFee() external view returns (uint256)",
  "function getTreasury() external view returns (address)",
  "function getRegistry() external view returns (address)",
  "function createPool(bytes32,address,bytes,address,uint256,(uint256,string),address[]) external returns (uint256)",
  "function updateBaseFee(uint256 _baseFee) external",
  "function updateTreasury(address payable _treasury) external",
  "function getPool(uint256 _poolId) external view returns (tuple(bytes32 profileId, address strategy, (uint256, string) metadata, address token, bytes32 managerRole, bytes32 adminRole))"
  ];

export const alloInteraction = (provider) => {
  const contract = new ethers.Contract(ALLO_CONTRACT_ADDRESS, ABI, provider);

  return {
    getFeeDenominator: async () => {
      
      return await contract.getFeeDenominator();
    },
    updatePercentFee: async (signer, newPercentFee) => {
      const contractWithSigner = contract.connect(signer);
      return await contractWithSigner.updatePercentFee(newPercentFee);
    },
    getPercentFee: async () => {
      return await contract.getPercentFee();
    },
    getBaseFee: async () => {
      return await contract.getBaseFee();
    },
    updateBaseFee: async (signer, newBaseFee) => {
      const contractWithSigner = contract.connect(signer);
      return await contractWithSigner.updateBaseFee(newBaseFee);
    },
    getTreasury: async () => {
      return await contract.getTreasury();
    },
    updateTreasury: async (signer, newTreasury) => {
      const contractWithSigner = contract.connect(signer);
      return await contractWithSigner.updateTreasury(newTreasury);
    },
    getRegistry: async () => {
      return await contract.getRegistry();
    },
    createPool: async (signer, profileId, strategy, initData, token, amount, metadata, managers, options = {}) => {
      const contractWithSigner = contract.connect(signer);
      return await contractWithSigner.createPool(profileId, strategy, initData, token, amount, metadata, managers, options);
    },
    getPool: async (poolId) => {
      return await contract.getPool(poolId);
    }
  };
  
};