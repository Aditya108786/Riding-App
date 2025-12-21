import { useMap } from "react-leaflet";
import { useEffect } from "react";

export const RecenterMap = ({ coords }) => {
  const map = useMap();

  useEffect(() => {
    if (coords && coords.length === 2) {
      map.setView([coords[1], coords[0]], 13, { animate: true });
    }
  }, [coords]);

  return null;
};
