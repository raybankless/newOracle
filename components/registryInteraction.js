import { ethers } from "ethers";

const REGISTRY_CONTRACT_ADDRESS = "0x3787d9680fc5EB34c5f5F75e793d93C98f07d952";
const ABI = [
  "function createProfile(uint256 _nonce, string memory _name, (uint256, string) memory _metadata, address _owner, address[] memory _members) external returns (bytes32)",
  "function getProfileById(bytes32 _profileId) external view returns (address, string memory, uint256, address, bytes[])",
  "function updateProfileName(bytes32 _profileId, string memory _name) external returns (address)",
  "function updateProfileMetadata(bytes32 _profileId, (uint256, string) memory _metadata) external",
  "function updateProfilePendingOwner(bytes32 _profileId, address _pendingOwner) external",
  "function acceptProfileOwnership(bytes32 _profileId) external",
  "function addMembers(bytes32 _profileId, address[] memory _members) external",
  "function removeMembers(bytes32 _profileId, address[] memory _members) external",
  "event ProfileCreated(bytes32 indexed profileId, uint256 nonce, string name, (uint256, string) metadata, address owner, address anchor)",
];

export const registryInteraction = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(REGISTRY_CONTRACT_ADDRESS, ABI, signer);

  return {
    createProfile: async (_nonce, _name, _metadata, _owner, _members) => {
      try {
        const tx = await contract.createProfile(_nonce, _name, _metadata, _owner, _members);
        const receipt = await tx.wait(); // wait for the transaction to be mined
        return receipt;
      } catch (error) {
        console.error("Failed to create profile:", error);
        throw error;
      }
    },
    getProfileById: async (_profileId) => {
      try {
        return await contract.getProfileById(_profileId);
      } catch (error) {
        console.error("Failed to get profile by ID:", error);
        throw error;
      }
    },
    updateProfileName: async (_profileId, _name) => {
      try {
        const tx = await contract.updateProfileName(_profileId, _name);
        const receipt = await tx.wait(); // wait for the transaction to be mined
        return receipt;
      } catch (error) {
        console.error("Failed to update profile name:", error);
        throw error;
      }
    },
    updateProfileMetadata: async (_profileId, _metadata) => {
      try {
        const tx = await contract.updateProfileMetadata(_profileId, _metadata);
        const receipt = await tx.wait(); // wait for the transaction to be mined
        return receipt;
      } catch (error) {
        console.error("Failed to update profile metadata:", error);
        throw error;
      }
    },
    updateProfilePendingOwner: async (_profileId, _pendingOwner) => {
      try {
        const tx = await contract.updateProfilePendingOwner(_profileId, _pendingOwner);
        const receipt = await tx.wait(); // wait for the transaction to be mined
        return receipt;
      } catch (error) {
        console.error("Failed to update profile pending owner:", error);
        throw error;
      }
    },
    acceptProfileOwnership: async (_profileId) => {
      try {
        const tx = await contract.acceptProfileOwnership(_profileId);
        const receipt = await tx.wait(); // wait for the transaction to be mined
        return receipt;
      } catch (error) {
        console.error("Failed to accept profile ownership:", error);
        throw error;
      }
    },
    addMembers: async (_profileId, _members) => {
      try {
        const tx = await contract.addMembers(_profileId, _members);
        const receipt = await tx.wait(); // wait for the transaction to be mined
        return receipt;
      } catch (error) {
        console.error("Failed to add members:", error);
        throw error;
      }
    },
    removeMembers: async (_profileId, _members) => {
      try {
        const tx = await contract.removeMembers(_profileId, _members);
        const receipt = await tx.wait(); // wait for the transaction to be mined
        return receipt;
      } catch (error) {
        console.error("Failed to remove members:", error);
        throw error;
      }
    },
    getSigner: () => signer,
  };
};
