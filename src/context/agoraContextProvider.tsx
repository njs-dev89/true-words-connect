import AgoraRTM from "agora-rtm-sdk";
import useAgoraRtm from "../customHooks/useAgoraRtm";
import { agoraContext } from "./agoraContext";

export function AgoraProvider({ children }) {
  const agora = useAgoraRtm();
  return (
    <agoraContext.Provider value={agora}>{children}</agoraContext.Provider>
  );
}
