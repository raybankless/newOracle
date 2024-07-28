// components/AlloInteraction.js
import React, { useEffect, useState } from "react";
import { Allo } from "@allo-team/allo-v2-sdk";

const AlloInteraction = () => {
  const [alloAddress, setAlloAddress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAllo = async () => {
      try {
        const allo = new Allo({ chain: 10 });
        console.log("allo : ", allo);

        const address = allo.address();
        setAlloAddress(address);
      } catch (err) {
        console.error("Error initializing Allo:", err);
        setError(err.message || "Failed to initialize Allo");
      }
    };

    initAllo();
  }, []);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!alloAddress) {
    return <p>Initializing Allo...</p>;
  }

  return (
    <div>
      <p>Allo Address: {alloAddress}</p>
      {/* Add more Allo interactions here */}
    </div>
  );
};

export default AlloInteraction;
