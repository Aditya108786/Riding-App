import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/socketcontext";

const RideChat = ({ roomId, sender, title }) => {
  const { socket } = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const onMessage = (data) => {
      if (!roomId || data?.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receive:message", onMessage);
    return () => socket.off("receive:message", onMessage);
  }, [socket, roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!socket || !roomId || !message.trim()) return;

    const payload = {
      roomId,
      sender,
      message: message.trim(),
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send:message", payload);
    setMessage("");
  };

  return (
    <div className="w-full h-full flex flex-col">
      {!isMinimized ? (
        <div className="w-full h-full bg-white/95 border-t shadow-xl rounded-t-2xl flex flex-col">
          <div className="p-3 border-b font-semibold flex items-center justify-between">
            <span>{title}</span>
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="text-gray-600"
              aria-label="Minimize chat"
            >
              <i className="ri-subtract-line text-xl"></i>
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={`${msg?.time || "msg"}-${idx}`}
                className={`flex ${msg.sender === sender ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${
                    msg.sender === sender
                      ? "bg-black text-white rounded-br-none"
                      : "bg-gray-200 text-black rounded-bl-none"
                  }`}
                >
                  {msg.message}
                  <div className="text-[10px] opacity-60 text-right mt-1">{msg.time}</div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 p-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full bg-gray-100 outline-none"
            />
            <button type="submit" className="bg-black text-white px-4 py-2 rounded-full">
              Send
            </button>
          </form>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <button
            onClick={() => setIsMinimized(false)}
            className="absolute right-4 bottom-4 bg-black text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
            aria-label="Maximize chat"
          >
            <i className="ri-arrow-up-s-line text-xl"></i>
            <span className="text-sm font-semibold">Chat</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RideChat;
