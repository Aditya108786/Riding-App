import axios from "axios";
import React, { useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import { CaptaindataContext } from "../context/captaincontext";
import { useToast } from "./Toast";
import { buildServiceUrl } from "../lib/serviceUrl";

const Finishride = (props) => {
  const navigate = useNavigate();
  const { currentRide, setCurrentRide } = useContext(CaptaindataContext);
  const [loading, setLoading] = useState(false);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const toast = useToast();

  const riderName = useMemo(() => {
    const user = currentRide?.user || currentRide?.ridewithuser?.user;
    const first = user?.fullname?.firstname || "Rider";
    const last = user?.fullname?.lastname || "";
    return `${first} ${last}`.trim();
  }, [currentRide]);

  const pickupText = useMemo(() => {
    const pickup = currentRide?.pickup;
    if (Array.isArray(pickup) && pickup.length === 2) {
      return `${pickup[1]}, ${pickup[0]}`;
    }
    return "Pickup location";
  }, [currentRide]);

  const dropText = useMemo(() => {
    const destination = currentRide?.destination;
    if (Array.isArray(destination) && destination.length === 2) {
      return `${destination[1]}, ${destination[0]}`;
    }
    return "Drop location";
  }, [currentRide]);

  const fareText = useMemo(() => {
    const fare = currentRide?.fare || currentRide?.ridewithuser?.fare;
    return fare != null ? `Rs ${fare}` : "Fare";
  }, [currentRide]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!currentRide?.pickup || !currentRide?.destination) return;
      const [pickupLng, pickupLat] = currentRide.pickup;
      const [destLng, destLat] = currentRide.destination;
      try {
        const [pickupRes, destRes] = await Promise.all([
          axios.post(
            buildServiceUrl('/maps/getfulladdress'),
            { lat: pickupLat, lng: pickupLng },
            { withCredentials: true }
          ),
          axios.post(
            buildServiceUrl('/maps/getfulladdress'),
            { lat: destLat, lng: destLng },
            { withCredentials: true }
          )
        ]);
        setPickupAddress(pickupRes.data.address);
        setDropAddress(destRes.data.address);
      } catch (err) {
        console.error("address fetch error", err);
      }
    };
    fetchAddresses();
  }, [currentRide?.pickup, currentRide?.destination]);

  const finishRide = async () => {
    if (!currentRide?._id) return;

    setLoading(true);
    try {
      const res = await axios.post(
        buildServiceUrl('/ride/endride'),
        { rideId: currentRide._id },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Ride completed");
        setCurrentRide(null);
        navigate("/CaptainHome");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to finish ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-t-3xl bg-white p-6 shadow-2xl">
      <div className="flex justify-center mb-4" onClick={() => props.setfinishride(false)}>
        <div className="w-14 h-1.5 bg-gray-300 rounded-full"></div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={currentRide?.user?.profilePic || "https://randomuser.me/api/portraits/men/45.jpg"}
          alt="rider"
          className="w-14 h-14 rounded-full border object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{riderName}</h3>
          <p className="text-sm text-gray-500">Ride completed successfully</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-start gap-3">
          <i className="ri-map-pin-2-fill text-green-600 text-xl"></i>
          <div>
            <h4 className="font-medium text-gray-800">Pickup</h4>
            <p className="text-sm text-gray-500">{pickupAddress || pickupText}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <i className="ri-map-pin-2-fill text-red-500 text-xl"></i>
          <div>
            <h4 className="font-medium text-gray-800">Drop</h4>
            <p className="text-sm text-gray-500">{dropAddress || dropText}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <i className="ri-currency-line text-yellow-500 text-xl"></i>
          <div>
            <h4 className="font-medium text-gray-800">Fare</h4>
            <p className="text-sm text-gray-500">{fareText} | Cash Payment</p>
          </div>
        </div>
      </div>

      <button
        onClick={finishRide}
        disabled={loading || !currentRide?._id}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition-all"
      >
        {loading ? "Finishing..." : "Finish Ride"}
      </button>
    </div>
  );
};

export default Finishride;
