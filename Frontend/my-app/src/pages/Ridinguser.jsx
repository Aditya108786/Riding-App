import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/socketcontext";
import LiveMap from "../Components/LiveMap";
import axios from "axios";
import L from "leaflet";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Ridingcontext } from "../context/Ridingcontext";

const customCaptainIcon = new L.Icon({
  iconUrl: markerIcon2x,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
});

export const Ridinguser = () => {
  const { socket, livelocation, setlivelocation } = useContext(SocketContext);
  const [rideStatus, setRideStatus] = useState(null);
  const [fullAddress, setFullAddress] = useState("");
  const { ridingdata } = useContext(Ridingcontext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    const confirmedHandler = async (data) => {
      setRideStatus(data?.ride || data);
      const lng = data?.ride?.captain?.location?.lng ?? data?.ride?.captain?.location?.lon;
      const lat = data?.ride?.captain?.location?.ltd ?? data?.ride?.captain?.location?.lat;
      if (lat != null && lng != null) {
        setlivelocation?.({ lat, lng });
        try {
          const res = await axios.post("http://localhost:4000/maps/getfulladdress", { lat, lng }, { withCredentials: true });
          setFullAddress(res.data.address);
        } catch (err) {
          console.log("address fetch error", err);
        }
      }
    };

    const liveHandler = async (data) => {
      const loc = data?.location || data;
      const lat = loc?.ltd ?? loc?.lat ?? null;
      const lng = loc?.lng ?? loc?.lon ?? null;

      if (lat != null && lng != null) {
        setlivelocation?.({ lat, lng });
        try {
          const res = await axios.post("http://localhost:4000/maps/getfulladdress", { lat, lng }, { withCredentials: true });
          setFullAddress(res.data.address);
        } catch (err) {
          console.log("address fetch error", err);
        }
      }
    };

    socket.on("ride-confirmed", confirmedHandler);
    socket.on("captain-live-location", liveHandler);

    return () => {
      socket.off("ride-confirmed", confirmedHandler);
      socket.off("captain-live-location", liveHandler);
    };
  }, [socket, setlivelocation]);

  const callDriver = () => {
    const tel = rideStatus?.captain?.phone;
    if (tel) window.open(`tel:${tel}`);
  };

  useEffect(() => {
    const handler = (data) => {
      console.log("ride ended", data);
      navigate("/Userhome");
    };

    socket.on("End-ride", handler);

    return () => {
      socket.off("End-ride", handler);
    };
  }, [socket]);

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 overflow-hidden">
      
      {/* 80% Height - Map Section */}
      <div className="h-[80vh] w-full bg-white relative">
        {livelocation ? (
          <LiveMap 
            lat={Number(livelocation.lat)} 
            lng={Number(livelocation.lng)} 
            pickup={[ridingdata.pickup[1], ridingdata.pickup[0]]} 
            destination={[ridingdata.destination[1], ridingdata.destination[0]]} 
            icon={customCaptainIcon} 
            showCircle={true} 
            showRoute={true} 
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
            <i className="ri-map-pin-time-line text-4xl mb-2"></i>
            <p>Waiting for captain's location...</p>
          </div>
        )}

        {/* Floating Emergency/Back overlay if needed */}
        <div className="absolute top-4 left-4 z-[1000]">
            <button 
                onClick={() => navigate(-1)}
                className="bg-white p-2 rounded-full shadow-lg active:scale-90 transition-transform"
            >
                <i className="ri-arrow-left-line text-xl"></i>
            </button>
        </div>
      </div>

      {/* 20% Height - Driver Info Section */}
      <div className="h-[20vh] min-h-[160px] bg-white rounded-t-3xl p-4 md:p-6 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] flex flex-col justify-center z-10">
        <div className="max-w-screen-md mx-auto w-full">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                className="h-14 w-14 md:h-16 md:w-16 rounded-full object-cover border-2 border-gray-100" 
                src={rideStatus?.captain?.profilePic || "https://www.gravatar.com/avatar?d=mp&s=120"} 
                alt="driver" 
              />
              <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base md:text-lg font-bold truncate">
                  {rideStatus?.captain?.fullname?.firstname || "Captain Assigned"}
                </h3>
                <span className="text-sm font-bold bg-gray-100 px-2 py-1 rounded">
                   {rideStatus?.captain?.vehicle?.plate || "LIVE"}
                </span>
              </div>
              <p className="text-xs md:text-sm text-gray-500 truncate">
                {rideStatus?.captain?.vehicle?.name || "Tracking your ride"}
              </p>
            </div>

            <div className="flex gap-2">
               <button 
                onClick={callDriver}
                className="bg-green-500 text-white p-3 rounded-full shadow-lg active:scale-90 transition-transform flex items-center justify-center"
               >
                 <i className="ri-phone-fill text-xl"></i>
               </button>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="mt-3 flex items-center gap-2">
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] md:text-xs text-blue-600 font-medium uppercase tracking-wider">
              {fullAddress ? "Near: " + fullAddress : "Updating live location..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};