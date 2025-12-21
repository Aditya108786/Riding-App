import React from "react";

export const Confirmvehicle = (props) => {
  const fare = props.fares[props.selectedvehicle];

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-4">
      <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
        Confirm your ride
      </h3>

      <div className="flex flex-col items-center gap-5">
        {/* Vehicle Image */}
        <img
          className="h-16 sm:h-20 object-contain"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9RntYUpvf9byeBaiKfcrMdoh_IeZqDeEW8w&s"
          alt="vehicle"
        />

        {/* Ride Details */}
        <div className="w-full space-y-4">
          {/* Pickup */}
          <div className="flex items-start gap-3">
            <i className="ri-map-pin-2-fill text-lg sm:text-xl text-green-600"></i>
            <div>
              <h3 className="text-base sm:text-lg font-medium">
                {props.pickup}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">Pickup</p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-3">
            <i className="ri-map-pin-2-fill text-lg sm:text-xl text-red-500"></i>
            <div>
              <h3 className="text-base sm:text-lg font-medium">
                {props.destination}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">Destination</p>
            </div>
          </div>

          {/* Fare */}
          <div className="flex items-start gap-3">
            <i className="ri-currency-line text-lg sm:text-xl"></i>
            <div>
              <h3 className="text-base sm:text-lg font-medium">
                ₹{fare}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">Cash</p>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={() => {
            props.setvehiclefound(true);
            props.selectvehicle(props.selectedvehicle);
            props.setconfirmride(false);
          }}
          className="w-full sm:w-[90%] bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2.5 rounded-lg"
        >
          Confirm Ride
        </button>
      </div>
    </div>
  );
};
