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

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const [etherscontract, setethersContract] = useState({});

  const { mutateAsync: mintCoupon } = useContractWrite(contract, "mintCoupon");
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
      console.log(signer, "signer");
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
    console.log("Contract:", contract);
    let availableAddres = address || user.walletAddress;

    const expiry = new Date(data.expiration).getTime();
    const priceInWei = ethers.utils.parseEther(data.price);

    try {
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
        console.log(contract.abi);
        const tokenIdBigInt = BigInt(tokenId);
        const transferResponse = await etherscontract.transferCouponWrite(
          myAddress,
          otherUserAddress,
          tokenIdBigInt
        );

        console.log(transferResponse);
        const receipt = transferResponse;
        console.log("Transfer successful:", receipt);
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
      const useCouponResponse = await etherscontract.useCoupon(tokenIdBigInt);

      console.log(useCouponResponse);
      const receipt = useCouponResponse;
      setLastAction(new Date());
      console.log("Coupon used successfully:", receipt);
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
      const priceInWei = ethers.utils.parseEther(priceInString);
      const tokenIdBigInt = BigInt(tokenId);
      const tx = await etherscontract.buyCoupon(tokenIdBigInt, {
        value: priceInWei,
      });
      console.log("Transaction sent:", tx);
      const receipt = await tx.wait();
      console.log("Transaction successful:", receipt);
      setLastAction(new Date());
      return receipt;
    } catch (err) {
      console.error("Error buying coupon:", err);
      throw err;
    }
  };

  const getAllCoupons = async () => {
    const coupons = await contract?.call("getAllCoupons");
    console.log(coupons, "coupons");
  };

  function convertCouponDataArray(couponDataArray) {
    const newData = couponDataArray.map((couponData) => ({
      tokenId: hexToDecimal(couponData.tokenId._hex),
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
    console.log(contract?.abi);
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
