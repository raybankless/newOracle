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
  "function createPool(bytes32 profileId, address strategy, bytes initData, address token, uint256 amount, (uint256, string) metadata, address[] managers) external returns (uint256)",
  "function updateBaseFee(uint256 _baseFee) external",
  "function updateTreasury(address payable _treasury) external",
  "function getPool(uint256 _poolId) external view returns (tuple(bytes32 profileId, address strategy, (uint256, string) metadata, address token, bytes32 managerRole, bytes32 adminRole))",
  "function isCloneableStrategy(address strategy) external view returns (bool)",
  "function addToCloneableStrategies(address strategy) external",
  // Event signatures
  "event PoolCreated(uint256 indexed poolId, bytes32 profileId, address strategy, address token, uint256 amount, (uint256, string) metadata)",
  "event StrategyApproved(address indexed strategy)",
  "event BaseFeePaid(uint256 indexed poolId, uint256 fee)"
];

export const alloInteraction = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(ALLO_CONTRACT_ADDRESS, ABI, signer);

  return {
    contract,
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
    getTreasury: async () => {
      return await contract.getTreasury();
    },
    getRegistry: async () => {
      return await contract.getRegistry();
    },
    createPool: async (
      profileId,
      strategy,
      initData,
      token,
      amount,
      metadata,
      managers,
    ) => {
      return await contract.createPool(
        profileId,
        strategy,
        initData,
        token,
        amount,
        metadata,
        managers,
      );
    },
    getPool: async (poolId) => {
      return await contract.getPool(poolId);
    },
    isCloneableStrategy: async (strategy) => {
      return await contract.isCloneableStrategy(strategy);
    },
    addToCloneableStrategies: async (strategy) => {
      const tx = await contract.addToCloneableStrategies(strategy);
      await tx.wait();  // wait for the transaction to be mined
      return tx;
    },
    listenToPoolCreated: async (callback) => {
      contract.on("PoolCreated", callback);
    },
    listenToStrategyApproved: async (callback) => {
      contract.on("StrategyApproved", callback);
    },
    listenToBaseFeePaid: async (callback) => {
      contract.on("BaseFeePaid", callback);
    },
    getPastEvents: async (eventName, filter) => {
      return await contract.queryFilter(contract.filters[eventName](filter));
    },
    getSigner: () => signer,
  };
};