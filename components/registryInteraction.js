// utils/registryInteraction.js
import { ethers } from "ethers";

const REGISTRY_CONTRACT_ADDRESS = "0x3787d9680fc5EB34c5f5F75e793d93C98f07d952";
const ABI = [
  "function createProfile(uint256,string,(uint256,string),address,address[]) external returns (bytes32)",
  "function getProfileById(bytes32 _profileId) external view returns (tuple(bytes32,uint256,string,tuple(uint256,string),address,address))",
  "function updateProfileName(bytes32 _profileId, string memory _name) external returns (address)",
  "function updateProfileMetadata(bytes32 _profileId, tuple(uint256,string) memory _metadata) external",
  "function updateProfilePendingOwner(bytes32 _profileId, address _pendingOwner) external",
  "function acceptProfileOwnership(bytes32 _profileId) external",
  "function addMembers(bytes32 _profileId, address[] memory _members) external",
  "function removeMembers(bytes32 _profileId, address[] memory _members) external"
];

export const registryInteraction = (provider) => {
  const contract = new ethers.Contract(REGISTRY_CONTRACT_ADDRESS, ABI, provider);

  return {
    createProfile: async (signer, nonce, name, metadata, owner, members) => {
      const contractWithSigner = contract.connect(signer);
      return await contractWithSigner.createProfile(nonce, name, metadata, owner, members);
    },
    getProfileById: async (profileId) => {
      return await contract.getProfileById(profileId);
    },
    updateProfileName: async (signer, profileId, name) => {
      const contractWithSigner = contract.connect(signer);
      return await contractWithSigner.updateProfileName(profileId, name);
    },
    updateProfileMetadata: async (signer, profileId, metadata) => {
      const contractWithSigner = contract.connect(signer);
      return await contractWithSigner.updateProfileMetadata(profileId, metadata);
    },
    updateProfilePendingOwner: async (signer, profileId, pendingOwner) => {
      const contractWithSigner = contract.connect(signer);
      return await contractWithSigner.updateProfilePendingOwner(profileId, pendingOwner);
    },
    acceptProfileOwnership: async (signer, profileId) => {
      const contractWithSigner = contract.connect(signer);
      return await contractWithSigner.acceptProfileOwnership(profileId);
    },
    addMembers: async (signer, profileId, members) => {
      const contractWithSigner = contract.connect(signer);
      return await contractWithSigner.addMembers(profileId, members);
    },
    removeMembers: async (signer, profileId, members) => {
      const contractWithSigner = contract.connect(signer);
      return await contractWithSigner.removeMembers(profileId, members);
    }
  };
};