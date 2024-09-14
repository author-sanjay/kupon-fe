import { useAddress } from "@thirdweb-dev/react";
import { useNft } from "../Context/Web3Context";
import moment from "moment";
const CreateCoupon = () => {
  const { publishCoupon, address } = useNft();
  const handleMintNFt = async () => {
    const data = {
      storeName: "Amazon",
      discount: 20,
      expiration: new Date().setDate(20),
    };

    await publishCoupon(data);
  };

  return <div onClick={handleMintNFt}>mintNFT</div>;
};

export default CreateCoupon;
