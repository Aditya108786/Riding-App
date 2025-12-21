import React, { useState, useRef, useEffect, useContext } from "react";
import Finishride from "../Components/Finishride";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Routing from "../Components/Routing";
import { RecenterMap } from "../Components/Recentermap";
import { SocketContext } from "../context/socketcontext";
import { CaptaindataContext } from "../context/captaincontext";
import axios from "axios";

const CaptainRiding = () => {
  const [finishride, setfinishride] = useState(false);
  const finishrideref = useRef(null);

  const { socket } = useContext(SocketContext);
  const { currentRide } = useContext(CaptaindataContext);

  const [pickupAddr, setPickupAddr] = useState("");
  const [dropAddr, setDropAddr] = useState("");

  const [lat, setLat] = useState(28.4595);
  const [lng, setLng] = useState(77.0266);
  const watchIdRef = useRef(null);

  useGSAP(() => {
    if (!finishrideref.current) return;
    gsap.to(finishrideref.current, {
      y: finishride ? "0%" : "100%",
      autoAlpha: finishride ? 1 : 0,
      duration: 0.35,
      ease: "power3.out",
    });
  }, [finishride]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!currentRide) return;
      const [pickupLng, pickupLat] = currentRide.pickup;
      const [destLng, destLat] = currentRide.destination;
      try {
        const [pickupRes, destRes] = await Promise.all([
          axios.post("http://localhost:4000/maps/getfulladdress", { lat: pickupLat, lng: pickupLng }, { withCredentials: true }),
          axios.post("http://localhost:4000/maps/getfulladdress", { lat: destLat, lng: destLng }, { withCredentials: true }),
        ]);
        setPickupAddr(pickupRes.data.address);
        setDropAddr(destRes.data.address);
        setLat(pickupLat);
        setLng(pickupLng);
      } catch (err) { console.error(err); }
    };
    fetchAddresses();
  }, [currentRide]);

  const customCaptainIcon = new L.Icon({
    iconUrl: markerIcon2x, iconSize: [40, 40], iconAnchor: [20, 40],
    popupAnchor: [0, -40], shadowUrl: markerShadow, shadowSize: [41, 41],
  });

  useEffect(() => {
    if (!socket || !currentRide?.ridewithuser) return;
    const liveHandler = (data) => {
      if (data.rideId && currentRide.ridewithuser._id !== data.rideId) return;
      setLat(data.lat); setLng(data.lng);
    };
    socket.on("captain-live-location", liveHandler);
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude); setLng(longitude);
        socket.emit("captain-location", { rideId: currentRide.ridewithuser._id, lat: latitude, lng: longitude, userId: currentRide.ridewithuser.user?._id });
      });
    }
    return () => {
      socket.off("captain-live-location", liveHandler);
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [socket, currentRide]);

  const CaptainMapControl = ({ deps = [] }) => {
    const map = useMap();
    useEffect(() => {
      if (!map) return;
      const pts = [];
      if (currentRide?.pickup) pts.push([currentRide.pickup[1], currentRide.pickup[0]]);
      if (currentRide?.destination) pts.push([currentRide.destination[1], currentRide.destination[0]]);
      if (lat != null && lng != null) pts.push([lat, lng]);
      if (pts.length > 1) map.fitBounds(L.latLngBounds(pts), { padding: [50, 50] });
    }, [map, ...deps]);
    return null;
  };

  const passengerName = currentRide?.ridewithuser?.user?.fullname?.firstname || "Passenger";
  const fare = currentRide?.ridewithuser?.fare || "--";

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col relative overflow-hidden text-gray-800">

      {/* 80% MAP */}
      <div className="h-[80vh] w-full relative z-0">
        <MapContainer center={[lat, lng]} zoom={15} className="h-full w-full"
           attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {currentRide?.pickup && currentRide?.destination && <Routing pickup={currentRide.pickup} destination={currentRide.destination} />}
          <Marker position={[lat, lng]} icon={customCaptainIcon} />
          <CaptainMapControl deps={[lat, lng, currentRide?.pickup, currentRide?.destination]} />
        </MapContainer>
      </div>

      {/* 20% INFO */}
      <div className="h-[20vh] min-h-[160px] bg-white rounded-t-3xl p-3 md:p-5 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-10 flex flex-col justify-between">
        
        {/* Row 1: Passenger & Fare */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={currentRide?.ridewithuser?.user?.profilePicture || "https://randomuser.me/api/portraits/men/45.jpg"} className="w-10 h-10 rounded-full border" alt="rider" />
            <div>
              <h3 className="font-bold text-sm leading-tight">{passengerName}</h3>
              <p className="text-[10px] text-gray-500">{currentRide?.ridewithuser?.user?.phone || "No contact"}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold block">₹{fare}</span>
            <span className="text-[9px] bg-green-100 text-green-700 px-1 rounded font-bold uppercase">En Route</span>
          </div>
        </div>

        {/* Row 2: Compact Addresses */}
        <div className="flex flex-col gap-1 my-1">
          <div className="flex items-center gap-2">
            <i className="ri-record-circle-fill text-[10px] text-green-600"></i>
            <p className="text-[11px] text-gray-600 truncate font-medium">{pickupAddr || "Loading pickup..."}</p>
          </div>
          <div className="flex items-center gap-2">
            <i className="ri-map-pin-2-fill text-[10px] text-red-500"></i>
            <p className="text-[11px] text-gray-600 truncate font-medium">{dropAddr || "Loading destination..."}</p>
          </div>
        </div>

        {/* Row 3: Actions */}
        <div className="flex gap-2">
          <button onClick={() => window.open(`tel:${currentRide?.ridewithuser?.user?.phone || ""}`)} className="flex-1 bg-gray-100 py-2 rounded-lg text-xs font-bold active:bg-gray-200">
            <i className="ri-phone-fill mr-1"></i> Call
          </button>
          <button onClick={() => setfinishride(true)} className="flex-[2] bg-black text-white py-2 rounded-lg text-xs font-bold shadow-lg">
            Complete Ride
          </button>
        </div>

      </div>

      {/* FINISH RIDE SHEET */}
      <div ref={finishrideref} className="fixed bottom-0 left-0 w-full z-[2000] bg-white shadow-2xl rounded-t-3xl" style={{ transform: "translateY(100%)", opacity: 0 }}>
        <Finishride setfinishride={setfinishride} currentride={currentRide} />
      </div>
    </div>
  );
};

export default CaptainRiding;