// utils/registryInteraction.js
import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";

const REGISTRY_CONTRACT_ADDRESS = "0x3787d9680fc5EB34c5f5F75e793d93C98f07d952";

export const useRegistryInteraction = () => {
  const { contract } = useContract(REGISTRY_CONTRACT_ADDRESS);

  const createProfile = useContractWrite(contract, "createProfile");
  const getProfileById = useContractRead(contract, "getProfileById");
  const updateProfileName = useContractWrite(contract, "updateProfileName");
  const updateProfileMetadata = useContractWrite(contract, "updateProfileMetadata");
  const updateProfilePendingOwner = useContractWrite(contract, "updateProfilePendingOwner");
  const acceptProfileOwnership = useContractWrite(contract, "acceptProfileOwnership");
  const addMembers = useContractWrite(contract, "addMembers");
  const removeMembers = useContractWrite(contract, "removeMembers");

  return {
    createProfile,
    getProfileById,
    updateProfileName,
    updateProfileMetadata,
    updateProfilePendingOwner,
    acceptProfileOwnership,
    addMembers,
    removeMembers,
  };
};