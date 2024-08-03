// pages/allo.tsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import AlloContractInteraction from "../components/AlloContractInteraction";
import CreateProgramForm from "../components/CreateProgramForm";
import styles from "../styles/Dashboard.module.css";

const AlloPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"interaction" | "createProgram">(
    "interaction",
  );

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <h1>Allo</h1>
        <div className={styles.navigation}>
          <button
            className={`${styles.navButton} ${activeTab === "interaction" ? styles.active : ""}`}
            onClick={() => setActiveTab("interaction")}
          >
            Contract Interaction
          </button>
          <button
            className={`${styles.navButton} ${activeTab === "createProgram" ? styles.active : ""}`}
            onClick={() => setActiveTab("createProgram")}
          >
            Create Program
          </button>
        </div>
        {activeTab === "interaction" && <AlloContractInteraction />}
        {activeTab === "createProgram" && <CreateProgramForm />}
      </main>
    </div>
  );
};

export default AlloPage;
