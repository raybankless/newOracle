// components/MintEvent.jsx
import { Web3Button, useAddress } from "@thirdweb-dev/react";
import hypercertABI from "../abis/hypercertABI.json"; // Adjust the path as needed
import { TransferRestrictions, formatHypercertData } from "@hypercerts-org/sdk";
import {useState} from "react";

const MintEvent = ({ event, units, onSuccess, onError }) => {
  const contractAddress = "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07";
  const account = useAddress();
  const [hypercerData, setHypercerData] = useState("");
  
  const mintAction = async (contract) => {

    try {
      const {
        data: metadata,
        valid,
        errors,
      } = formatHypercertData({
        name: event.name,
        description: `${event.location}  -  ${event.description}`,
        image: event.headerImage,
        external_url: event.additionalInfoLink,
        impactScope: [],
        workTimeframeStart: Math.floor(
          new Date(event.startDate).getTime() / 1000,
        ),
        workTimeframeEnd: Math.floor(
          new Date(event.endDate).getTime() / 1000,
        ),
        impactTimeframeStart: Math.floor(
          new Date(event.startDate).getTime() / 1000,
        ),
        impactTimeframeEnd: 0,
        workScope: event.scopeOfWork,
        contributors: [`Event Admin: ${event.creatorWallet}`],
        rights: ["Public Display"],
      });

      if (!valid) {
        console.error("Metadata validation failed:", errors);
        return;
      }
      setHypercerData(JSON.stringify(metadata));
      
    } catch (error) {
      console.error("Failed to create Hypercert:", error);
    }
    // Assuming the contract's mint function can handle the metadata format
    const transaction = await contract.mintClaim({
        account: account,
        units: units,
        _uri: hypercerData,
        restrictions: TransferRestrictions.FromCreatorOnly,
      });
      return transaction;
    
    };

  return (
    <Web3Button
      contractAddress={contractAddress}
      action={mintAction}
      contractAbi={hypercertABI}
      onSuccess={onSuccess}
      onError={onError}
    >
      Mint Event
    </Web3Button>
  );
};

export default MintEvent;
