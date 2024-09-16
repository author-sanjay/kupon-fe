import React, { useEffect, useState } from "react";
import MarketPlaceHero from "./MarketPlaceHero";
import SingleNft from "../Home/SingleNft";
import { useNft } from "../Context/Web3Context";
import { enqueueSnackbar } from "notistack";
import { Hourglass } from "react-loader-spinner";

const MarketPlace = () => {
  const { getAllActiveCoupons } = useNft();
  const [isloading, setIsLoading] = useState(true);

  const [listOfCouponsOnSale, setListofCouponsOnSale] = useState([]);
  function extractMarketableCoupons(coupons) {
    return coupons.filter((coupon) => coupon.marketable === true);
  }
  const nft = {
    name: "Galaxy Warrior",
    description: "A warrior from the distant future...",
    price: "3.5",
    image: "https://your-nft-image-url.com",
  };

  useEffect(() => {
    getAllActiveCoupons()
      .then((success: []) => {
        setListofCouponsOnSale(extractMarketableCoupons(success));
        setIsLoading(false);
      })
      .catch((e) => {
        enqueueSnackbar("Error Fetching Coupons, Please try again later", {
          preventDuplicate: true,
          variant: "error",
          autoHideDuration: 5000,
        });
        console.log(e);
      });
  }, []);
  return (
    <>
      <div className="overflow-y-scroll h-full scrollbar-hidden">
        <div className="bg-[#3A3043] h-1/2">
          <MarketPlaceHero />
        </div>
        {isloading ? (
          <div className="w-full h-1/5 flex items-center justify-center mt-20">
            <Hourglass
              visible={true}
              height="80"
              width="80"
              ariaLabel="hourglass-loading"
              wrapperStyle={{}}
              wrapperClass=""
              colors={["#3A3043", "#3A3043"]}
            />
          </div>
        ) : (
          <div className="h-5/6 mt-10 grid grid-cols-4 gap-4 animate-fade-in">
            {listOfCouponsOnSale.length > 0 ? (
              listOfCouponsOnSale.map((coupon) => (
                <SingleNft
                  preview={false}
                  owned={false}
                  nft={coupon}
                  setLoading={setIsLoading}
                />
              ))
            ) : (
              <div className="flex justify-center w-[100vw] text-black text-3xl ml-10 mt-10">
                Oops All our coupons have been used.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MarketPlace;
