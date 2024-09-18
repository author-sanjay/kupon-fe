import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";

interface User {
  authToken?: string;
  walletAddress?: string;
  id?: string;
  coupons?: [];
}

interface AuthContextProps {
  user: User | null;
  setUserAuth: (token: string) => void;
  handleWalletUpdate: (walletAddress: string) => void;
  handleUserContracts: (contracts: []) => void;
  handlePostNFT: (nftData: any) => Promise<void>;
  handleCouponTransfer: (
    nftTokenAddress?: string,
    newUserWalletAddress?: string
  ) => Promise<void>;
  handleCouponUse: (nftTokenAddress: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleSetUserAuth = (token: string) => {
    const newUser = { ...user, authToken: token };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const handleUserContracts = (coupons: []) => {
    console.log(coupons, "user getting");
    setUser({ ...user, coupons: coupons });
  };
  const handleWalletUpdate = (walletAddress: string) => {
    setUser({ ...user, walletAddress: walletAddress });
  };

  function convertToCouponDto(couponDataArray: []) {
    console.log(couponDataArray);
    return couponDataArray.map((couponData: any) => {
      const couponDto = {
        title: `${couponData.storeName} ${user?.id}`,
        discount: couponData.discountPercentage,
        platform: couponData.storeName,
        description: couponData.couponCode,
        photoUrl: couponData.logoUrl,
        expiry: new Date(couponData.expiration),
        isUsed: couponData.isUsed,
        createdBy: user?.id,
        nftAddress: couponData.tokenId.toString(),
      };

      return couponDto;
    });
  }
  const handlePostNFT = async (listofCoupons?: []) => {
    try {
      const nftData = convertToCouponDto(
        // @ts-ignore
        listofCoupons ? listofCoupons : user.coupons
      );
      const response = await axios.post(
        "https://kupon-f86c.onrender.com/coupons/addCouponsBatch",
        nftData,
        {
          headers: {
            Authorization: `Bearer ${user?.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error posting NFT:", error);
      throw error;
    }
  };

  const handleCouponTransfer = async (
    nftTokenAddress?: string,
    newUserWalletAddress?: string
  ) => {
    const transferData = {
      nftAddress: nftTokenAddress,
      newUserWalletAddress: newUserWalletAddress,
    };
    const response = await axios.patch(
      "https://kupon-f86c.onrender.com/coupons/transferCoupon",
      transferData,
      {
        headers: {
          Authorization: `Bearer ${user?.authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  };

  const handleCouponUse = async (nftTokenAddress: string) => {
    const transferData = {
      tokenId: nftTokenAddress,
    };
    const response = await axios.patch(
      "https://kupon-f86c.onrender.com/coupons/useCoupon",
      transferData,
      {
        headers: {
          Authorization: `Bearer ${user?.authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  };

  useEffect(() => {
    console.log("Running Now");

    if (user?.coupons && user.coupons.length > 0) {
      handlePostNFT();
    }
  }, [user?.coupons]);
  useEffect(() => {
    // @ts-ignore
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      try {
        axios
          .get("https://kupon-f86c.onrender.com/user/getUser", {
            headers: {
              Authorization: `Bearer ${storedUser.authToken}`,
            },
          })
          .then((userData) => {
            setUser({ ...userData.data, ...user });
          })
          .catch(() => {
            setUser(null);
            localStorage.removeItem("user");
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUserAuth: handleSetUserAuth,
        handleWalletUpdate,
        handleUserContracts,
        handlePostNFT,
        handleCouponTransfer,
        handleCouponUse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
