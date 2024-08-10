import React from "react";
import Link from "next/link";
import styles from "../styles/Sidebar.module.css";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTasks,
  faUsers,
  faUser,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const Sidebar = () => {
  const router = useRouter();
  const address = useAddress();
  const connected = !!address;

  const isActive = (path) => {
    return router.pathname === path ? styles.active : "";
  };

  return (
    <aside className={styles.sidebar}>
      <Link href="/">
        <div className={styles.logo}>
          <span className={styles.gradientText}>ImpactOracle</span>
        </div>
      </Link>
      <nav className={styles.nav}>
        <div className={styles.iconsContainer}>
          <FontAwesomeIcon icon={faCalendarDays} className={styles.faIcons} />
          <FontAwesomeIcon icon={faTasks} className={styles.faIcons} />
          <FontAwesomeIcon icon={faUsers} className={styles.faIcons} />
          <FontAwesomeIcon icon={faUser} className={styles.faIcons} />
        </div>
        <div className={styles.linksContainer}>
          <Link href="/" className={`${styles.navItem} ${isActive("/events")}`}>
            Events
          </Link>
          <Link
            href="/task-boards"
            className={`${styles.navItem} ${isActive("/task-boards")}`}
          >
            Task Boards
          </Link>
          <Link
            href="/communities"
            className={`${styles.navItem} ${isActive("/communities")}`}
          >
            Communities
          </Link>
          <Link
            href="/allo"
            className={`${styles.navItem} ${isActive("/allo")}`}
          >
            Allo
          </Link>
        </div>
      </nav>

      <div className={styles.connectWalletContainer}>
        {connected && <ConnectWallet />}
      </div>
    </aside>
  );
};

export default Sidebar;
