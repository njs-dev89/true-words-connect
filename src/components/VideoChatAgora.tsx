import React, { useState } from "react";
import { useAgora } from "../context/agoraContextNoSsr";
import { useFirebaseAuth } from "../context/authContext";
import VideoCall from "./VideoCall";

function VideoChatAgora({ channelName, order }) {
  const { createCallInvitation, inCall, setInCall } = useAgora();
  const { authUser } = useFirebaseAuth();

  const sendCallInvitation = () => {
    const calleeId =
      authUser.role === "client" ? order.provider.id : order.client.id;
    const localInvitation = createCallInvitation(calleeId);
    localInvitation.content = channelName;
    localInvitation.send();
  };
  return (
    <div
      className={`${
        inCall && "grid grid-cols-1 bg-white p-4 w-full h-screen"
      } flex  justify-center`}
    >
      {inCall ? (
        <VideoCall setInCall={setInCall} channelName={channelName} />
      ) : (
        <div className="bg-white px-4 py-4 rounded-lg shadow-md">
          <div className="px-16 sm:px-32 py-16 border-2 border-dotted rounded-lg">
            <button className="btn btn-yellow" onClick={sendCallInvitation}>
              Start video call
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoChatAgora;
