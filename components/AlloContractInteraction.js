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

export const alloInteraction = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install it to continue.");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(ALLO_CONTRACT_ADDRESS, ABI, signer);

  return {
    getFeeDenominator: async () => {
      return await contract.getFeeDenominator();
    },
    updatePercentFee: async (newPercentFee) => {
      return await contract.updatePercentFee(newPercentFee);
    },
    getPercentFee: async () => {
      return await contract.getPercentFee();
    },
    getBaseFee: async () => {
      return await contract.getBaseFee();
    },
    updateBaseFee: async (newBaseFee) => {
      return await contract.updateBaseFee(newBaseFee);
    },
    getTreasury: async () => {
      return await contract.getTreasury();
    },
    updateTreasury: async (newTreasury) => {
      return await contract.updateTreasury(newTreasury);
    },
    getRegistry: async () => {
      return await contract.getRegistry();
    },
    createPool: async (profileId, strategy, initData, token, amount, metadata, managers, options = {}) => {
      return await contract.createPool(profileId, strategy, initData, token, amount, metadata, managers, options);
    },
    getPool: async (poolId) => {
      return await contract.getPool(poolId);
    }
  };
};
