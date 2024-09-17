import {
  useContext,
  createContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
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
      transferCoupon: any;
      getAllActiveCoupons: any;
      lastAction: any;
      buyCoupon: any;
      useCoupon: any;
    }
  | undefined
>(undefined);

export const NFTContextProvider = ({ children }: { children: ReactNode }) => {
  const { user, handleUserContracts } = useAuth();
  const { contract } = useContract(
    "0x66133A51bb76dcFe36e1548315Ae352B393a1EaF"
  );
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const [etherscontract, setethersContract] = useState({});

  const wallet = useWallet();
  const address = useAddress();
  const [lastAction, setLastAction] = useState(new Date());

  useEffect(() => {
    if (!address) {
      wallet?.connect();
    }
  }, [address, wallet, user]);

  useEffect(() => {
    if (contract) {
      setethersContract(
        new ethers.Contract(
          "0x66133A51bb76dcFe36e1548315Ae352B393a1EaF",
          contract.abi,
          signer
        )
      );
    }
  }, [contract]);
  const publishCoupon = async (data: any) => {
    let availableAddres = address || user?.walletAddress;

    const expiry = new Date(data.expiration).getTime();

    // @ts-ignore
    const priceInWei = ethers.utils.parseEther(data.price);

    try {
      // @ts-ignore
      const nftData = await etherscontract.mintCoupon(
        availableAddres,
        data.storeName,
        data.couponCode,
        data.discount,
        expiry,
        priceInWei,
        data.nftUrl
      );
      setLastAction(new Date());
      return nftData.wait();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const transferCoupon = async (
    myAddress: string,
    otherUserAddress: string,
    tokenId: number
  ) => {
    try {
      if (contract) {
        const tokenIdBigInt = BigInt(tokenId);

        // @ts-ignore
        const transferResponse = await etherscontract.transferCoupon(
          myAddress,
          otherUserAddress,
          tokenIdBigInt
        );

        const receipt = transferResponse;
        setLastAction(new Date());
        return receipt.wait();
      }
    } catch (err) {
      console.error("Error transferring coupon:", err);
    }
  };

  const useCoupon = async (tokenId: number) => {
    try {
      const tokenIdBigInt = BigInt(tokenId);

      // @ts-ignore
      const useCouponResponse = await etherscontract.useCoupon(tokenIdBigInt);

      const receipt = useCouponResponse;
      setLastAction(new Date());
      return receipt.wait();
    } catch (err) {
      console.error("Error using coupon:", err);
    }
  };

  const buyCoupon = async (tokenId: number, price: number) => {
    try {
      if (!etherscontract) {
        throw new Error("Contract is not available");
      }

      const priceInString = price.toString();

      // @ts-ignore
      const priceInWei = ethers.utils.parseEther(priceInString);
      const tokenIdBigInt = BigInt(tokenId);

      // @ts-ignore
      const tx = await etherscontract.buyCoupon(tokenIdBigInt, {
        value: priceInWei,
      });
      const receipt = await tx.wait();
      setLastAction(new Date());
      return receipt;
    } catch (err) {
      console.error("Error buying coupon:", err);
      throw err;
    }
  };

  const getAllCoupons = async () => {
    // @ts-ignore
    const coupons = await contract?.call("getAllCoupons");
  };

  function convertCouponDataArray(couponDataArray?: []) {
    // @ts-ignore
    const newData = couponDataArray.map((couponData) => ({
      // @ts-ignore
      tokenId: hexToDecimal(couponData.tokenId._hex),

      // @ts-ignore
      couponCode: couponData.coupon.couponCode,
      discountPercentage: hexToDecimal(
        // @ts-ignore
        couponData.coupon.discountPercentage._hex
      ),
      expiration: unixToDateString(
        // @ts-ignore
        hexToDecimal(couponData.coupon.expiration._hex)
      ),

      // @ts-ignore
      isUsed: couponData.coupon.isUsed,

      // @ts-ignore
      logoUrl: couponData.coupon.logoUrl,

      // @ts-ignore
      marketable: couponData.coupon.marketable,

      // @ts-ignore
      price: weiToEth(hexToDecimal(couponData.coupon.price._hex)),

      // @ts-ignore
      storeName: couponData.coupon.storeName,
    }));
    return newData;
  }
  const getAllCouponsForOwner = async (owner?: string) => {
    try {
      // @ts-ignore
      if (!ethers.utils.isAddress(owner)) {
        console.log(owner);
        throw new Error("Invalid Ethereum address.");
      }

      if (!contract) {
        throw new Error("Contract is not defined.");
      }
      // @ts-ignore
      const coupons = await contract.call("getAllCouponsForOwner", [owner]);
      return convertCouponDataArray(coupons);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const hexToDecimal = (hex: any) => parseInt(hex, 16);

  const unixToDateString = (timestamp: any) =>
    new Date(timestamp).toISOString();

  const weiToEth = (wei: any) => wei / 1e18;

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        // @ts-ignore
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const web3Signer = web3Provider.getSigner();
      } else {
        console.error("MetaMask is not installed");
      }
    };

    initializeWeb3();
  }, []);

  useEffect(() => {
    if (contract) {
      getAllCoupons();
      getAllCouponsForOwner(user?.walletAddress).then((coupon) => {
        console.log(coupon);
        if (coupon) {
          // @ts-ignore
          handleUserContracts(coupon);
        }
      });
    }
  }, [contract]);

  const getAllActiveCoupons = async () => {
    try {
      if (!contract) {
        throw new Error("Contract is not defined.");
      }
      // @ts-ignore
      const coupons = await contract.call("getAllActiveCoupons");
      return convertCouponDataArray(coupons);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <NFTContext.Provider
      value={{
        address,
        publishCoupon,
        getAllCouponsForOwner,
        transferCoupon,
        getAllActiveCoupons,
        lastAction,
        buyCoupon,
        useCoupon,
      }}
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
