import axios from "axios";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import { Ridingcontext } from "../context/Ridingcontext";
import { CaptaindataContext } from "../context/captaincontext";
import {SocketContext} from "../context/socketcontext"

const Finishride = (props) => {
  const navigate = useNavigate();
   const {ridingdata} = useContext(Ridingcontext)
    const { currentRide } = useContext(CaptaindataContext);
   console.log("hello brooooo",currentRide)


   const navigatetohome = ()=>{
       navigate("/CaptainHome")
   }

  const FinishRide = async()=>{
       const res = await axios.post("http://localhost:4000/ride/endride" ,{
          rideId:currentRide._id   
       },
       {
        withCredentials:true
       }
      )

      if(res.status == 200){
            console.log("ride finished",res.data)
      }
  }

  return (
    <div className="w-full rounded-t-3xl bg-white p-6 shadow-2xl">

      {/* DRAG HANDLE */}
      <div
        className="flex justify-center mb-4"
        onClick={() => props.setfinishride(false)}
      >
        <div className="w-14 h-1.5 bg-gray-300 rounded-full"></div>
      </div>

      {/* RIDER HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src="https://randomuser.me/api/portraits/men/45.jpg"
          alt="rider"
          className="w-14 h-14 rounded-full border object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Rahul Verma
          </h3>
          <p className="text-sm text-gray-500">
            Ride completed successfully
          </p>
        </div>
      </div>

      {/* RIDE DETAILS */}
      <div className="flex flex-col gap-4 mb-6">

        {/* PICKUP */}
        <div className="flex items-start gap-3">
          <i className="ri-map-pin-2-fill text-green-600 text-xl"></i>
          <div>
            <h4 className="font-medium text-gray-800">Pickup</h4>
            <p className="text-sm text-gray-500">
              Sector 15, Gurugram
            </p>
          </div>
        </div>

        {/* DROP */}
        <div className="flex items-start gap-3">
          <i className="ri-map-pin-2-fill text-red-500 text-xl"></i>
          <div>
            <h4 className="font-medium text-gray-800">Drop</h4>
            <p className="text-sm text-gray-500">
              IGI Airport, Delhi
            </p>
          </div>
        </div>

        {/* FARE */}
        <div className="flex items-start gap-3">
          <i className="ri-currency-line text-yellow-500 text-xl"></i>
          <div>
            <h4 className="font-medium text-gray-800">Fare</h4>
            <p className="text-sm text-gray-500">
              ₹380 • Cash Payment
            </p>
          </div>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <button
        onClick={ ()=>{
          FinishRide()
          navigatetohome()
        }
        }

        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition-all"
      >
        Finish Ride
      </button>
    </div>
  );
};

export default Finishride;
