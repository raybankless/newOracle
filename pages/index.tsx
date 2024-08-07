// index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useAddress, ConnectEmbed, lightTheme } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";


const Home: NextPage = () => {
  const router = useRouter();
  const address = useAddress();

  const customTheme = lightTheme({
    colors: {
      accentButtonBg: "green",
    },
  });
  
  useEffect(() => {
    if (address) {
      // Redirect to the dashboard if the user is already connected
      router.push("/dashboard");
    }
  }, [address, router]);

  return (
    <div className={styles.container}>
      <div className={styles.midContainer}>
      <div className={styles.leftPanel}>
        <span className={styles.gradientText0}>ImpactOracle</span>
        <span className={styles.subtitle}>Public Good NFTs & Retroactive Funding</span>
        <img className={styles.placeholderImage} src="https://placehold.co/500x300/aed6af/586558?text=ImpactOracle"></img>
      </div>
      <div className={styles.separator}></div>
      <div className={styles.rightPanel}>
        <ConnectEmbed theme={customTheme} />
      </div>
      </div>
    </div>
  );
  };

  export default Home;


