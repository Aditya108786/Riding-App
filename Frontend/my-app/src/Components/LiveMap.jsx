import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* 🔥 FIX: Leaflet marker icons for React/Vite */
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LiveMap = ({
  lat,
  lng,
  pickup,
  destination,
  icon = null,
  showCircle = true,
  showRoute = true,
}) => {
  const mapRef = useRef(null);
  const map = useRef(null);

  const liveMarker = useRef(null);
  const pickupMarker = useRef(null);
  const destMarker = useRef(null);
  const routeLine = useRef(null);

  /* Normalize coords */
  const norm = (p) =>
    Array.isArray(p) && p.length === 2
      ? [Number(p[0]), Number(p[1])]
      : null;

  /* INIT MAP */
  useEffect(() => {
    if (map.current) return;

    map.current = L.map(mapRef.current).setView([lat, lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map.current);

    setTimeout(() => map.current.invalidateSize(), 0);
  }, []);

  /* UPDATE MARKERS + ROUTE */
  useEffect(() => {
    if (!map.current) return;

    const live = [Number(lat), Number(lng)];
    const p = norm(pickup);
    const d = norm(destination);

    /* Current location marker */
    if (!isNaN(live[0]) && !isNaN(live[1])) {
  if (!liveMarker.current) {
    liveMarker.current = L.marker(live, icon ? { icon } : {})
      .addTo(map.current)
      .bindTooltip("Captain", {
        permanent: true,   // always visible
        direction: "top",  // label appears above marker
        offset: [0, -10],  // move slightly above marker
      });

    if (showCircle) {
      L.circleMarker(live, {
        radius: 8,
        color: "#2563eb",
        fillColor: "#2563eb",
        fillOpacity: 0.4,
      }).addTo(map.current);
    }
  } else {
    liveMarker.current.setLatLng(live);
  }
}


    /* Pickup */
   if (p) {
  if (!pickupMarker.current) {
    pickupMarker.current = L.marker(p)
      .addTo(map.current)
      .bindTooltip("Pickup", {
        permanent: true,    // always visible
        direction: "top",   // appears above marker
        offset: [0, -10],   // slightly above marker
        className: "pickup-label" // optional for styling
      })
      .openTooltip(); // ensure tooltip shows immediately

    // Optional green circle around pickup
    L.circleMarker(p, {
      radius: 7,
      color: "#16a34a",
      fillColor: "#16a34a",
      fillOpacity: 0.8,
    }).addTo(map.current);
  } else {
    pickupMarker.current.setLatLng(p);
  }
}


    /* Destination */
    if (d) {
  if (!destMarker.current) {
    destMarker.current = L.marker(d)
      .addTo(map.current)
      .bindTooltip("Destination", {
        permanent: true,    // always visible
        direction: "top",   // appears above marker
        offset: [0, -10],   // slightly above marker
        className: "destination-label" // optional CSS class
      })
      .openTooltip(); // ensure tooltip shows immediately

    // Optional red circle around destination
    L.circleMarker(d, {
      radius: 7,
      color: "#dc2626",
      fillColor: "#dc2626",
      fillOpacity: 0.8,
    }).addTo(map.current);
  } else {
    destMarker.current.setLatLng(d);
  }
}


    /* REAL ROAD ROUTE (OSRM) */
    if (p && d && showRoute) {
      fetch(
        `https://router.project-osrm.org/route/v1/driving/${p[1]},${p[0]};${d[1]},${d[0]}?overview=full&geometries=geojson`
      )
        .then((res) => res.json())
        .then((data) => {
          const coords = data.routes[0].geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          );

          if (!routeLine.current) {
            routeLine.current = L.polyline(coords, {
              color: "#2563eb",
              weight: 4,
            }).addTo(map.current);
          } else {
            routeLine.current.setLatLngs(coords);
          }

          map.current.fitBounds(routeLine.current.getBounds(), {
            padding: [60, 60],
          });
        });
    }
  }, [lat, lng, pickup, destination, icon, showCircle, showRoute]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "15px 15px 0 0",
      }}
    />
  );
};

export default LiveMap;
