import moment from "moment";
import React, { useState } from "react";
import { useNft } from "../Context/Web3Context";

import TransferCoupon from "./TrandferCoupon";
import { enqueueSnackbar } from "notistack";
interface SingleNftProps {
  nft: any;
  preview: boolean;
  owned: boolean;
  setLoading: any;
}
const SingleNft: React.FC<SingleNftProps> = ({
  nft,
  preview,
  owned,
  setLoading,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { buyCoupon, useCoupon } = useNft();
  const [front, setFront] = useState(true);

  const handlePurchase = () => {
    setLoading(true);
    console.log(nft);
    buyCoupon(nft.tokenId, nft.price)
      .then((data) => {
        setLoading(false);
        enqueueSnackbar("SuccessFully Bought NFT.", {
          preventDuplicate: true,
          variant: "success",
          autoHideDuration: 3000,
        });
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Error Buying NFT. Please Check your wallet is connected to this site",
          { preventDuplicate: true, variant: "error", autoHideDuration: 3000 }
        );
      });
  };

  const handleCardFlip = () => {
    setLoading(true);
    useCoupon(nft.tokenId)
      .then((response) => {
        setLoading(false);
        enqueueSnackbar("SuccessFully Found Coupon Code.", {
          preventDuplicate: true,
          variant: "success",
          autoHideDuration: 3000,
        });
      })
      .catch((e) => {
        setLoading(false);
        enqueueSnackbar(
          "Error Revealing Coupon. Please Check your wallet is connected to this site",
          { preventDuplicate: true, variant: "error", autoHideDuration: 3000 }
        );
      });
  };
  return (
    <>
      <div className="flex h-fit justify-center items-center">
        {front ? (
          <div className="relative h-[45vh] w-[20vw] group bg-gradient-to-br from-[#1F1C2C] to-[#453c6f] border-4 p-1 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500">
            <div className="relative  rounded-xl p-6 space-y-6 max-w-xs transition-transform transform hover:-translate-y-3 duration-300 ease-in-out">
              {owned && nft.isUsed ? (
                <div className="absolute top-6 z-10 right-2 bg-orange-400 w-fit px-3 py-2 rounded-lg">
                  Used
                </div>
              ) : owned && nft.marketable ? (
                <div className="absolute top-6 right-2 z-10 bg-orange-400 w-fit px-3 py-2 rounded-lg">
                  Listed
                </div>
              ) : owned ? (
                <div className="absolute top-6 right-2 z-10 bg-orange-400 w-fit px-3 py-2 rounded-lg">
                  Owned
                </div>
              ) : (
                <></>
              )}
              <div className="overflow-hidden rounded-xl">
                <img
                  src={preview && !nft.logoUrl ? nft.logoUrl : nft.logoUrl}
                  className="object-cover w-full h-48 rounded-lg transition-transform duration-500 transform group-hover:scale-105"
                />
              </div>

              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {preview && !nft.storeName ? "Store Name" : nft.storeName}
                </h2>
                <p className="text-gray-400 text-sm">
                  {preview && !nft.discountPercentage
                    ? "Coupon Discount"
                    : nft.discountPercentage + "% Off"}
                </p>

                <p className="text-gray-400 text-sm">
                  {preview && !nft.expiration
                    ? "Expires on: YYYY-MM-DD"
                    : `Expires on: ${moment(nft.expiration).format(
                        "MMM Do YYYY"
                      )}`}
                </p>
              </div>

              {/* Price Section */}
              <div className="flex justify-between items-center">
                {owned && !nft.isUsed ? (
                  <span
                    onClick={handleCardFlip}
                    className="text-xl font-semibold text-[#FBCB0A]"
                  >
                    Use Coupon
                  </span>
                ) : owned && nft.isUsed ? (
                  <span
                    onClick={() => {
                      setFront(false);
                    }}
                    className="text-xl font-semibold text-[#FBCB0A]"
                  >
                    Reveal Code
                  </span>
                ) : (
                  <span className="text-xl font-semibold text-[#FBCB0A]">
                    {preview && !nft.price ? "Sell At" : nft.price} ETH
                  </span>
                )}
                {owned && !nft.isUsed ? (
                  <button
                    onClick={() => {
                      setShowModal(true);
                    }}
                    className="px-4 py-2 ml-3 bg-[#3A3043] text-white rounded-lg hover:bg-[#5C5470] transition-all duration-300"
                  >
                    Gift Coupon
                  </button>
                ) : preview ? (
                  <button className="px-4 py-2 bg-[#3A3043] text-white rounded-lg hover:bg-[#5C5470] transition-all duration-300">
                    Buy Now
                  </button>
                ) : (
                  <button
                    onClick={handlePurchase}
                    className="px-4 py-2 bg-[#3A3043] text-white rounded-lg hover:bg-[#5C5470] transition-all duration-300"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="relative group h-[45vh] flex text-white items-center justify-center  w-[20vw] bg-gradient-to-br from-[#1F1C2C] to-[#453c6f] border-4 p-1 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500">
              <span className="text-2xl">{nft.couponCode}</span>
              <span
                className="absolute bottom-10 bg-orange-500 px-5 py-2 rounded-md cursor-pointer"
                onClick={() => {
                  setFront(true);
                }}
              >
                Close
              </span>
            </div>
          </>
        )}
      </div>
      {showModal ? (
        <TransferCoupon
          tokenId={nft.tokenId}
          onClose={() => {
            setShowModal(false);
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default SingleNft;
