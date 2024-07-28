// pages/allo.tsx
import React from "react";
import Sidebar from "../components/Sidebar";
import AlloContractInteraction from "../components/AlloContractInteraction";

const AlloPage: React.FC = () => {
  console.log("Rendering AlloPage");
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ marginLeft: "20px", flexGrow: 1 }}>
        <h1>Allo Interaction</h1>
        <AlloContractInteraction />
      </main>
    </div>
  );
};

export default AlloPage;
