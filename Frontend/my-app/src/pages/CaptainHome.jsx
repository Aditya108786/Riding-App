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
  const [rideconfirmMinimized, setrideconfirmMinimized] = useState(false);
  const [ridedata, setridedata] = useState(null);
  const [pickupaddress, setpickupaddress] = useState("");
  const [destinationaddress, setdestinationaddress] = useState("");
  const [livelocation , setLivelocation] = useState(null)
  const popupref = useRef(null);
  const rideconfirmref = useRef(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptaindataContext);
  
  console.log(captain)
  console.log(ridedata)

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

  

  useEffect(()=>{
     
    if(!captain || !socket){
         return
    }
      
    const watchId = navigator.geolocation.watchPosition((position)=>{
                  
          
          
              setLivelocation({
                lat:position.coords.latitude,
                lng:position.coords.longitude
              })
    },
    (error)=>{
       console.error("Location error" , error)
    },

    {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
  
  
  )

  return ()=>{
     navigator.geolocation.clearWatch(watchId)
  }


  },[captain,socket])
 console.log(livelocation)

 useEffect(()=>{
       if(!socket || !livelocation){
         return;
       }

       socket.emit("captain-location-update" , {
              captainId:captain._id,
             lat:livelocation.lat,
             lng:livelocation.lng
       })
 },[socket,livelocation])

  useEffect(()=>{
    if(!socket || !captain?._id || !livelocation || !riderequestconfirm || !ridedata?.ride?._id){
      return;
    }

    socket.emit("captain-location" , {
      captainId:captain._id,
      rideId:ridedata.ride._id,
      lat:livelocation.lat,
      lng:livelocation.lng
    })
  },[livelocation , captain?._id , socket, riderequestconfirm, ridedata?.ride?._id])



  useEffect(() => {
    if (!socket || !captain?._id) return;
    socket.emit("join", { userId: captain._id, userType: "captain" });

    const newridehandler = async (data) => {
      //console.log("hey hey",data)
      const [pickupLng, pickupLat] = data.ride.pickup;

      const [destLng, destLat] = data.ride.destination;
      try {
        const [pickupAddr, destAddr] = await Promise.all([
          axios.post(`${import.meta.env.VITE_BASE_URL}/maps/getfulladdress`, { lat: pickupLat, lng: pickupLng }, { withCredentials: true }).then(res => res.data.address),
          axios.post(`${import.meta.env.VITE_BASE_URL}/maps/getfulladdress`, { lat: destLat, lng: destLng }, { withCredentials: true }).then(res => res.data.address),
        ]);
        setpickupaddress(pickupAddr);
        setdestinationaddress(destAddr);
        setridedata(data);
        console.log(data)
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
        {livelocation? (
          <LiveMap 
            lat={Number(livelocation.lat)} 
            lng={Number(livelocation.lng)} 
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

      <div ref={rideconfirmref} className={`fixed bottom-0 w-full z-50 h-screen translate-y-full ${rideconfirmMinimized ? "pointer-events-none" : ""}`} hidden={!riderequestconfirm || rideconfirmMinimized}>
        <div className="bg-white h-full shadow-2xl px-5 py-8 overflow-y-auto">
          {ridedata && (
            <Confirmridepopup 
              ridedata={ridedata} 
              captain={captain} 
              setriderequestconfirm={setriderequestconfirm} 
              onMinimize={() => setrideconfirmMinimized(true)}
            />
          )}
        </div>
      </div>

      {riderequestconfirm && rideconfirmMinimized && (
        <button
          onClick={() => setrideconfirmMinimized(false)}
          className="fixed left-1/2 -translate-x-1/2 bottom-4 z-50 bg-black text-white px-5 py-3 rounded-full shadow-lg pointer-events-auto flex items-center gap-3 w-[90%] max-w-lg"
        >
          <i className="ri-arrow-up-s-line text-xl"></i>
          <span className="text-sm font-semibold">Confirm Ride (tap to expand)</span>
        </button>
      )}
    </div>
  );
};

export default CaptainHome;
