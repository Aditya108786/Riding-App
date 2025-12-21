import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet"
import "leaflet-routing-machine";

const Routing = ({pickup , destination})=>{
         const map = useMap()

         useEffect(()=>{
                 if(!pickup || !destination){
                    return
                 }

                 const routingcontrol = L.Routing.control({
                    waypoints:[
                         L.latLng(pickup[1] , pickup[0]),
                         L.latLng(destination[1] , destination[0])
                    ],
                    
                       lineOptions: {
        styles: [{ color: "blue", weight: 6 }],
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
                 }).addTo(map)
        
        
        return ()=> map.removeControl(routingcontrol)
                },[pickup , destination ,map])

           return null
}

export default Routing

