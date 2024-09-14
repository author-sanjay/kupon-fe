import React from "react";
import { createRoot } from "react-dom/client";
import { ThirdwebProvider, useWallet } from "@thirdweb-dev/react";
import { NFTContextProvider } from "./Context/Web3Context";

import "./index.css";
import Login from "./Login/Login2";

// Define the chain for the test network (e.g., Sepolia)
const activeChain = {
  chainId: 11155111, // Chain ID for Sepolia
  chainName: "Sepolia Testnet",
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.sepolia.org"],
  blockExplorerUrls: ["https://sepolia.etherscan.io"],
};

// Initialize Thirdweb provider with correct network configuration
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThirdwebProvider activeChain={11155111}>
      <NFTContextProvider>
        <Login />
      </NFTContextProvider>
    </ThirdwebProvider>
  </React.StrictMode>
);
