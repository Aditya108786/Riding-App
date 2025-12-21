import React, { useContext, useState } from "react";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import { SocketContext } from "../context/socketcontext";

export const Ridepopup = ({
  ridedata,
  pickupaddress,
  destinationaddress,
  setdeclineride,
  setriderequestconfirm,
}) => {
  const { socket } = useContext(SocketContext);
  const [loading, setLoading] = useState(false);

  const user = ridedata?.ridewithuser?.user;

  const sendridetouser = async () => {
    try {
      setLoading(true);

      await axios.post(
        "http://localhost:4000/ride/confirmride",
        { rideId: ridedata.ridewithuser._id },
        { withCredentials: true }
      );

      socket?.emit("ride-accepted", {
        rideId: ridedata.ridewithuser._id,
      });

      setriderequestconfirm(true);
      setdeclineride(true);
    } catch (err) {
      alert("Failed to accept ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white relative">
      {/* Pull Tab for GSAP Feel */}
      <button
        onClick={() => setdeclineride(true)}
        className="absolute left-1/2 -translate-x-1/2 -top-4"
      >
        <i className="ri-arrow-down-wide-line text-3xl text-gray-300"></i>
      </button>

      <h3 className="text-xl font-bold text-gray-800 mb-5">
        New Ride Request
      </h3>

      {/* Passenger Header */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl mb-5">
        <div className="flex items-center gap-3">
          <img
            src={user?.profilePicture || "https://randomuser.me/api/portraits/men/45.jpg"}
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
            alt="user"
          />
          <div>
            <h4 className="font-bold text-gray-800">
              {user?.fullname?.firstname || "Passenger"}
            </h4>
            <p className="text-xs text-gray-500 font-medium">5.0 ★ • Cash</p>
          </div>
        </div>
        <div className="text-right">
          <h5 className="text-lg font-bold text-gray-900">₹{ridedata?.ridewithuser?.fare}</h5>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Estimated Fare</p>
        </div>
      </div>

      {/* Address Details */}
      <div className="space-y-4 mb-6 px-1">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center mt-1">
            <i className="ri-map-pin-2-fill text-green-600 text-lg"></i>
            <div className="w-[2px] h-6 bg-gray-100 my-1"></div>
          </div>
          <div className="flex-1 border-b border-gray-50 pb-2">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Pickup</p>
            <p className="text-sm text-gray-700 font-medium line-clamp-1">
              {pickupaddress || "Loading pickup..."}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <i className="ri-map-pin-2-fill text-red-500 text-lg mt-1"></i>
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Destination</p>
            <p className="text-sm text-gray-700 font-medium line-clamp-1">
              {destinationaddress || "Loading destination..."}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button
          disabled={loading}
          onClick={sendridetouser}
          className={`w-full py-4 rounded-xl text-white font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? (
            "Accepting..."
          ) : (
            <>
              Accept Ride
            </>
          )}
        </button>

        <button
          onClick={() => setdeclineride(true)}
          className="w-full py-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all active:scale-95"
        >
          Ignore
        </button>
      </div>
    </div>
  );
};