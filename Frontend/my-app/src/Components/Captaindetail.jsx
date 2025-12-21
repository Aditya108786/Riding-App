import React, { useContext } from "react";
import { CaptaindataContext } from '../context/captaincontext'

const Captaindetails = (props) => {
  const { captain } = useContext(CaptaindataContext);

  if (!captain) return null;

  return (
    <div className="h-full w-full flex flex-col justify-between">
      {/* Profile Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            className="h-14 w-14 rounded-full border object-cover shadow-sm"
            src={captain.profilePicture || "https://i.pravatar.cc/100?img=8"}
            alt="Captain"
          />
          <div>
            <h2 className="text-lg font-bold text-gray-800 leading-tight">
              {captain.fullname.firstname} {captain.fullname.lastname}
            </h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              {captain.vehicle.vehicleType} • {captain.vehicle.plate}
            </p>
          </div>
        </div>
        <div className="text-right">
          <h4 className="text-xl font-bold text-gray-900">₹645.20</h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Earned Today</p>
        </div>
      </div>

      {/* Compact Stats Row */}
      <div className="flex justify-around bg-gray-50 rounded-2xl py-3 mt-2">
        <div className="text-center">
          <i className="ri-timer-2-line text-lg text-gray-600 mb-1 block"></i>
          <h5 className="text-sm font-bold">10.2</h5>
          <p className="text-[10px] text-gray-400 uppercase">Hours</p>
        </div>
        <div className="text-center border-x border-gray-200 px-8">
          <i className="ri-speed-up-line text-lg text-gray-600 mb-1 block"></i>
          <h5 className="text-sm font-bold">32.5</h5>
          <p className="text-[10px] text-gray-400 uppercase">KM</p>
        </div>
        <div className="text-center">
          <i className="ri-booklet-line text-lg text-gray-600 mb-1 block"></i>
          <h5 className="text-sm font-bold">8</h5>
          <p className="text-[10px] text-gray-400 uppercase">Jobs</p>
        </div>
      </div>

      {/* Button Row */}
      <div className="mt-auto">
        <button 
          onClick={() => props.setdeclineride(false)} 
          className="w-full bg-black text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1"
        >
          <i className="ri-notification-3-line"></i>
          View Ride Requests
        </button>
      </div>
    </div>
  );
};

export default Captaindetails;