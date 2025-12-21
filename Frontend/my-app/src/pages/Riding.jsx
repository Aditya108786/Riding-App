import React from "react";
import { Link } from "react-router-dom";

export const Riding = (props) => {
  const handleHomeClick = () => {
    // Example navigation
    if (props.navigate) props.navigate("/user/home");
    else console.log("Go to Home");
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 relative">
      {/* Top Half - Map Image */}
      <div className="h-1/2 relative">
        <img
          className="h-full w-full object-cover"
          src="https://images.prismic.io/superpupertest/75d32275-bd15-4567-a75f-76c4110c6105_1*mleHgMCGD-A1XXa2XvkiWg.png?auto=compress,format&w=1966&h=1068"
          alt="Map View"
        />

        {/* 🏠 Home Icon */}
        <Link
          to={'/Userhome'}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
        >
          <i className="ri-home-4-line text-xl text-gray-700"></i>
        </Link>
      </div>

      {/* Bottom Half - Ride Details */}
      <div className="h-1/2 bg-white rounded-t-3xl px-6 py-6 shadow-lg mt-2 flex flex-col justify-between">
        {/* Driver & Vehicle Info */}
        <div className="flex items-center gap-4 border-b pb-4">
          <img
            className="h-20 w-20 object-cover rounded-lg border"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9RntYUpvf9byeBaiKfcrMdoh_IeZqDeEW8w&s"
            alt="Car"
          />
          <div>
            <h2 className="text-lg font-semibold">Aditya</h2>
            <h3 className="text-xl font-bold tracking-wide">562/11-A</h3>
            <p className="text-sm text-gray-500">Maruti Suzuki Alto</p>
          </div>
        </div>

        {/* Ride Details */}
        <div className="space-y-4 mt-3">
          <div className="flex items-center gap-4">
            <i className="ri-map-pin-2-fill text-green-600 text-xl"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm text-gray-500">RTU, Kota</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <i className="ri-currency-line text-yellow-500 text-xl"></i>
            <div>
              <h3 className="text-lg font-medium">$193</h3>
              <p className="text-sm text-gray-500">Cash Payment</p>
            </div>
          </div>

          
        </div>

        {/* Confirm Button */}
        <button
          onClick={() => {
            props.setvehiclefound(true);
            props.setconfirmride(false);
          }}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white text-lg font-semibold py-3 rounded-xl transition-all duration-300"
        >
          Confirm Ride
        </button>
      </div>
    </div>
  );
};
