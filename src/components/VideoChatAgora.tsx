import React, { useState } from "react";
import VideoCall from "./VideoCall";

function VideoChatAgora({ channelName }) {
  const [inCall, setInCall] = useState(false);
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
            <button
              className="btn btn-yellow"
              onClick={(e) => {
                setInCall(true);
              }}
            >
              Start video call
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoChatAgora;
