import React, { useState, useEffect } from "react";
import { useContract, useMetamask } from "@thirdweb-dev/react";
import { Button, Input, Text } from "@mantine/core";

// Your contract address
const contractAddress = "0x1ACCF3b22742343Ff38d5ccc2ac70718FBAcBC8d";

const App = () => {
  const { connect, isConnected } = useMetamask();
  const { contract } = useContract(contractAddress, "erc721");
  const [coupons, setCoupons] = useState<any[]>([]);
  const [storeName, setStoreName] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [expiration, setExpiration] = useState<number>(0);

  const fetchCoupons = async () => {
    if (contract) {
      try {
        const allCoupons = await contract.call("getAllActiveCoupons");
        setCoupons(allCoupons);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    }
  };
  useEffect(() => {
    fetchCoupons();
  }, [contract]);

  const mintCoupon = async () => {
    if (!contract) return;

    try {
      const tx = await contract.call("mintCoupon", [
        storeName,
        discountPercentage,
        expiration,
      ]);
      await tx.wait();
      alert("Coupon minted!");
      await fetchCoupons();
    } catch (error) {
      console.error("Error minting coupon:", error);
    }
  };

  const useCoupon = async (tokenId: number) => {
    if (!contract) return;

    try {
      const tx = await contract.call("useCoupon", [tokenId]);
      await tx.wait();
      alert("Coupon used!");
      await fetchCoupons();
    } catch (error) {
      console.error("Error using coupon:", error);
    }
  };

  return (
    <div>
      {!isConnected ? (
        <Button onClick={() => connect()}>Connect with MetaMask</Button>
      ) : (
        <>
          <Text size="xl" weight={700}>
            Coupon Management
          </Text>
          <Input
            placeholder="Store Name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
          <Input
            placeholder="Discount Percentage"
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
          />
          <Input
            placeholder="Expiration (timestamp)"
            type="number"
            value={expiration}
            onChange={(e) => setExpiration(Number(e.target.value))}
          />
          <Button onClick={mintCoupon}>Mint Coupon</Button>

          <Text size="lg" weight={500} mt="md">
            Active Coupons:
          </Text>
          <ul>
            {coupons.map((coupon: any) => (
              <li key={coupon.tokenId.toString()}>
                <Text>{`Store: ${coupon.storeName}, Discount: ${coupon.discountPercentage}%`}</Text>
                <Button onClick={() => useCoupon(coupon.tokenId.toNumber())}>
                  Use Coupon
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
