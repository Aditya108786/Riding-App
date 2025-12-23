import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SocketContext } from "../context/socketcontext";
import LiveMap from "./LiveMap";
import { useNavigate } from "react-router-dom";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Ridingcontext } from "../context/Ridingcontext";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import L from 'leaflet';
import { Sendmessage } from "./Sendmessage";


const customCaptainIcon = new L.Icon({
  iconUrl: markerIcon2x,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
});

export const Lookingfordriver = (props) => {
  const { setlivelocation, livelocation, socket } = useContext(SocketContext);
  const { setridingdata } = useContext(Ridingcontext);
  const [ridestatus, setridestatus] = useState({});
  const [fullAddress, setFullAddress] = useState("");
  const [roomid , setroomid] = useState(null)
  const navigate = useNavigate();
  const [messagepanel , setmessagepanel] = useState(false)

  const messageref = useRef()

  // Handle ride-confirmed event and set initial driver location + details
  useEffect(() => {
    const handler = async (data) => {
      console.log("ride status update", data);
      setridestatus(data);

      if (data?.ride?.status === "Accepted") {
        const lng = data?.ride?.captain?.location?.lng ?? data?.ride?.captain?.location?.lon;
        const lat = data?.ride?.captain?.location?.ltd ?? data?.ride?.captain?.location?.lat;
        if (lat != null && lng != null) setlivelocation({ lat, lng });

        try {
          if (props?.setvehiclefound) props.setvehiclefound(true);
        } catch (e) { /* ignore */ }

        try {
          if (lat != null && lng != null) {
            const response = await axios.post(
              "http://localhost:4000/maps/getfulladdress",
              { lat, lng },
              { withCredentials: true }
            );
            setFullAddress(response.data.address);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    socket?.on("ride-confirmed", handler);
    return () => socket?.off("ride-confirmed", handler);
  }, [socket, setlivelocation, props]);


  useEffect(()=>{
      
       console.log("hello jiiii babu")
    socket.on("start:chat" , (roomId)=>{
          setroomid(roomId)
         socket.emit("start:chat-room" , 
          roomId
         )
    })
    

  },[socket])

  

  useEffect(() => {
    const handler = (data) => {
      console.log("ridestarted bro", data);
      setridingdata(data);
      navigate("/user-riding");
    };
    socket.on("ride-started", handler);
    return () => {
      socket.off("ride-started", handler);
    };
  }, [socket]);

  // Listen for continuous captain location updates and update map + address
  useEffect(() => {
    const liveHandler = async (data) => {
      const loc = data?.location || data;
      const lat = loc?.ltd ?? loc?.lat ?? null;
      const lng = loc?.lng ?? loc?.lon ?? null;
      if (lat != null && lng != null) {
        setlivelocation({ lat, lng });
        try {
          const response = await axios.post(
            "http://localhost:4000/maps/getfulladdress",
            { lat, lng },
            { withCredentials: true }
          );
          setFullAddress(response.data.address);
        } catch (err) {
          console.log(err);
        }
      }
    };

    socket?.on("captain-live-location", liveHandler);
    return () => socket?.off("captain-live-location", liveHandler);
  }, [socket, setlivelocation]);


  

  return (
    <div className="w-full h-full flex flex-col max-h-[90vh] md:max-h-screen">
      {/* Drag handle/header */}
      <div className="py-2 px-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="w-12 mx-auto h-1.5 rounded-full bg-gray-300"></div>
        <button onClick={() => props.setvehiclefound(false)} className="text-gray-600 absolute right-4">
          <i className="ri-close-line text-2xl"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        {/* Status */}
        <div className="px-6 mb-4 text-center">
          <h3 className="text-xl md:text-2xl font-semibold">
            {ridestatus?.ride?.status !== "Accepted" ? "Looking for a driver..." : "Driver Found!"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {ridestatus?.message || (ridestatus?.ride?.status === "Accepted" ? "Driver is on the way" : "Searching nearby captains")}
          </p>
        </div>

        {/* Map area */}
        <div className="px-4 md:px-6">
          <div className="h-48 sm:h-56 md:h-64 w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {livelocation ? (
              <LiveMap lat={Number(livelocation.lat)} lng={Number(livelocation.lng)} icon={customCaptainIcon} showCircle={true} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-400 p-4 text-center">
                 <i className="ri-map-2-line text-3xl mb-2"></i>
                 <span className="text-xs md:text-sm">Map will appear once a driver is assigned</span>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-4 px-4 md:px-6">
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-4">
              <img 
                className="h-14 w-14 md:h-16 md:w-16 rounded-full object-cover border-2 border-gray-100" 
                src={ridestatus?.ride?.captain?.profilePic || "https://www.gravatar.com/avatar?d=mp&s=120"} 
                alt="driver" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-base md:text-lg font-bold truncate">
                      {ridestatus?.ride?.captain?.fullname?.firstname || "Driver"}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-500 truncate">
                      {ridestatus?.ride?.captain?.vehicle?.name || "Vehicle"} • {ridestatus?.ride?.captain?.vehicle?.plate || "-"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="bg-yellow-400 text-black px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-bold shadow-sm">
                      OTP: {ridestatus?.ride?.OTP || "----"}
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-500 mt-1 uppercase font-bold tracking-tight">
                      ETA: {ridestatus?.ride?.eta || "--"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <div className="flex items-center gap-2 text-gray-400">
                    <i className="ri-map-pin-user-fill text-black"></i>
                    <p className="text-xs md:text-sm font-semibold text-gray-800">Current location</p>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 line-clamp-2 pl-6 italic">
                    {fullAddress || "Determining driver location..."}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              <a 
                href={`tel:${ridestatus?.ride?.captain?.phone || ""}`} 
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 active:bg-green-700 text-white py-2.5 rounded-xl text-sm md:text-base font-bold transition-all shadow-md shadow-green-100"
              >
                <i className="ri-phone-fill"></i> Call
              </a>
              <button 
                onClick={() => setmessagepanel(true)} 
                className="flex-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-black py-2.5 rounded-xl text-sm md:text-base font-bold transition-all"
              >
                Message
              </button>

              {
                messagepanel && (
<div ref={messageref}>
               <Sendmessage roomid={roomid} />
              </div>
                )
              }
              
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};