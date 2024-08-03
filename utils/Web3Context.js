// utils/Web3Context.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        const accounts = await web3Provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          const web3Signer = web3Provider.getSigner();
          setSigner(web3Signer);
          setAddress(accounts[0]);
        }
      }
    };

    init();
  }, []);

  return (
    <Web3Context.Provider value={{ provider, signer, address }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
