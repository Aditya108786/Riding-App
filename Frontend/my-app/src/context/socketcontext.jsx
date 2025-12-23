import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [livelocation , setlivelocation] = useState(null)
  const [roomId , setroomid] = useState("")

  console.log("room id in the socket context" , roomId)

  useEffect(() => {
    const newsocket = io("http://localhost:4000");
    setSocket(newsocket); // ✅ store it in state

    newsocket.on("connect", () => {
      console.log(`client connected ${newsocket.id}`);
    });

    newsocket.on("disconnect", () => {
      console.log(`client disconnected ${newsocket.id}`);
    });

    // Listen for captain live location and update shared state so any page can show it
    const captainHandler = (data) => {
      try {
        // data may be { location: { ltd, lng } } or { lat, lng }
        const loc = data?.location || data;
        const lat = loc?.ltd ?? loc?.lat ?? null;
        const lng = loc?.lng ?? loc?.lon ?? loc?.longitude ?? null;
        if (lat != null && lng != null) {
          setlivelocation({ lat, lng });
          console.log("updated livelocation from socket:", { lat, lng });
        } else {
          console.warn("captain-live-location payload missing coords", data);
        }
      } catch (err) {
        console.error("Error handling captain-live-location", err);
      }
    };

    newsocket.on("captain-live-location", captainHandler);

    return () => {
      newsocket.off("captain-live-location", captainHandler);
      newsocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{socket , livelocation , setlivelocation , setroomid , roomId}}>
      {children}
    </SocketContext.Provider>
  );
};
