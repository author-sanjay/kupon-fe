import React, { useEffect, useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import { useNft } from "../Context/Web3Context";
import { useAuth } from "../Context/AuthContext";
import { Hourglass } from "react-loader-spinner";
import SingleNft from "./SingleNft";
import MarketPlace from "../MaketPlace/MarketPlace";
import { Mail, Phone } from "lucide-react";
import QR from "../assets/DeveloperQR.png";
import AddCouponModal from "./AddCouponModal";
function Home() {
  const { user } = useAuth();
  const [sell, setSell] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getAllCouponsForOwner, lastAction } = useNft();
  const [marketPlaceClick, setMarketPlaceClick] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(
    user.walletAddress != null ? true : false
  );
  const [addCoupon, setAddCoupon] = useState(false);
  const [userCoupons, setUserCoupons] = useState([]);

  useEffect(() => {
    if (user.walletAddress) {
      setIsWalletConnected(true);
      setIsLoading(true);
      getAllCouponsForOwner(user.walletAddress)
        .then((coupons: any) => {
          setIsLoading(false);
          setUserCoupons(coupons);
          console.log(user);
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  }, [user, lastAction]);

  return (
    <>
      <div className="h-screen w-screen bg-[#CCBED0] overflow-y-scroll scrollbar-hidden text-white">
        <div className="h-[8%] bg-[#3A3043]">
          <Header
            sell={sell}
            setSell={setSell}
            isWalletConnected={isWalletConnected}
            setIsWalletConnected={setIsWalletConnected}
            marketPlace={marketPlaceClick}
            setMarketPlace={setMarketPlaceClick}
          />
        </div>
        {marketPlaceClick ? (
          <MarketPlace />
        ) : (
          <>
            <div className="bg-[#3A3043] h-4/6">
              <Hero
                setAddCoupon={setAddCoupon}
                sell={sell}
                marketPlace={marketPlaceClick}
                setMarketPlace={setMarketPlaceClick}
              />
            </div>
            {isLoading ? (
              <>
                <div className="h-4/5 bg-[#CCBED0] text-black flex flex-col w-full items-center justify-center">
                  <span className="mb-10 text-2xl font-extralight">
                    Please Wait We fetching your Coupons
                  </span>
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
              </>
            ) : (
              <>
                <div className="h-4/5 bg-[#CCBED0] text-black flex w-full items-center justify-center">
                  <div className="w-full px-10 h-[90%] flex flex-col">
                    <div className="w-full flex flex-row justify-between items-center">
                      <div className="flex w-full flex-col justify-between animate-fade-in">
                        <span className="text-3xl font-thin font-serif">
                          Your Coupons
                        </span>
                      </div>
                    </div>

                    <div className="w-full mt-10">
                      {userCoupons?.length === 0 ? (
                        <>
                          <div className="w-full items-center justify-center flex flex-col gap-4 animate-slide-up">
                            <div className="mt-4 rounded-full  flex items-center justify-center animate-bounce">
                              <span className="text-white text-[5vh]">😲</span>
                            </div>
                            <span className="text-lg font-serif">
                              Oops! You don't own any coupons yet.
                            </span>
                            {sell ? (
                              <>
                                <button
                                  onClick={() => {
                                    setAddCoupon(true);
                                  }}
                                  className="px-6 py-3 bg-[#3A3043] rounded-lg min-w-max text-white hover:bg-[#524562] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                >
                                  Add First Coupon
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setMarketPlaceClick(true);
                                  }}
                                  className="px-6 py-3 bg-[#3A3043] rounded-lg min-w-max text-white hover:bg-[#524562] hover:border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                >
                                  Go to Marketplace
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      ) : userCoupons ? (
                        <>
                          <div className="grid grid-cols-5 gap-4 animate-fade-in">
                            {userCoupons?.map((coupon, index) => (
                              <SingleNft
                                key={index}
                                nft={coupon}
                                owned={true}
                                preview={false}
                                setLoading={setIsLoading}
                              />
                            ))}
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="h-2/5 bg-[#3A3043] text-white px-10 flex flex-row w-full items-center justify-center">
              <div className="developerContact">
                <h2 className="text-white">Contact Developer</h2>
                <div className="developerInfo">
                  <div className="infoItem">
                    <Mail className="contactIcon" />
                    <span>sanjaykumar73189@gmail.com</span>
                  </div>
                  <div className="infoItem">
                    <Phone className="contactIcon" />
                    <span>+91 7303853148</span>
                  </div>
                </div>
              </div>
              <div className="developerQR">
                <img src={QR} className="qrCode" />
              </div>
            </div>
          </>
        )}
      </div>
      {addCoupon ? (
        <AddCouponModal
          onClose={() => {
            setAddCoupon(false);
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default Home;
