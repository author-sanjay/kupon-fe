import React, { useState } from "react";
import SingleNft from "./SingleNft"; // Ensure this is the correct path for your NFT component
import { useNft } from "../Context/Web3Context";
import { enqueueSnackbar } from "notistack";
import { Hourglass } from "react-loader-spinner";
import { useAuth } from "../Context/AuthContext";

interface AddCouponModalProps {
  onClose: () => void;
}

interface CouponData {
  storeName: string;
  discount: number;
  couponCode: string;
  expiration: string;
  price: string; // Price in ETH
  nftUrl: string; // URL for the NFT image
}

const AddCouponModal: React.FC<AddCouponModalProps> = ({ onClose }) => {
  const { publishCoupon, getAllCouponsForOwner } = useNft();
  const { handleUserContracts, user, handlePostNFT } = useAuth();
  const [storeName, setStoreName] = useState("");
  const [discount, setDiscount] = useState(0);
  const [expiration, setExpiration] = useState("");
  const [price, setPrice] = useState("");
  const [nftUrl, setNftUrl] = useState(
    "https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg"
  );
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const couponData: CouponData = {
      storeName,
      discount,
      couponCode,
      expiration,
      price,
      nftUrl,
    };
    setLoading(true);
    publishCoupon(couponData)
      .then((success: any) => {
        const blockHash = `${success.blockHash}`;
        getAllCouponsForOwner(user.walletAddress).then((coupon) => {
          handleUserContracts(coupon);
        });
        handlePostNFT({
          title: storeName + " - " + user.id,
          discount: discount,
          platform: storeName,
          description: couponCode,
          photoUrl: nftUrl,
          expiry: expiration,
          isUsed: false,
          createdBy: user.id,
          nftAddress: blockHash,
        })
          .then(() => {
            enqueueSnackbar("Successfully Minted Coupon", {
              preventDuplicate: true,
              variant: "success",
              autoHideDuration: 3000,
            });
            setLoading(false);
            onClose();
          })
          .catch((e) => {
            onClose();
          });
      })
      .catch((e: any) => {
        console.log(e);
        enqueueSnackbar("Error Minted Coupon", {
          preventDuplicate: true,
          variant: "error",
          autoHideDuration: 3000,
        });
        onClose();
      });
  };

  return (
    <div className="w-full h-screen absolute top-0 right-0 z-10 bg-black bg-opacity-75 flex justify-center items-center animate-fadeIn">
      {loading ? (
        <>
          <div className="bg-[#3A3043] h-1/2 text-white p-8 rounded-lg shadow-lg w-1/2 animate-slideIn flex flex-col items-center justify-center">
            <span className="font-thin text-2xl">
              Please wait we are minting your Coupon
            </span>

            <div className="mt-10">
              <Hourglass
                visible={true}
                height="80"
                width="80"
                ariaLabel="hourglass-loading"
                wrapperStyle={{}}
                wrapperClass=""
                colors={["#ffffff", "#ffffff"]}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="bg-[#3A3043] text-white p-8 rounded-lg shadow-lg w-1/2 animate-slideIn">
          <h2 className="text-2xl font-semibold mb-4">Add New Coupon</h2>
          <div className="">
            <div className="flex flex-row w-full justify-between">
              <div className="w-1/2  ">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col justify-between"
                >
                  <div className="mb-4">
                    <label
                      className="block text-white text-sm font-light mb-2"
                      htmlFor="storeName"
                    >
                      Store Name
                    </label>
                    <input
                      type="text"
                      id="storeName"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Enter store name"
                      required
                    />
                  </div>

                  {/* Discount Percentage Input */}
                  <div className="mb-4">
                    <label
                      className="block text-white text-sm font-light mb-2"
                      htmlFor="discount"
                    >
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      id="discount"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Enter discount percentage (0-100)"
                      min="1"
                      max="100"
                      required
                    />
                  </div>

                  {/* Expiration Date Input */}
                  <div className="mb-4">
                    <label
                      className="block text-white text-sm font-light mb-2"
                      htmlFor="expiration"
                    >
                      Expiration Date
                    </label>
                    <input
                      type="date"
                      id="expiration"
                      value={expiration}
                      onChange={(e) => setExpiration(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-white text-sm font-light mb-2"
                      htmlFor="expiration"
                    >
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      id="couponCode"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>

                  {/* Price Input */}
                  <div className="mb-4">
                    <label
                      className="block text-white text-sm font-light mb-2"
                      htmlFor="price"
                    >
                      Price (ETH)
                    </label>
                    <input
                      type="text"
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Enter price in ETH"
                      required
                    />
                  </div>

                  {/* NFT URL Input */}
                  <div className="mb-4">
                    <label
                      className="block text-white text-sm font-light mb-2"
                      htmlFor="nftUrl"
                    >
                      NFT URL
                    </label>
                    <input
                      type="text"
                      id="nftUrl"
                      value={nftUrl}
                      onChange={(e) => setNftUrl(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Enter NFT image URL"
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Live NFT Preview</h3>

                <SingleNft
                  nft={{
                    logoUrl: nftUrl,
                    discountPercentage: discount,
                    storeName: storeName,
                    price: price,
                    expiration: expiration,
                  }}
                  owned={false}
                  preview={true}
                />
              </div>
            </div>
            <div className="flex justify-end mt-5">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-[#3A3043] border-white border-2 hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCouponModal;
