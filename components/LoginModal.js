import { ConnectEmbed} from 'thirdweb/react';
import styles from '../styles/LoginModal.module.css'; // Assume you have CSS for modal


const LoginModal = () => {

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modal}>
        <ConnectEmbed />
        </div>
      </div>
  );
};

export default LoginModal;
