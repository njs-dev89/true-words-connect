import { httpsCallable } from "@firebase/functions";
import {
  createClient,
  createMicrophoneAndCameraTracks,
  ClientConfig,
  IAgoraRTCRemoteUser,
} from "agora-rtc-react";
import React, { useEffect, useState } from "react";
import { functions } from "../config/firebaseConfig";
import { useFirebaseAuth } from "../context/authContext";
import AgoraControls from "./AgoraControls";
import AgoraVideos from "./AgoraVideo";
import { useRouter } from "next/router";

const genRtcToken = httpsCallable(functions, "genRtcToken");
const config: ClientConfig = {
  mode: "rtc",
  codec: "vp8",
};

const appId: string = process.env.NEXT_PUBLIC_AGORA_APP_ID; //ENTER APP ID HERE
// const token: string | null =
//   "006238b4a95e2de433586fb623c85efc6b0IAAwntpEBl/+aeEouDvG+yMAdHwao4vVvMn8NEtENK/ufEXaoR0AAAAAEAAb/oIXnnSDYQEAAQCddINh";

const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
function VideoCall(props: {
  setInCall: React.Dispatch<React.SetStateAction<boolean>>;
  channelName: string;
}) {
  const { setInCall, channelName } = props;
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [start, setStart] = useState<boolean>(false);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  const { authUser } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    // function to initialise the SDK
    let init = async (name: string) => {
      console.log("init", name);
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("subscribe success");
        console.log({ user });
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user, type) => {
        console.log("unpublished", user, type);
        if (type === "audio") {
          user.audioTrack?.stop();
        }
        if (type === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
        console.log(client.getRTCStats());
      });

      client.on("user-left", (user) => {
        console.log("leaving", user);

        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });
      const uid = Math.ceil(Math.random() * 10);
      const token = await genRtcToken({
        uid,
        channelName: name,
      });
      console.log(token);
      await client.join(appId, name, token.data as string, uid);
      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);
    };

    if (ready && tracks) {
      console.log("init ready");
      init(channelName);
    }
  }, [channelName, client, ready, tracks]);
  return (
    <div className="w-full h-full">
      {start && tracks && <AgoraVideos users={users} tracks={tracks} />}
      {ready && tracks && (
        <AgoraControls
          tracks={tracks}
          setStart={setStart}
          setInCall={setInCall}
          client={client}
        />
      )}
    </div>
  );
}

export default VideoCall;
