import React, { useEffect } from "react";
import { useAgora } from "../../context/agoraContextNoSsr";
import { useFirebaseAuth } from "../../context/authContext";
import SingleRoom from "./SingleRoom";

function MessageRooms({ rooms, loading }) {
  const { peersOnline, agoraLoginStatus } = useAgora();
  const { authUser } = useFirebaseAuth();

  useEffect(() => {
    if (!loading && agoraLoginStatus === "connected") {
      let peerIds;
      if (authUser.role === "client") {
        peerIds = rooms.map((room) => room.provider.id);
      } else {
        peerIds = rooms.map((room) => room.client.id);
      }
      if (peerIds.length > 0) {
        peersOnline(peerIds);
      }
    }
  }, [loading, agoraLoginStatus]);

  return (
    <div className="col-span-3 md:col-span-1 h-72">
      {rooms.map((room) => (
        <SingleRoom room={room} key={room.id} />
      ))}
    </div>
  );
}

export default MessageRooms;
