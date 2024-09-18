import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
interface HeaderProps {
  sell: boolean;
  setSell: React.Dispatch<React.SetStateAction<boolean>>;
  isWalletConnected: boolean;
  setIsWalletConnected: React.Dispatch<React.SetStateAction<boolean>>;
  marketPlace: boolean;
  setMarketPlace: React.Dispatch<React.SetStateAction<boolean>>;
}
const Header: React.FC<HeaderProps> = ({
  sell,
  setSell,
  isWalletConnected,
  setIsWalletConnected,
  marketPlace,
  setMarketPlace,
}) => {
  const { user, handleWalletUpdate } = useAuth();
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          const postWallet = {
            userId: user?.id,
            walletAddress: accounts[0],
          };

          axios
            .patch(
              "https://kupon-f86c.onrender.com/user/addWallet",
              postWallet,
              {
                headers: {
                  Authorization: `Bearer ${user?.authToken}`,
                },
              }
            )
            .then((response) => {
              handleWalletUpdate(response.data.walletAddress);
              setIsWalletConnected(true);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      } else {
        alert("Please install MetaMask to connect your wallet.");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };
  return (
    <div className="w-full flex h-full flex-row justify-between items-center select-none  ">
      <div className="left  h-full flex items-center justify-start w-2/5">
        <span className="text-2xl px-10">KuPon</span>
      </div>
      <div className="w-1/5 h-3/4 flex gap-5 items-center justify-center mt-1 mb-1 bg-[#CCBED0] rounded-3xl">
        {marketPlace ? (
          <>
            <span
              className={`px-14 sm:px-10 transition-all duration-75 py-3 rounded-3xl ${
                sell ? "bg-[#3A3043]" : "bg-[#CCBED0]"
              } bg-[#3A3043] cursor-pointer ${
                sell ? "text-white" : "text-black"
              }`}
              onClick={() => {
                setMarketPlace(false);
              }}
            >
              Home
            </span>
            <span
              className={`px-14 py-3 sm:px-10 cursor-pointer rounded-3xl duration-75 transition-all ${
                !sell ? "bg-[#3A3043]" : "bg-[#CCBED0]"
              } ${!sell ? "text-white" : "text-black"}`}
              onClick={() => {
                setMarketPlace(true);
              }}
            >
              MaketPlace
            </span>
          </>
        ) : (
          <>
            <span
              className={`px-14 sm:px-10 transition-all duration-75 py-3 rounded-3xl ${
                sell ? "bg-[#3A3043]" : "bg-[#CCBED0]"
              } bg-[#3A3043] cursor-pointer ${
                sell ? "text-white" : "text-black"
              }`}
              onClick={() => {
                setSell(true);
              }}
            >
              Sell
            </span>
            <span
              className={`px-14 py-3 sm:px-10 cursor-pointer rounded-3xl duration-75 transition-all ${
                !sell ? "bg-[#3A3043]" : "bg-[#CCBED0]"
              } ${!sell ? "text-white" : "text-black"}`}
              onClick={() => {
                setSell(false);
              }}
            >
              Buy
            </span>
          </>
        )}
      </div>
      <div className="w-2/5 h-full px-10 flex items-center justify-end">
        {isWalletConnected ? (
          <>
            <span
              onClick={connectWallet}
              className="bg-[#CCBED0] text-[#3A3043] hover:text-white px-10 py-3 rounded-lg hover:bg-[#3A3043] hover:border-2 hover:cursor-pointer "
            >
              Connected Wallet : {user?.walletAddress?.substring(0, 10)}...
            </span>
          </>
        ) : (
          <>
            <span
              onClick={connectWallet}
              className="bg-[#CCBED0] text-[#3A3043] hover:text-white px-10 py-3 rounded-lg hover:bg-[#3A3043] hover:border-2 hover:cursor-pointer "
            >
              Connect Wallet
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
