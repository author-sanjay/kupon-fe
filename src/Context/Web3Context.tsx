import { useContext, createContext, ReactNode, useEffect } from "react";
import {
  useAddress,
  useContract,
  useContractWrite,
  useWallet,
} from "@thirdweb-dev/react";

import { ethers } from "ethers";
import { useAuth } from "./AuthContext";

const NFTContext = createContext<
  | {
      address: string | undefined;
      publishCoupon: any;
      getAllCouponsForOwner: any;
    }
  | undefined
>(undefined);

export const NFTContextProvider = ({ children }: { children: ReactNode }) => {
  const { user, handleUserContracts } = useAuth();
  const { contract } = useContract(
    "0xbf739544918f6fD61e860541043e9e5979B83d53"
  );

  const { mutateAsync: mintCoupon } = useContractWrite(contract, "mintCoupon");
  const wallet = useWallet();
  const address = useAddress();

  useEffect(() => {
    if (!address) {
      wallet?.connect();
    }
  }, [address, wallet, user]);

  const publishCoupon = async (data: any) => {
    console.log("Contract:", contract); // Ensure contract is not undefined
    let availableAddres = address || user.walletAddress;

    const expiry = new Date(data.expiration).getTime();
    const priceInWei = ethers.utils.parseEther(data.price); // Convert price from ETH to wei

    try {
      // Use the mutateAsync function for minting
      const nftData = await mintCoupon({
        args: [
          availableAddres,
          data.storeName,
          data.couponCode,
          data.discount,
          expiry,
          priceInWei,
        ],
      });

      return nftData;
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const getAllCoupons = async () => {
    const coupons = await contract?.call("getAllCoupons");
    console.log(coupons, "coupons");
  };

  const getAllCouponsForOwner = async (owner: string) => {
    try {
      if (!contract) {
        throw new Error("Contract is not defined.");
      }
      return await contract.call("getAllCouponsForOwner", [owner]);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    console.log(contract);
    getAllCoupons();
    getAllCouponsForOwner(address).then((coupon) => {
      handleUserContracts(coupon);
    });
  }, [contract]);

  return (
    <NFTContext.Provider
      value={{ address, publishCoupon, getAllCouponsForOwner }}
    >
      {children}
    </NFTContext.Provider>
  );
};

export const useNft = () => {
  const context = useContext(NFTContext);
  if (context === undefined) {
    throw new Error("useNft must be used within a NFTContextProvider");
  }
  return context;
};
