import React from "react";
interface SingleNftProps {
  nft: any;
  preview: boolean;
}
const SingleNft: React.FC<SingleNftProps> = ({ nft, preview }) => {
  return (
    <div className="flex h-fit justify-center items-center">
      <div className="relative group bg-gradient-to-br from-[#1F1C2C] to-[#453c6f] border-4 p-1 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500">
        <div className="relative  rounded-xl p-6 space-y-6 max-w-xs transition-transform transform hover:-translate-y-3 duration-300 ease-in-out">
          <div className="overflow-hidden rounded-xl">
            <img
              src={
                preview && !nft.image
                  ? "https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg"
                  : nft.image
              }
              alt={nft.name}
              className="object-cover w-full h-48 rounded-lg transition-transform duration-500 transform group-hover:scale-105"
            />
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              {preview && !nft.storeName ? "Store Name" : nft.storeName}
            </h2>
            <p className="text-gray-400 text-sm">
              {preview && !nft.discount
                ? "Coupon Discount"
                : nft.discount + "% Off"}
            </p>

            <p className="text-gray-400 text-sm">
              {preview && !nft.expiration
                ? "Expires on: YYYY-MM-DD"
                : `Expires on: ${nft.expiration}`}
            </p>
          </div>

          {/* Price Section */}
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold text-[#FBCB0A]">
              {preview && !nft.price ? "Sell At" : nft.price} ETH
            </span>
            <button className="px-4 py-2 bg-[#3A3043] text-white rounded-lg hover:bg-[#5C5470] transition-all duration-300">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleNft;
