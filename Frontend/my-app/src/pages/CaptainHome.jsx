import React, { useContext, useState, useEffect, useRef } from "react";
import Captaindetails from "../Components/Captaindetail";
import { Ridepopup } from "../Components/Ridepopup";
import Confirmridepopup from "../Components/Confirmridepopup";
import { SocketContext } from "../context/socketcontext";
import { CaptaindataContext } from "../context/captaincontext";
import axios from "axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import LiveMap from "../Components/LiveMap"; // Ensure this is imported
import L from "leaflet";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Define the Icon outside the component
const customCaptainIcon = new L.Icon({
  iconUrl: markerIcon2x,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
});

const CaptainHome = () => {
  const [Declineride, setdeclineride] = useState(true);
  const [riderequestconfirm, setriderequestconfirm] = useState(false);
  const [ridedata, setridedata] = useState(null);
  const [pickupaddress, setpickupaddress] = useState("");
  const [destinationaddress, setdestinationaddress] = useState("");

  const popupref = useRef(null);
  const rideconfirmref = useRef(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptaindataContext);

  useGSAP(() => {
    if (!popupref.current) return;
    gsap.to(popupref.current, {
      y: Declineride ? "100%" : "0%",
      autoAlpha: Declineride ? 0 : 1,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [Declineride]);

  useGSAP(() => {
    if (!rideconfirmref.current) return;
    gsap.to(rideconfirmref.current, {
      y: riderequestconfirm ? "0%" : "100%",
      duration: 0.3,
      ease: "power2.out",
    });
  }, [riderequestconfirm]);

  useEffect(() => {
    if (!socket || !captain?._id) return;
    socket.emit("join", { userId: captain._id, userType: "captain" });

    const newridehandler = async (data) => {
      const [pickupLng, pickupLat] = data.ridewithuser.pickup;
      const [destLng, destLat] = data.ridewithuser.destination;
      try {
        const [pickupAddr, destAddr] = await Promise.all([
          axios.post("http://localhost:4000/maps/getfulladdress", { lat: pickupLat, lng: pickupLng }, { withCredentials: true }).then(res => res.data.address),
          axios.post("http://localhost:4000/maps/getfulladdress", { lat: destLat, lng: destLng }, { withCredentials: true }).then(res => res.data.address),
        ]);
        setpickupaddress(pickupAddr);
        setdestinationaddress(destAddr);
        setridedata(data);
        setdeclineride(false);
      } catch (err) { console.error(err); }
    };

    socket.on("newride", newridehandler);
    return () => socket.off("newride", newridehandler);
  }, [socket, captain?._id]);

  return (
    <div className="h-screen w-full bg-white flex flex-col relative overflow-hidden">
      
      {/* 70% SECTION: ACTUAL LIVE MAP */}
      <div className="h-[70%] w-full relative z-0 bg-gray-100">
        {captain?.location ? (
          <LiveMap 
            lat={Number(captain.location.ltd || captain.location.lat)} 
            lng={Number(captain.location.lng || captain.location.lon)} 
            icon={customCaptainIcon} 
            showCircle={true} 
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-500">
            Fetching live location...
          </div>
        )}
        
        {/* Floating Logout */}
        <div className="absolute top-5 right-5 z-[1000]">
          <button className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-lg border">
            <i className="ri-logout-box-r-line text-lg text-gray-700"></i>
          </button>
        </div>
      </div>

      {/* 30% SECTION: DETAILS */}
      <div className="h-[30%] w-full bg-white px-5 py-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-10">
        <Captaindetails setdeclineride={setdeclineride} />
      </div>

      {/* POPUPS (Keep existing code) */}
      <div ref={popupref} className="fixed bottom-0 w-full z-40 translate-y-full opacity-0">
        <div className="bg-white shadow-2xl px-5 py-8 rounded-t-3xl border-t">
          {ridedata && (
            <Ridepopup 
              ridedata={ridedata} 
              pickupaddress={pickupaddress} 
              destinationaddress={destinationaddress} 
              setdeclineride={setdeclineride} 
              setriderequestconfirm={setriderequestconfirm} 
            />
          )}
        </div>
      </div>

      <div ref={rideconfirmref} className="fixed bottom-0 w-full z-50 h-screen translate-y-full">
        <div className="bg-white h-full shadow-2xl px-5 py-8 overflow-y-auto">
          {ridedata && (
            <Confirmridepopup 
              ridedata={ridedata} 
              captain={captain} 
              setriderequestconfirm={setriderequestconfirm} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptainHome;