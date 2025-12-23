import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import { CaptaindataContext } from "../context/captaincontext";
import { SocketContext } from "../context/socketcontext";
import {Sendmessagecaptain} from './Captainmessage'
const Confirmridepopup = (props) => {
  const navigate = useNavigate();
  const [otp, setotp] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 SAFETY: Prevent crash if data not ready
  if (!props?.ridedata?.ridewithuser) return null;

  const { ridewithuser } = props.ridedata;
  const {socket , roomId} = useContext(SocketContext)

  const { setCurrentRide } = useContext(CaptaindataContext);

  console.log("hey baby hey babu" ,roomId)

  const submithandler = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:4000/ride/startride",
        {
          rideId: ridewithuser._id,
          OTP: otp,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        console.log(res.data)
        // Save current ride in context so CaptainRiding can use it
        setCurrentRide(res.data);
        navigate("/Captain-riding");
      }
    } catch (err) {
      alert("Invalid OTP or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-white rounded-t-3xl p-5 shadow-lg relative">
      
      {/* Close Button */}
      <h5
        onClick={() => props.setriderequestconfirm(false)}
        className="absolute top-3 w-full text-center"
      >
        <i className="ri-arrow-down-wide-line text-3xl text-gray-500"></i>
      </h5>

      {/* Header */}
      <div className="text-center mt-8 mb-5">
        <h3 className="text-2xl font-semibold">Confirm Ride</h3>
        <p className="text-gray-500 text-sm">
          Verify OTP to start the ride
        </p>
      </div>

      {/* Rider Info */}
      <div className="flex items-center gap-4 border-b pb-4 mb-4">
        <img
          src="https://i.pravatar.cc/100?img=12"
          alt="Rider"
          className="h-14 w-14 rounded-full border object-cover"
        />
        <div>
          <h3 className="text-lg font-medium">
            {ridewithuser.user?.fullname?.firstname || "Rider"}
          </h3>
          <p className="text-sm text-gray-500">Cash Ride</p>
        </div>
        <p className="ml-auto text-sm font-medium text-gray-700">
          ₹{ridewithuser.fare}
        </p>
      </div>

      {/* Pickup & Drop */}
      <div className="space-y-4 mb-5">
        <div className="flex gap-3">
          <i className="ri-map-pin-2-fill text-green-600 text-xl"></i>
          <div>
            <p className="font-medium">Pickup</p>
            <p className="text-sm text-gray-600">
              {ridewithuser.pickup?.[0]}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <i className="ri-map-pin-line text-red-600 text-xl"></i>
          <div>
            <p className="font-medium">Drop</p>
            <p className="text-sm text-gray-600">
              {ridewithuser.destination?.[0]}
            </p>
          </div>
        </div>
      </div>

      {/* OTP FORM */}
      <form onSubmit={submithandler} className="space-y-4">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setotp(e.target.value)}
          className="w-full px-4 py-3 text-lg rounded-xl bg-gray-100 outline-none"
        />

        <button
          type="submit"
          disabled={!otp || loading}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Starting..." : "Start Ride"}
        </button>

        <button
          type="button"
          onClick={() => props.setriderequestconfirm(false)}
          className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold"
        >
          Cancel
        </button>
      </form>

      <div>
        <Sendmessagecaptain roomId={roomId} />
      </div>
    </div>
  );
};

export default Confirmridepopup;
