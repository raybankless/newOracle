import { useState } from 'react';
import { useEmbeddedWallet } from '@thirdweb-dev/react';
import styles from '../styles/LoginModal.module.css'; // Assume you have CSS for modal

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const { connect, sendVerificationEmail } = useEmbeddedWallet();

  const handleSignInWithGoogle = async () => {
    await connect({ strategy: "google" });
    onClose(); // Close the modal after successful login
  };

  const handleSendVerificationEmail = async () => {
    if (!email) return alert('Please enter an email.');
    await sendVerificationEmail({ email });
    // Move to verification code step
  };

  const handleVerifyEmail = async () => {
    if (!email || !verificationCode) return alert('Please enter the verification code.');
    await connect({ strategy: "email_verification", email, verificationCode });
    onClose(); // Close the modal after successful verification
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeButton}>&times;</button>
        <div className={styles.loginOptions}>
          <button onClick={handleSignInWithGoogle} className={styles.loginButton}>Sign in with Google</button>
          <div>
            <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <button onClick={handleSendVerificationEmail} className={styles.loginButton}>Send Verification Email</button>
          </div>
          <div>
            <input type="text" placeholder="Verification Code" value={verificationCode} onChange={e => setVerificationCode(e.target.value)} />
            <button onClick={handleVerifyEmail} className={styles.loginButton}>Verify Email</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
