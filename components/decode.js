const { ethers } = require('ethers');

const ALLO_CONTRACT_ABI = [
  "function createProfile(uint256 _nonce, string memory _name, (uint256, string) memory _metadata, address _owner, address[] memory _members) external returns (bytes32)",
  "function getProfileById(bytes32 _profileId) external view returns (address, string memory, uint256, address, bytes[])",
  "function updateProfileName(bytes32 _profileId, string memory _name) external returns (address)",
  "function updateProfileMetadata(bytes32 _profileId, (uint256, string) memory _metadata) external",
  "function updateProfilePendingOwner(bytes32 _profileId, address _pendingOwner) external",
  "function acceptProfileOwnership(bytes32 _profileId) external",
  "function addMembers(bytes32 _profileId, address[] memory _members) external",
  "function removeMembers(bytes32 _profileId, address[] memory _members) external",
  "event ProfileCreated(bytes32 indexed profileId, uint256 nonce, string name, (uint256, string) metadata, address owner, address anchor)",
  "function createPool(bytes32 profileId, address strategy, bytes initStrategyData, address token, uint256 amount, (uint256, string) metadata, address[] managers) external returns (uint256)",
];

const encodedData = "0x77da8cafe8367ab7d9b3fa5f76f55e9ddc190d3a9a0d00c3ffda545ee7f96878e7f9313f000000000000000000000000eed429051b60b77f0492435d6e3f6115d272fe9300000000000000000000000000000000000000000000000000000000000000e000000000000000000000000042000000000000000000000000000000000000420000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000006696d70616374000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000001cc81345720fbe53851f96607068578f45bbf021";

const iface = new ethers.utils.Interface(ALLO_CONTRACT_ABI);
const decoded = iface.parseTransaction({ data: encodedData });

console.log("Decoded Transaction Data:");
console.log("Function Name:", decoded.name);
console.log("Signature:", decoded.signature);
console.log("Arguments:", decoded.args);
