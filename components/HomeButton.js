// components/HomeButton.js
import Link from 'next/link';
import styles from '../styles/HomeButton.module.css'; // Assume you have this CSS file for styling

const HomeButton = () => {
  return (
    <div className={styles.homeButtonContainer}>
      <Link className={styles.homeButton} href="/"> Home </Link>
    </div>
  );
};

export default HomeButton;
