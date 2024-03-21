import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useAddress, useConnectionStatus, useDisconnect, useWallet, embeddedWallet, ConnectEmbed, ConnectWallet } from '@thirdweb-dev/react';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const router = useRouter(); // Get the router object
  const address = useAddress(); // Get the connected wallet address
  const connectedWallet = useWallet("embeddedWallet");
  const [email, setEmail] = useState<string | undefined>();
  const connectionStatus = useConnectionStatus();
  const disconnect = useDisconnect();

  useEffect(() => {
    if (connectedWallet) {
      connectedWallet?.getEmail().then((email) => setEmail(email));
    }
  }, [connectedWallet]);

  useEffect(() => {
    if (address && email) {
      router.push({
        pathname: '/dashboard',
        query: { email, address }, // Passing the email and address in the query parameters
      });
    }
  }, [address, email, router]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.column}>
            <h1 className={styles.title}>
              Welcome to{" "}
              <span className={styles.gradientText0}>
                  GoodOracle.
              </span>
            </h1>
            {address ? (
              <>
                <ConnectWallet />
              </>
            ) : (
              <>
                {connectionStatus == "disconnected" ? (
                  <>
                    <ConnectEmbed />
                  </>
                ) : (
                  <div className={styles.spinner} />
                )}
              </>
            )}
          </div>
        </div>
        <div className={styles.grid}></div>
      </div>
    </main>
  );
};

export default Home;
