import { useContext, createContext, ReactNode, useEffect } from "react";
import {
  useAddress,
  useContract,
  useContractWrite,
  useWallet,
} from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Contract } from "ethers";

interface CouponData {
  storeName: string;
  discount: number;
  expiration: string | number | Date;
}

const NFTContext = createContext<
  | {
      address: string | undefined;
      publishCoupon: (data: CouponData) => Promise<void>;
    }
  | undefined
>(undefined);

export const NFTContextProvider = ({ children }: { children: ReactNode }) => {
  const { contract } = useContract(
    "0xf3B5ceF2A8D8B03027D58bc6bd0362388c8310C9"
  );

  const { mutateAsync: mintCoupon } = useContractWrite(contract, "mintCoupon");
  const wallet = useWallet();
  const address = useAddress();

  useEffect(() => {
    if (!address) {
      wallet?.connect();
    }
  }, [address, wallet]);

  const publishCoupon = async (data: CouponData) => {
    console.log("Contract:", contract); // Ensure contract is not undefined

    if (!address) {
      throw new Error("No address found. Please connect your wallet.");
    }

    const expiry = new Date(data.expiration).getTime();

    try {
      // Ensure mintCoupon is defined
      if (!mintCoupon) {
        throw new Error("mintCoupon function is not defined.");
      }

      // Call mintCoupon method
      const nftData = await mintCoupon({
        args: [address, data.storeName, data.discount, expiry],
      });

      console.log("NFT Data:", nftData);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const getAllCoupons = async () => {
    const coupons = await contract?.call("getAllCoupons");
    console.log(coupons, "coupons");
  };

  useEffect(() => {
    getAllCoupons();
  }, [contract]);

  return (
    <NFTContext.Provider value={{ address, publishCoupon }}>
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
