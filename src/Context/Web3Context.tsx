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
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const { contract } = useContract(
    "0x66133A51bb76dcFe36e1548315Ae352B393a1EaF"
  );

  const { mutateAsync: mintCoupon } = useContractWrite(contract, "mintCoupon");
  const wallet = useWallet();
  const address = useAddress();
  const [lastAction, setLastAction] = useState(new Date());

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
          data.nftUrl,
        ],
      });
      setLastAction(new Date());
      return nftData;
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const { mutateAsync: transferCouponWrite } = useContractWrite(
    contract,
    "transferCoupon"
  );

  const transferCoupon = async (
    myAddress: string,
    otherUserAddress: string,
    tokenId: number
  ) => {
    try {
      if (contract) {
        const tokenIdBigInt = BigInt(tokenId);
        const transferResponse = await transferCouponWrite({
          args: [myAddress, otherUserAddress, tokenIdBigInt],
        });

        console.log(transferResponse);
        const receipt = transferResponse;
        console.log("Transfer successful:", receipt);
        setLastAction(new Date());
        return receipt;
      }
    } catch (err) {
      console.error("Error transferring coupon:", err);
    }
  };
  const { mutateAsync: useCouponWrite } = useContractWrite(
    contract,
    "useCoupon"
  );

  const useCoupon = async (tokenId: number) => {
    // Assume `contract` is your smart contract instance

    try {
      if (contract) {
        const tokenIdBigInt = BigInt(tokenId);
        const useCouponResponse = await useCouponWrite({
          args: [tokenIdBigInt],
        });

        console.log(useCouponResponse);
        const receipt = useCouponResponse;
        setLastAction(new Date());
        console.log("Coupon used successfully:", receipt);
        return receipt;
      }
    } catch (err) {
      console.error("Error using coupon:", err);
    }
  };
  const { mutateAsync: buyCouponWrite } = useContractWrite(
    contract,
    "buyCoupon"
  );

  const buyCoupon = async (tokenId: number, price: number) => {
    try {
      if (contract) {
        const tokenIdBigInt = BigInt(tokenId);

        // Call the contract function with tokenId and required Ether value
        const buyResponse = await buyCouponWrite({
          args: [tokenIdBigInt], // Pass the tokenId as an argument
          overrides: {
            value: ethers.utils.parseEther(price.toString()), // Replace with logic to fetch the price from the contract if needed
          },
        });

        console.log("Transaction sent:", buyResponse);

        // Wait for transaction confirmation
        const receipt = buyResponse;
        console.log("Transaction successful:", receipt);

        // Set the last action timestamp (if needed)
        setLastAction(new Date());

        return receipt;
      } else {
        console.error("Contract is not available");
      }
    } catch (err) {
      throw err;
    }
  };

  const getAllCoupons = async () => {
    const coupons = await contract?.call("getAllCoupons");
    console.log(coupons, "coupons");
  };

  function convertCouponDataArray(couponDataArray) {
    const newData = couponDataArray.map((couponData) => ({
      tokenId: hexToDecimal(couponData.tokenId._hex), // Convert tokenId from BigNumber to decimal
      couponCode: couponData.coupon.couponCode,
      discountPercentage: hexToDecimal(
        couponData.coupon.discountPercentage._hex
      ),
      expiration: unixToDateString(
        hexToDecimal(couponData.coupon.expiration._hex)
      ),
      isUsed: couponData.coupon.isUsed,
      logoUrl: couponData.coupon.logoUrl,
      marketable: couponData.coupon.marketable,
      price: weiToEth(hexToDecimal(couponData.coupon.price._hex)),
      storeName: couponData.coupon.storeName,
    }));
    console.log(newData);
    return newData;
  }
  const getAllCouponsForOwner = async (owner: string) => {
    try {
      if (!contract) {
        throw new Error("Contract is not defined.");
      }
      const coupons = await contract.call("getAllCouponsForOwner", [owner]);
      console.log(coupons);
      return convertCouponDataArray(coupons);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const hexToDecimal = (hex) => parseInt(hex, 16);

  const unixToDateString = (timestamp) => new Date(timestamp).toISOString();

  const weiToEth = (wei) => wei / 1e18;

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const web3Signer = web3Provider.getSigner();

        setProvider(web3Provider);
        setSigner(web3Signer);
      } else {
        console.error("MetaMask is not installed");
      }
    };

    initializeWeb3();
  }, []);

  useEffect(() => {
    console.log(contract);
    getAllCoupons();
    getAllCouponsForOwner(address).then((coupon) => {
      handleUserContracts(coupon);
    });
  }, [contract]);

  const getAllActiveCoupons = async () => {
    try {
      if (!contract) {
        throw new Error("Contract is not defined.");
      }
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
