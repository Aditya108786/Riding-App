import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import polyline from "@mapbox/polyline";

const LocationSearch = ({
  pickup, destination, vehiclepanel, setvehiclepanel, setHidden, setsummary, setpolyline,
  setpickuparray, setdestinationarray,
  pickupRef, destinationRef, activeInput, setActiveInput, setPickupValue, setDestinationValue,setthidesearchpanel
}) => {
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [portalStyle, setPortalStyle] = useState(null);
  const portalNode = useRef(null);

  const [arrpickup, setarrpickup] = useState([]);
  const [arrdestination, setarrdestination] = useState([]);

  // Calculate position for the portal relative to the active input field
  const updatePortalPosition = () => {
    const ref = activeInput === 'pickup' ? pickupRef?.current : activeInput === 'destination' ? destinationRef?.current : null;
    
    if (!ref) {
      setPortalStyle(null);
      return;
    }

    const r = ref.getBoundingClientRect();
    
    setPortalStyle({
      position: 'fixed',
      left: `${r.left}px`,
      top: `${r.bottom + 10}px`,
      width: `${r.width}px`,
      zIndex: 999999, // Ensure it's above Leaflet (usually z-1000)
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      pointerEvents: 'auto',
      maxHeight: '300px',
      overflowY: 'auto',
      border: '1px solid #f3f4f6'
    });
  };

  useEffect(() => {
    if (!activeInput) {
      setPortalStyle(null);
      return;
    }

    updatePortalPosition();
    window.addEventListener('resize', updatePortalPosition);
    window.addEventListener('scroll', updatePortalPosition, true);

    return () => {
      window.removeEventListener('resize', updatePortalPosition);
      window.removeEventListener('scroll', updatePortalPosition, true);
    };
  }, [activeInput]);

  // Handle outside clicks to close suggestions
  useEffect(() => {
    const onDocDown = (e) => {
      if (portalNode.current?.contains(e.target) || 
          pickupRef.current?.contains(e.target) || 
          destinationRef.current?.contains(e.target)) {
        return;
      }
      setActiveInput(null);
    };
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, [activeInput]);

  // Fetch Logic for Pickup
  useEffect(() => {
    const fetchPickup = async () => {
      if (!pickup || pickup.trim().length < 3) return setPickupSuggestions([]);
      try {
        const res = await axios.get("https://api.openrouteservice.org/geocode/autocomplete", {
          params: {
            api_key: import.meta.env.VITE_ORS_API_KEY,
            text: pickup.trim(),
            "boundary.country": "IN",
          },
        });
        const results = res.data.features.map((f) => ({
          label: f.properties.label,
          name: f.properties.name,
          region: f.properties.locality || f.properties.region || "",
          coordinates: f.geometry.coordinates
        }));
        setPickupSuggestions(results);
      } catch (err) { console.error("Pickup fetch error:", err); }
    };
    fetchPickup();
  }, [pickup]);

  // Fetch Logic for Destination
  useEffect(() => {
    const fetchDest = async () => {
      if (!destination || destination.trim().length < 3) return setDestinationSuggestions([]);
      try {
        const res = await axios.get("https://api.openrouteservice.org/geocode/autocomplete", {
          params: {
            api_key: import.meta.env.VITE_ORS_API_KEY,
            text: destination.trim(),
            "boundary.country": "IN",
          },
        });
        const results = res.data.features.map((f) => ({
          label: f.properties.label,
          name: f.properties.name,
          region: f.properties.locality || f.properties.region || "",
          coordinates: f.geometry.coordinates
        }));
        setDestinationSuggestions(results);
      } catch (err) { console.error("Destination fetch error:", err); }
    };
    fetchDest();
  }, [destination]);

  // Polyline Logic: Decodes geometry when both points exist
  useEffect(() => {
    const getRoute = async () => {
      if (!arrpickup.length || !arrdestination.length) return;
      try {
        const response = await axios.post("http://localhost:4000/maps/distancetime",
          { arrpickup, arrdestination },
          { withCredentials: true }
        );
        const decoded = polyline.decode(response.data[0].geometry);
        setpolyline(decoded);
        setsummary(response.data[0].summary);
      } catch (err) { console.error("Route error:", err); }
    };
    getRoute();
  }, [arrpickup, arrdestination]);

  const renderSuggestions = (suggestions, type) => {
    if (!suggestions.length) return null;

    return createPortal(
      <div ref={portalNode} style={portalStyle} className="bg-white overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b">
          <i className={type === 'pickup' ? "ri-map-pin-2-fill text-[#00b37d]" : "ri-navigation-fill text-[#007aff]"}></i>
          {type} suggestions
        </div>
        
        {suggestions.map((s, idx) => (
          <div
            key={idx}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (type === 'pickup') {
                setarrpickup(s.coordinates);
                setpickuparray(s.coordinates);
                setPickupValue(s.label);
              } else {
                setarrdestination(s.coordinates);
                setdestinationarray(s.coordinates);
                setDestinationValue(s.label);
                setvehiclepanel(false); // Open vehicle panel on destination select
                setHidden(false);
                setthidesearchpanel(false)
              }
              setActiveInput(null);
            }}
            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
          >
            <i className="ri-map-pin-range-line mt-1 text-gray-400"></i>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800 text-sm">{s.name}</span>
              <span className="text-xs text-gray-500 truncate">{s.region || s.label}</span>
            </div>
          </div>
        ))}
      </div>,
      document.body
    );
  };

  return (
    <>
      {activeInput === 'pickup' && renderSuggestions(pickupSuggestions, 'pickup')}
      {activeInput === 'destination' && renderSuggestions(destinationSuggestions, 'destination')}
    </>
  );
};

export default LocationSearch;