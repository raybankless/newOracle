import {
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";

const ALLO_CONTRACT_ADDRESS = "0xf5f35867AEccF350B55b90E41044F47428950920";

export const useAlloInteraction = () => {
  const { contract } = useContract(ALLO_CONTRACT_ADDRESS);

  const getFeeDenominator = useContractRead(contract, "getFeeDenominator");
  const getPercentFee = useContractRead(contract, "getPercentFee");
  const getBaseFee = useContractRead(contract, "getBaseFee");
  const getTreasury = useContractRead(contract, "getTreasury");
  const getRegistry = useContractRead(contract, "getRegistry");
  const getPool = useContractRead(contract, "getPool");

  const updatePercentFee = useContractWrite(contract, "updatePercentFee");
  const updateBaseFee = useContractWrite(contract, "updateBaseFee");
  const updateTreasury = useContractWrite(contract, "updateTreasury");
  const createPool = useContractWrite(contract, "createPool");

  return {
    getFeeDenominator,
    getPercentFee,
    getBaseFee,
    getTreasury,
    getRegistry,
    getPool,
    updatePercentFee,
    updateBaseFee,
    updateTreasury,
    createPool,
  };
};
