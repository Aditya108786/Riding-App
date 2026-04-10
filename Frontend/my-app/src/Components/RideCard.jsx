import React from "react";

const RideCard = ({ request, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-[190px] rounded-2xl border p-3 text-left transition-all ${
        active ? "border-black bg-gray-50 shadow-md" : "border-gray-200 bg-white"
      }`}
    >
      <p className="text-sm font-bold text-gray-900">
        {request?.ride?.user?.fullname?.firstname || "Passenger"}
      </p>
      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
        {request?.pickupaddress || "Pickup loading..."}
      </p>
      <p className="text-base font-bold text-gray-900 mt-2">Rs {request?.ride?.fare || "--"}</p>
    </button>
  );
};

export default RideCard;
