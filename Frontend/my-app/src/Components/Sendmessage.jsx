import RideChat from "./RideChat";

export const Sendmessage = ({ roomid }) => {
  return <RideChat roomId={roomid} sender="user" title="Chat with Captain" />;
};
