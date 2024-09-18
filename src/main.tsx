import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ThirdwebProvider, useWallet } from "@thirdweb-dev/react";
import { NFTContextProvider } from "./Context/Web3Context";

import "./index.css";
import Login from "./Login/Login2";
import { SnackbarProvider } from "notistack";
import { AuthContextProvider } from "./Context/AuthContext";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import { ethers } from "ethers";

const activeChain = {
  chainId: 11155111,
  chainName: "Sepolia Testnet",
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.sepolia.org"],
  blockExplorerUrls: ["https://sepolia.etherscan.io"],
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThirdwebProvider activeChain={11155111}>
      <MantineProvider>
        <AuthContextProvider>
          <NFTContextProvider>
            <SnackbarProvider>
              <App />
            </SnackbarProvider>
          </NFTContextProvider>
        </AuthContextProvider>
      </MantineProvider>
    </ThirdwebProvider>
  </React.StrictMode>
);
