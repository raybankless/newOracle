import React from "react";
import AlloInteraction from "../components/AlloInteraction";
import Sidebar from "../components/Sidebar";
import styles from "../styles/Dashboard.module.css";

const AlloPage: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <h1>Allo Interaction</h1>
        <AlloInteraction />
      </main>
    </div>
  );
};

export default AlloPage;
