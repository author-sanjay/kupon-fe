import React from "react";

interface HeroProps {
  sell: boolean;
  marketPlace: boolean;
  setMarketPlace: React.Dispatch<React.SetStateAction<boolean>>;
  setAddCoupon: React.Dispatch<React.SetStateAction<boolean>>;
}

const Hero: React.FC<HeroProps> = ({
  sell,
  marketPlace,
  setMarketPlace,
  setAddCoupon,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-r bg-[#3A3043] to-[#84778e] text-white overflow-hidden">
      {/* Background NFT Cards */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="nft-cards top-left-to-bottom-right">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="nft-card" />
          ))}
        </div>
        <div className="nft-cards bottom-left-to-top-right ">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="nft-card" />
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold mb-4">
          {sell ? "Have A Shopping Coupon?" : "Want A Shopping Coupon?"}
        </h1>
        <p className="text-lg mb-8">
          Join the revolution of digital shopping and own unbelievable Discount
          for your shopping.
        </p>
        {sell ? (
          <button
            onClick={() => {
              setAddCoupon(true);
            }}
            className="px-6 py-3 bg-[#CCBED0] rounded-lg hover:bg-[#3A3043] text-black hover:text-white hover:border-2 transition-colors duration-300"
          >
            Add Coupon
          </button>
        ) : (
          <button
            onClick={() => {
              setMarketPlace(true);
            }}
            className="px-6 py-3 bg-[#CCBED0] rounded-lg hover:bg-[#3A3043] text-black hover:text-white hover:border-2 transition-colors duration-300"
          >
            Explore Coupons
          </button>
        )}
      </div>
    </div>
  );
};

export default Hero;
