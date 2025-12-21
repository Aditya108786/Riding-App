import React, { useRef, useState, useEffect, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import { SocketContext } from "../context/socketcontext";
import { UserdataContext } from "../context/usercontext";
import LocationSearch from "../Components/Locationsearch";
import { Confirmvehicle } from "../Components/Confirmedride";
import { Lookingfordriver } from "../Components/Lookingfordriver";
import { MapContainer, TileLayer, Polyline, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { RecenterMap } from "../Components/Recentermap";
import Routing from "../Components/Routing";

// Default icon fix for React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const customPickupIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
});

const customDestinationIcon = new L.Icon({
  iconUrl: markerIcon2x,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
});

const customCaptainIcon = new L.Icon({
  iconUrl: markerIcon2x,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
});

const Userhome = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [hidden, setHidden] = useState(false);
  const panelRef = useRef(null);
  const arrowRef = useRef(null);
  const vehiclepanelref = useRef(null);
  const [vehiclepanel, setvehiclepanel] = useState(true);
  const confirmrideref = useRef(null);
  const [confirmride, setconfirmride] = useState(false);
  const [vehiclefound, setvehiclefound] = useState(false);
  const vehiclefoundref = useRef(null);
  const waitingdriverref = useRef(null);
  const [summary, setsummary] = useState({});

  const pickupInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const [activeInput, setActiveInput] = useState(null);
  const [polyline, setpolyline] = useState([]);
  const [pickuparr, setpickuparray] = useState([]);
  const [destinationarr, setdestinationarray] = useState([]);
  const [autofare, setautofare] = useState(null);
  const [carfare, setcarfare] = useState(null);
  const [bikefare, setbikefare] = useState(null);
  const [selectedvehicle, setvehicleselected] = useState(null);
  const [hidesearchpanel, setthidesearchpanel] = useState(true)
  const { user } = useContext(UserdataContext);
  const { livelocation, socket } = useContext(SocketContext);

  useEffect(() => {
    if (!socket || !user?.user?._id) return;
    const handler = () => {
      socket.emit("join", { userId: user?.user?._id, userType: "user" });
    };
    if (socket.connected) handler();
    else socket.on("connect", handler);
    return () => socket.off("connect", handler);
  }, [socket, user?.user?._id]);

  useGSAP(() => {
    if (confirmride) {
      gsap.to(confirmrideref.current, { y: 0, opacity: 1, height: "auto", duration: 0.5, ease: "power2.out" });
    } else {
      gsap.to(confirmrideref.current, { y: 100, opacity: 0, height: "0%", duration: 0.4, ease: "power2.in" });
    }
  }, [confirmride]);

  useGSAP(() => {
    if (vehiclefound) {
      gsap.to(vehiclefoundref.current, { y: 0, opacity: 1, height: "auto", duration: 0.5, ease: "power2.out" });
    } else {
      gsap.to(vehiclefoundref.current, { y: 100, opacity: 0, height: "0%", duration: 0.4, ease: "power2.in" });
    }
  }, [vehiclefound]);

  const fetchFares = async (type, setter) => {
    if (pickuparr.length === 0 || destinationarr.length === 0) return;
    try {
      const res = await axios.post("http://localhost:4000/ride/getfare",
        { pickup: pickuparr, destination: destinationarr, vehicleType: type },
        { withCredentials: true }
      );
      setter(res.data);
    } catch (err) { console.error(`Error fetching ${type} fare`, err); }
  };

  useEffect(() => { fetchFares("auto", setautofare); }, [pickuparr, destinationarr]);
  useEffect(() => { fetchFares("car", setcarfare); }, [pickuparr, destinationarr]);
  useEffect(() => { fetchFares("bike", setbikefare); }, [pickuparr, destinationarr]);

  const selectvehicle = async (vehicleType) => {
    try {
      await axios.post("http://localhost:4000/ride/createride",
        { pickup: pickuparr, destination: destinationarr, vehicleType },
        { withCredentials: true }
      );
    } catch (err) { console.error("Error creating ride:", err); }
  };

  const MapControl = ({ deps = [] }) => {
    const map = useMap();
    useEffect(() => {
      if (!map) return;
      const points = [];
      if (pickuparr.length > 0) points.push([pickuparr[1], pickuparr[0]]);
      if (destinationarr.length > 0) points.push([destinationarr[1], destinationarr[0]]);
      if (livelocation?.lat) points.push([livelocation.lat, livelocation.lng]);

      if (points.length > 1) {
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [map, ...deps]);
    return null;
  };

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gray-100 flex flex-col md:flex-row">

      {/* 1. BACKGROUND MAP LAYER */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[25.123416, 75.824687]}
          zoom={15}
          zoomControl={false}
          attributionControl={false}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {pickuparr.length > 0 && destinationarr.length > 0 && <Routing pickup={pickuparr} destination={destinationarr} />}
          {pickuparr.length > 0 && <Marker position={[pickuparr[1], pickuparr[0]]} icon={customPickupIcon} />}
          {destinationarr.length > 0 && <Marker position={[destinationarr[1], destinationarr[0]]} icon={customDestinationIcon} />}
          {polyline.length > 0 && <Polyline positions={polyline} pathOptions={{ color: "black", weight: 5 }} />}
          {livelocation && <Marker position={[livelocation.lat, livelocation.lng]} icon={customCaptainIcon} />}
          <MapControl deps={[pickuparr, destinationarr, livelocation]} />
        </MapContainer>
      </div>

      {/* 2. FLOATING UI LAYER */}
      <div className="relative z-10 h-full w-full pointer-events-none flex flex-col items-center md:items-start">
        
        {hidesearchpanel && (
          <div className="p-4 pt-6 md:pt-10 w-full max-w-lg pointer-events-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-5 md:p-6 relative border border-gray-100">
              <div className="flex flex-col gap-3 relative">
                {/* Connector line UI */}
                <div className="absolute left-[18px] top-6 w-[2px] h-12 bg-gray-200"></div>

                <div className="relative">
                  <i className="ri-checkbox-blank-circle-fill absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400"></i>
                  <input
                    ref={pickupInputRef}
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    onFocus={() => setActiveInput('pickup')}
                    className="w-full bg-gray-100 pl-10 pr-4 py-3 rounded-xl text-sm focus:bg-white border-2 border-transparent focus:border-black outline-none transition-all"
                    placeholder="Enter pickup location"
                  />
                </div>

                <div className="relative">
                  <i className="ri-map-pin-2-fill absolute left-4 top-1/2 -translate-y-1/2 text-sm text-black"></i>
                  <input
                    ref={destinationInputRef}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onFocus={() => setActiveInput('destination')}
                    className="w-full bg-gray-100 pl-10 pr-4 py-3 rounded-xl text-sm focus:bg-white border-2 border-transparent focus:border-black outline-none transition-all"
                    placeholder="Where to?"
                  />
                </div>
              </div>

              <LocationSearch
                pickup={pickup} destination={destination} setHidden={setHidden}
                vehiclepanel={vehiclepanel} setvehiclepanel={setvehiclepanel}
                setpolyline={setpolyline} setsummary={setsummary}
                setpickuparray={setpickuparray} setdestinationarray={setdestinationarray}
                pickupRef={pickupInputRef} destinationRef={destinationInputRef}
                activeInput={activeInput} setActiveInput={setActiveInput}
                setPickupValue={setPickup} setDestinationValue={setDestination}
                setthidesearchpanel={setthidesearchpanel}
              />
            </div>
          </div>
        )}

        {/* Bottom Panel Section - Responsive positioning */}
        <div className="w-full max-w-lg md:ml-4 pointer-events-auto mt-auto mb-0 md:mb-4">

          {/* Vehicle Selection List */}
          <div ref={vehiclepanelref} hidden={vehiclepanel} className="bg-white rounded-t-3xl md:rounded-3xl p-5 shadow-2xl overflow-y-auto max-h-[50vh] md:max-h-[60vh]">
            <div onClick={() => setvehiclepanel(true)} className="w-full flex justify-center mb-4 cursor-pointer">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            <div className="space-y-3">
              {[
                { type: 'auto', label: 'Uber Auto', fare: autofare, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9RntYUpvf9byeBaiKfcrMdoh_IeZqDeEW8w&s' },
                { type: 'car', label: 'UberGo', fare: carfare, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9RntYUpvf9byeBaiKfcrMdoh_IeZqDeEW8w&s' },
                { type: 'bike', label: 'Moto', fare: bikefare, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9RntYUpvf9byeBaiKfcrMdoh_IeZqDeEW8w&s' }
              ].map((v) => (
                <div key={v.type} onClick={() => { setvehicleselected(v.type); setconfirmride(true); setvehiclepanel(true); }}
                  className="flex border-2 border-gray-100 hover:border-black rounded-2xl p-3 items-center cursor-pointer transition-all bg-white">
                  <img className="h-12 w-16 md:h-14 md:w-20 object-contain" src={v.img} alt={v.label} />
                  <div className="ml-4 flex-1">
                    <h4 className="font-bold text-base md:text-lg">{v.label} <i className="ri-user-3-fill text-xs"></i></h4>
                    <p className="text-xs text-gray-500 font-medium">Fast, affordable rides</p>
                  </div>
                  <h2 className="text-lg md:text-xl font-bold">₹{v.fare}</h2>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm Ride Panel */}
          <div ref={confirmrideref} className="fixed left-0 md:left-4 bottom-0 md:bottom-4 w-full md:max-w-lg z-50 bg-white rounded-t-3xl md:rounded-3xl px-4 py-4 shadow-2xl transform translate-y-full opacity-0 pointer-events-auto">
            <Confirmvehicle
              setvehiclefound={setvehiclefound} pickup={pickup} destination={destination}
              setconfirmride={setconfirmride} fares={{ car: carfare, bike: bikefare, auto: autofare }}
              selectedvehicle={selectedvehicle} selectvehicle={selectvehicle}
            />
          </div>

          {/* Looking for Driver Panel */}
          <div ref={vehiclefoundref} hidden={!vehiclefound} className="fixed left-0 md:left-4 bottom-0 md:bottom-4 w-full md:max-w-lg z-50 bg-white rounded-t-3xl md:rounded-3xl px-4 py-4 shadow-2xl pointer-events-auto">
            <Lookingfordriver setvehiclefound={setvehiclefound} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userhome;