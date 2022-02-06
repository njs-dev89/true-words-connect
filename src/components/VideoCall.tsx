import { httpsCallable } from "@firebase/functions";
import {
  createClient,
  createMicrophoneAndCameraTracks,
  ClientConfig,
  IAgoraRTCRemoteUser,
} from "agora-rtc-react";
import * as React from "react";
import { db, functions } from "../config/firebaseConfig";
import { useFirebaseAuth } from "../context/authContext";
import AgoraControls from "./AgoraControls";
import AgoraVideos from "./AgoraVideo";
import { useRouter } from "next/router";
import { doc, setDoc } from "@firebase/firestore";

const genRtcToken = httpsCallable(functions, "genRtcToken");
const config: ClientConfig = {
  mode: "rtc",
  codec: "vp8",
};

const appId: string = process.env.NEXT_PUBLIC_AGORA_APP_ID;

const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
function VideoCall(props: {
  setInCall: React.Dispatch<React.SetStateAction<boolean>>;
  channelName: string;
  order;
}) {
  const { setInCall, channelName, order } = props;
  const [users, setUsers] = React.useState<IAgoraRTCRemoteUser[]>([]);
  const [start, setStart] = React.useState<boolean>(false);
  const [timer, setTimer] = React.useState(0);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  const { authUser } = useFirebaseAuth();
  const router = useRouter();

  React.useEffect(() => {
    let init = async (name: string) => {
      console.log("init", name);
      let tenMinuteTimer;
      let perSecondTimer;
      client.on("connection-state-change", async (newState, oldState) => {
        console.log(newState);
        if (newState === "CONNECTED") {
          let countDownStartTime =
            new Date().getTime() + order.time_remaining_secs * 1000;
          perSecondTimer = setInterval(async () => {
            let now = new Date().getTime();
            let distance = countDownStartTime - now;
            setTimer(distance);
            if (distance < 0) {
              clearInterval(perSecondTimer);
              await setDoc(
                doc(db, `/orders/${channelName}`),
                { time_remaining_secs: 0, status: "completed" },
                { merge: true }
              );
            }
          }, 1000);
          if (authUser.role === "client") {
            tenMinuteTimer = setInterval(async () => {
              await setDoc(
                doc(db, `/orders/${channelName}`),
                {
                  time_remaining_secs:
                    order.time_remaining_secs -
                    client.getRTCStats().Duration +
                    order.last_duration,
                  last_duration: client.getRTCStats().Duration,
                },
                { merge: true }
              );
            }, 600000);
          }
        }
        if (newState === "DISCONNECTED") {
          clearInterval(tenMinuteTimer);
          clearInterval(perSecondTimer);
          console.log(client.getRTCStats());
          if (authUser.role === "client") {
            await setDoc(
              doc(db, `/orders/${channelName}`),
              {
                time_remaining_secs:
                  order.time_remaining_secs -
                  client.getRTCStats().Duration +
                  order.last_duration,
                last_duration: 0,
              },
              { merge: true }
            );
            // const timeRemaining =
            //   order.time_remaining_secs - client.getRTCStats().Duration;
            // await setDoc(
            //   doc(db, `/orders/${channelName}`),
            //   { time_remaining_secs: timeRemaining },
            //   { merge: true }
            // );
          }
        }
      });
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
        <>
          <p
            className={`text-center mt-4 text-xl font-semibold ${
              timer < 60000 ? "text-red-600" : ""
            }`}
          >{`${Math.floor(timer / (1000 * 60 * 60))}h ${Math.floor(
            (timer % (1000 * 60 * 60)) / (1000 * 60)
          )}m ${Math.floor((timer % (1000 * 60)) / 1000)}s`}</p>
          <AgoraControls
            tracks={tracks}
            setStart={setStart}
            setInCall={setInCall}
            client={client}
          />
        </>
      )}
    </div>
  );
}

export default VideoCall;
