// components/AlloInteraction.tsx
import { useEffect, useState } from "react";
import { Allo } from "@allo-team/allo-v2-sdk";

const AlloInteraction = () => {
  const [alloAddress, setAlloAddress] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const initAllo = async () => {
      try {
        const allo = new Allo({ chain: 10 });
        const address = allo.address;
        setAlloAddress(address);
      } catch (error) {
        console.error("Error initializing Allo:", error);
        setError("Failed to initialize Allo");
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
      {/* Add more Allo interactions here, but be careful with any data you're iterating over */}
    </div>
  );
};

export default AlloInteraction;
