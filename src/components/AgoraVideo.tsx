import {
  AgoraVideoPlayer,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  IAgoraRTCRemoteUser,
} from "agora-rtc-react";
import * as React from "react";

const AgoraVideos = (props: {
  users: IAgoraRTCRemoteUser[];
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
}) => {
  const { users, tracks } = props;

  return (
    <div
      id="videos"
      className="flex relative mx-auto grid grid-cols-1 w-full h-full"
      // style={{ height: "500px" }}
    >
      {users.length > 0 &&
        users.map((user) => {
          if (user.videoTrack) {
            return (
              <AgoraVideoPlayer
                className="vid"
                videoTrack={user.videoTrack}
                style={{
                  height: "100%",
                  width: "100%",
                }}
                key={user.uid}
              />
            );
          } else return null;
        })}
      {users.length === 0 ? (
        <AgoraVideoPlayer
          className="absolute right-0 bottom-0"
          videoTrack={tracks[1]}
          style={{ height: "100%", width: "100%" }}
        />
      ) : (
        <AgoraVideoPlayer
          className="absolute right-0 bottom-0"
          videoTrack={tracks[1]}
          style={{ height: "150px", width: "200px" }}
        />
      )}
    </div>
  );
};

export default AgoraVideos;
