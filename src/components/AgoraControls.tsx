import * as React from "react";
import { ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-react";
import { BiExit, BiVideo, BiVideoOff } from "react-icons/bi";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";

const AgoraControls = (props: {
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
  setInCall: React.Dispatch<React.SetStateAction<boolean>>;
  client: any;
}) => {
  const { tracks, setStart, setInCall, client } = props;
  const [trackState, setTrackState] = React.useState({
    video: true,
    audio: true,
  });

  const mute = async (type: "audio" | "video") => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
  };

  return (
    <div className="mt-4 flex items-center justify-center">
      <button
        className={`btn  ${trackState.audio ? "btn-yellow" : "btn-outline"}`}
        onClick={() => mute("audio")}
      >
        {trackState.audio ? (
          <span className="flex items-center">
            <AiOutlineAudioMuted />
            Mute
          </span>
        ) : (
          <span className="flex items-center">
            <AiOutlineAudio />
            Unmute
          </span>
        )}
      </button>
      <button
        className={`btn ml-3 ${trackState.video ? "btn-green" : "btn-outline"}`}
        onClick={() => mute("video")}
      >
        {trackState.video ? (
          <span className="flex items-center">
            <BiVideoOff />
            Hide video
          </span>
        ) : (
          <span className="flex items-center">
            <BiVideo />
            Show Video
          </span>
        )}
      </button>
      {
        <button
          className={`btn btn-blue ml-3 ${trackState.audio ? "on" : ""}`}
          onClick={() => leaveChannel()}
        >
          <span className="flex items-center">
            <BiExit />
            Leave
          </span>
        </button>
      }
    </div>
  );
};
export default AgoraControls;
