import React from "react";

const MarketPlaceHero = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-r bg-[#3A3043] to-[#84778e] text-white overflow-hidden">
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

      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold mb-4">Market Place</h1>
        <p className="text-lg mb-8">
          Want Discount on Your Shopping? We covered it for you
        </p>
      </div>
    </div>
  );
};

export default MarketPlaceHero;
