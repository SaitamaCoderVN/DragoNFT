'use client'

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import { http, WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { trustWallet, ledgerWallet } from "@rainbow-me/rainbowkit/wallets";

const { wallets } = getDefaultWallets();

// Define the Unique chain
const uniqueChain = {
  id: 8880, // Sửa thành 8880 hoặc "0x22b0"
  name: "Unique",
  network: "unique",
  nativeCurrency: {
    name: "Unique",
    symbol: "UNQ",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.unique.network"],
      websocket: ["wss://ws.unique.network"],
    },
    public: {
      http: ["https://rpc.unique.network"],
      websocket: ["wss://ws.unique.network"],
    },
  },
  blockExplorers: {
    default: { name: "UniqueScan", url: "https://unique.subscan.io/" },
  },
  testnet: false,
};

// Define the Unique chain
const quartzMainnet = {
  id: 8881, // Sửa thành 8880 hoặc "0x22b0"
  name: "Quartz",
  network: "quartz",
  nativeCurrency: {
    name: "Quartz",
    symbol: "QTZ",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-quartz.unique.network"],
      websocket: ["wss://ws-quartz.unique.network"],
    },
    public: {
      http: ["https://rpc-quartz.unique.network"],
      websocket: ["wss://ws-quartz.unique.network"],
    },
  },
  blockExplorers: {
    default: { name: "Quartz", url: "https://quartz.subscan.io/" },
  },
  testnet: false,
};

// Define the Unique chain
const opalTestnet = {
  id: 8882, // Sửa thành 8880 hoặc "0x22b0"
  name: "Opal",
  network: "opal",
  nativeCurrency: {
    name: "Opal",
    symbol: "OPL",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-opal.unique.network"],
      websocket: ["wss://ws-opal.unique.network"],
    },
    public: {
      http: ["https://rpc-opal.unique.network"],
      websocket: ["wss://ws-opal.unique.network"],
    },
  },
  blockExplorers: {
    default: { name: "Opal", url: "https://opal.subscan.io/" },
  },
  testnet: true,
};

const queryClient = new QueryClient();
const config = getDefaultConfig({
  appName: 'Soulbound Community',
  projectId: 'kaitojoitd',
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [trustWallet, ledgerWallet],
    },
  ],
  chains: [uniqueChain, quartzMainnet, opalTestnet],
  transports: {
    [8880]: http("https://rpc.unique.network"),
    [8881]: http("https://rpc-quartz.unique.network"),
    [8882]: http("https://rpc-opal.unique.network"),
  },
  ssr: true, // If your dApp uses server side rendering (SSR)
});
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Provider store={store}>{children}</Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
