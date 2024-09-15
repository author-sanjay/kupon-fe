import React from "react";
import MarketPlaceHero from "./MarketPlaceHero";
import SingleNft from "../Home/SingleNft";

const MarketPlace = () => {
  const nft = {
    name: "Galaxy Warrior",
    description: "A warrior from the distant future...",
    price: "3.5",
    image: "https://your-nft-image-url.com",
  };
  return (
    <>
      <div className="overflow-y-scroll h-full scrollbar-hidden">
        <div className="bg-[#3A3043] h-1/2">
          <MarketPlaceHero />
        </div>
        <div className="h-5/6 mt-10 grid grid-cols-4 gap-4 animate-fade-in">
          <SingleNft nft={nft} />
        </div>
      </div>
    </>
  );
};

export default MarketPlace;
