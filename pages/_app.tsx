import type { AppProps } from "next/app";
import { ThirdwebProvider, embeddedWallet, smartWallet, localWallet } from "@thirdweb-dev/react";
import {Optimism} from "@thirdweb-dev/chains";
import "../styles/globals.css";

const activeChain = Optimism;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={'22f2a1f2653b1f091455a59951c2ecca'}
      activeChain={activeChain}
      supportedWallets={[embeddedWallet()]}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
