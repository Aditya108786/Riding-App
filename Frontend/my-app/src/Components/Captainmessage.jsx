import RideChat from "./RideChat";

export const Sendmessagecaptain = ({ roomId }) => {
  return <RideChat roomId={roomId} sender="captain" title="Chat with Rider" />;
};
