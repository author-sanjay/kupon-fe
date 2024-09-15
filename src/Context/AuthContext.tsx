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
}

interface AuthContextProps {
  user: User | null;
  setUserAuth: (token: string) => void;
  handleWalletUpdate: (walletAddress: string) => void;
  handleUserContracts: (contracts: []) => void;
  handlePostNFT: (nftData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  // Initialize user state from localStorage (if it exists)
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Function to handle setting the user auth token
  const handleSetUserAuth = (token: string) => {
    const newUser = { ...user, authToken: token };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser)); // Save user to localStorage
  };

  // Clear user state on logout (optional)
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove user from localStorage
  };

  const handleUserContracts = (contract: []) => {
    if (user != null) {
      setUser({ ...user, contracts: contract });
    }
  };
  const handleWalletUpdate = (walletAddress: string) => {
    setUser({ ...user, walletAddress: walletAddress });
  };

  const handlePostNFT = async (nftData: any) => {
    try {
      const response = await axios.post(
        "http://localhost:3333/coupons/addCoupon",
        nftData,
        {
          headers: {
            Authorization: `Bearer ${user.authToken}`,
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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log(storedUser);
    if (storedUser) {
      try {
        axios
          .get("http://localhost:3333/user/getUser", {
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
        // Handle errors here
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
