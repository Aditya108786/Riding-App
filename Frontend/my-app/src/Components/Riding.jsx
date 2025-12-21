import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/socketcontext";
import LiveMap from "./LiveMap";
import axios from "axios";
import L from "leaflet";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const customCaptainIcon = new L.Icon({
  iconUrl: markerIcon2x,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
});

const Ridinguser = () => {
  const { socket, livelocation, setlivelocation } = useContext(SocketContext);
  const [rideStatus, setRideStatus] = useState(null);
  const [fullAddress, setFullAddress] = useState("");

  useEffect(() => {
    if (!socket) return;

    const confirmedHandler = async (data) => {
      setRideStatus(data?.ride || data);

      // set initial captain location if provided
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

  const trackRide = () => {
    const id = rideStatus?._id || rideStatus?.rideId || "";
    if (id) window.open(`/track?ride=${id}`, "_self");
  };

  const cancelRide = () => {
    if (!socket) return;
    const id = rideStatus?._id || rideStatus?.rideId;
    socket.emit("cancel-ride", { rideId: id });
    setRideStatus(null);
  };

     



    return (
        <div className="h-screen w-full flex flex-col bg-gray-50">
      {/* Map / Live preview */}
      <div className="h-1/2 w-full bg-white">
        {livelocation ? (
          <LiveMap lat={Number(livelocation.lat)} lng={Number(livelocation.lng)} icon={customCaptainIcon} showCircle={true} />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">Map will appear when driver is assigned</div>
        )}
      </div>

      {/* Bottom card with driver info */}
      <div className="h-1/2 bg-white rounded-t-3xl p-6 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-4">
            <img className="h-20 w-20 rounded-full object-cover" src={rideStatus?.captain?.profilePic || "https://www.gravatar.com/avatar?d=mp&s=120"} alt="driver" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{rideStatus?.captain?.fullname?.firstname || "Driver"}</h3>
              <p className="text-sm text-gray-500">{rideStatus?.captain?.vehicle?.name || "Vehicle"} • {rideStatus?.captain?.vehicle?.plate || "--"}</p>
            </div>
            <div className="text-right">
              <div className="bg-black text-white px-3 py-1 rounded-md font-semibold">OTP: {rideStatus?.OTP || "----"}</div>
              <div className="text-xs text-gray-500 mt-1">ETA: {rideStatus?.eta || "--"}</div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p className="font-medium">Current Location</p>
            <p className="truncate">{fullAddress || "Loading address..."}</p>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={callDriver} className="flex-1 bg-green-600 text-white py-3 rounded-md font-semibold">
            <i className="ri-phone-fill mr-2"></i> Call
          </button>
          <button onClick={trackRide} className="flex-1 border border-gray-200 py-3 rounded-md font-semibold">
            Track
          </button>
        </div>

        <div className="mt-3 flex gap-3">
          <button onClick={cancelRide} className="flex-1 bg-red-500 text-white py-3 rounded-md font-semibold">Cancel Ride</button>
          <button onClick={() => window.open('/support', '_self')} className="flex-1 bg-white border border-gray-200 py-3 rounded-md">Report</button>
        </div>
      </div>
    </div>
    )
}
