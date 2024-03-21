import type { AppProps } from "next/app";
import { ThirdwebProvider, embeddedWallet, smartWallet, localWallet } from "@thirdweb-dev/react";
import {Optimism} from "@thirdweb-dev/chains";
import "../styles/globals.css";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
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
