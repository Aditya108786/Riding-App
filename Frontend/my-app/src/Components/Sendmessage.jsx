import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/socketcontext";

export const Sendmessage = ({ roomid }) => {
  const { socket } = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handler = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive:message", handler);

    return () => {
      socket.off("receive:message", handler);
    };
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const payload = {
      roomId: roomid,
      sender: "user",
      message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send:message", payload);
   // setMessages((prev) => [...prev, payload]);
    setMessage("");
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-xl rounded-t-2xl">
      {/* Header */}
      <div className="p-3 border-b font-semibold">
        Chat with Captain
      </div>

      {/* Messages */}
      <div className="h-48 overflow-y-auto p-3 space-y-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${
                msg.sender === "user"
                  ? "bg-black text-white rounded-br-none"
                  : "bg-gray-200 text-black rounded-bl-none"
              }`}
            >
              {msg.message}
              <div className="text-[10px] opacity-60 text-right mt-1">
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2 p-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-100 outline-none"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
      </form>
    </div>
  );
};
