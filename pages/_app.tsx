import type { AppProps } from "next/app";
import { ThirdwebProvider, embeddedWallet, smartWallet} from "@thirdweb-dev/react";
import {Optimism} from "@thirdweb-dev/chains";
import "../styles/globals.css";

const activeChain = Optimism;

const walletConfig = {
  factoryAddress : "0x20e0Bdea8a7238cd21132E1C1A7132425C6a098c",
  gasless : true,
  
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={'22f2a1f2653b1f091455a59951c2ecca'}
      activeChain={activeChain}
      supportedWallets={[smartWallet(embeddedWallet(), walletConfig)]}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );  
}

export default MyApp;


