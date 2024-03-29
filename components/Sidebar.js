import React from 'react';
import Link from 'next/link';
import styles from '../styles/Sidebar.module.css';
import { ConnectWallet } from "@thirdweb-dev/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTasks, faUsers, faUser, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();

  const isActive = (path) => {
    return router.pathname === path ? styles.active : "";
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.gradientText}>GoodOracle</span>
      </div>
      <nav className={styles.nav}>
        <Link href="/events" className={`${styles.navItem} ${isActive('/events')}`}>
          <FontAwesomeIcon icon={faCalendarDays} /> Events
        </Link>
        <Link href="/" className={`${styles.navItem} ${isActive('/task-boards')}`}>
          <FontAwesomeIcon icon={faTasks} /> Task Boards
        </Link>
        <Link href="/" className={`${styles.navItem} ${isActive('/communities')}`}>
          <FontAwesomeIcon icon={faUsers} /> Communities
        </Link>
        <Link href="/" className={`${styles.navItem} ${isActive('/profile')}`}>
          <FontAwesomeIcon icon={faUser} /> Profile
        </Link>
      </nav>
      <ConnectWallet />
    </aside>
  );
};

export default Sidebar;
