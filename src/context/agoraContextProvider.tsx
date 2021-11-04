import AgoraRTM from "agora-rtm-sdk";
import useAgoraRtm from "../customHooks/useAgoraRtm";
import { agoraContext } from "./agoraContext";

export function AgoraProvider({ children }) {
  const client = AgoraRTM.createInstance(process.env.NEXT_PUBLIC_AGORA_APP_ID);
  const agora = useAgoraRtm(client);
  return (
    <agoraContext.Provider value={agora}>{children}</agoraContext.Provider>
  );
}
