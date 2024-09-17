import React, { SetStateAction, useState } from "react";
import { useNft } from "../Context/Web3Context";
import { useAuth } from "../Context/AuthContext";
import { Hourglass } from "react-loader-spinner";
import { enqueueSnackbar } from "notistack";

interface TransferCouponProps {
  tokenId: number;
  onClose: () => void;
}
const TransferCoupon: React.FC<TransferCouponProps> = ({
  tokenId,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const { transferCoupon } = useNft();
  const { user } = useAuth();
  const [toAddress, setToAddress] = useState(null);
  const handleTransferCoupon = () => {
    setLoading(true);
    if (toAddress) {
      transferCoupon(user.walletAddress, toAddress, tokenId)
        .then((success) => {
          //ToDo: Add in DB
          enqueueSnackbar("Successfully Transfered Coupon", {
            preventDuplicate: true,
            variant: "success",
            autoHideDuration: 3000,
          });
          onClose();
        })
        .catch((e) => {
          enqueueSnackbar("Error Transfered Coupon", {
            preventDuplicate: true,
            variant: "success",
            autoHideDuration: 3000,
          });
          onClose();
        });
    }
  };
  return (
    <div className="w-full h-screen absolute top-0 right-0 z-10 bg-black bg-opacity-75 flex justify-center items-center animate-fadeIn">
      {loading ? (
        <>
          <div className="bg-[#3A3043] h-1/2 text-white p-8 rounded-lg shadow-lg w-1/2 animate-slideIn flex flex-col items-center justify-center">
            <span className="font-thin text-2xl">
              Please wait we are Transfering your Coupon
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
          <h2 className="text-2xl font-semibold mb-4">
            Gift Coupon To Some User
          </h2>
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
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Other User's Wallet Address (eg 0xE11...)"
              required
            />
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
              onClick={handleTransferCoupon}
              className="bg-[#3A3043] border-white border-2 hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferCoupon;
