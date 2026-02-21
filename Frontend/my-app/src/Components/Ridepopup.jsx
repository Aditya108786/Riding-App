import React, { useContext, useState } from "react";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import { SocketContext } from "../context/socketcontext";

export const Ridepopup = ({
  rideRequests = [],
  selectedRideId,
  onSelectRide,
  setdeclineride,
  setriderequestconfirm,
  onRideAccepted,
}) => {
  const { socket, setroomid } = useContext(SocketContext);
  const [loading, setLoading] = useState(false);

  const selectedRequest =
    rideRequests.find((item) => item.ride?._id === selectedRideId) || rideRequests[0];
  const user = selectedRequest?.ride?.user;

  const sendridetouser = async () => {
    if (!selectedRequest?.ride?._id) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/confirmride`,
        { rideId: selectedRequest.ride._id },
        { withCredentials: true }
      );

      setroomid(res.data.roomId);
      const ride = res.data.ride;
      socket.emit("start:chat-room", res.data.roomId);
      socket?.emit("ride-accepted", {
        rideId: selectedRequest.ride._id,
        ride,
      });

      onRideAccepted?.({
        ride,
        roomId: res.data.roomId,
        selectedRequest,
      });
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to accept ride";
      if (message.toLowerCase().includes("already")) {
        onRideAccepted?.({
          ride: null,
          roomId: null,
          selectedRequest,
          rejected: true,
        });
      }
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (!rideRequests.length) {
    return (
      <div className="w-full bg-white py-8">
        <p className="text-center text-gray-500 font-medium">No pending ride requests</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white relative">
      <button
        onClick={() => setdeclineride(true)}
        className="absolute left-1/2 -translate-x-1/2 -top-4"
      >
        <i className="ri-arrow-down-wide-line text-3xl text-gray-300"></i>
      </button>

      <h3 className="text-xl font-bold text-gray-800 mb-5">Ride Requests</h3>

      <div className="mb-5">
        <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
          Choose a request ({rideRequests.length})
        </p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {rideRequests.map((req) => {
            const active = req.ride?._id === selectedRequest?.ride?._id;
            return (
              <button
                key={req.ride?._id}
                onClick={() => onSelectRide?.(req.ride?._id)}
                className={`min-w-[190px] rounded-2xl border p-3 text-left transition-all ${
                  active ? "border-black bg-gray-50 shadow-md" : "border-gray-200 bg-white"
                }`}
              >
                <p className="text-sm font-bold text-gray-900">
                  {req.ride?.user?.fullname?.firstname || "Passenger"}
                </p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{req.pickupaddress || "Pickup loading..."}</p>
                <p className="text-base font-bold text-gray-900 mt-2">Rs {req.ride?.fare || "--"}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl mb-5">
        <div className="flex items-center gap-3">
          <img
            src={user?.profilePicture || "https://randomuser.me/api/portraits/men/45.jpg"}
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
            alt="user"
          />
          <div>
            <h4 className="font-bold text-gray-800">{user?.fullname?.firstname || "Passenger"}</h4>
            <p className="text-xs text-gray-500 font-medium">5.0 star | Cash</p>
          </div>
        </div>
        <div className="text-right">
          <h5 className="text-lg font-bold text-gray-900">Rs {selectedRequest?.ride?.fare}</h5>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Estimated Fare</p>
        </div>
      </div>

      <div className="space-y-4 mb-6 px-1">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center mt-1">
            <i className="ri-map-pin-2-fill text-green-600 text-lg"></i>
            <div className="w-[2px] h-6 bg-gray-100 my-1"></div>
          </div>
          <div className="flex-1 border-b border-gray-50 pb-2">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Pickup</p>
            <p className="text-sm text-gray-700 font-medium line-clamp-1">
              {selectedRequest?.pickupaddress || "Loading pickup..."}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <i className="ri-map-pin-2-fill text-red-500 text-lg mt-1"></i>
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Destination</p>
            <p className="text-sm text-gray-700 font-medium line-clamp-1">
              {selectedRequest?.destinationaddress || "Loading destination..."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          disabled={loading}
          onClick={sendridetouser}
          className={`w-full py-4 rounded-xl text-white font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Accepting..." : "Accept Selected Ride"}
        </button>

        <button
          onClick={() => {
            if (selectedRequest?.ride?._id) {
              onRideAccepted?.({
                ride: null,
                roomId: null,
                selectedRequest,
                rejected: true,
              });
            }
            setriderequestconfirm(false);
            setdeclineride(rideRequests.length <= 1);
          }}
          className="w-full py-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all active:scale-95"
        >
          Skip Selected
        </button>
      </div>
    </div>
  );
};
