import { httpsCallable } from "@firebase/functions";
import AgoraRTM from "agora-rtm-sdk";
import { useCallback, useEffect, useState } from "react";
import { functions } from "../config/firebaseConfig";
import { useFirebaseAuth } from "../context/authContext";

const client = AgoraRTM.createInstance(process.env.NEXT_PUBLIC_AGORA_APP_ID);

export default function useAgoraRtm() {
  const { authUser } = useFirebaseAuth();
  const [message, setMessage] = useState(null);
  const [onlineStatus, setOnlineStatus] = useState(null);
  const [localInvitation, setLocalInvitation] = useState(null);
  const [remoteInvitation, setRemoteInvitation] = useState(null);
  const [localCallNotification, setLocalCallNotification] = useState(false);
  const [remoteCallNotification, setRemoteCallNotification] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [agoraLoginStatus, setAgoraLoginStatus] = useState("disconnected");

  const loginToAgoraRtm = useCallback(
    async (uid) => {
      try {
        setAgoraLoginStatus("connecting");
        const genRtmToken = httpsCallable(functions, "genRtmToken");
        const token = await genRtmToken({ uid });
        await client.login({
          uid,
          token: token.data as string,
        });

        await client.setLocalUserAttributes({
          username: authUser.profile.username,
          profile_pic: authUser.profile.profile_pic,
        });
      } catch (error) {
        setAgoraLoginStatus("disconnected");
        console.log(error);
      }
    },
    [authUser]
  );

  function logOutFromAgora() {
    client.logout();
  }

  async function getUserAttributes(userId, callBack) {
    const attributes = await client.getUserAttributes(userId);
    console.log(attributes);
    callBack(attributes);
  }
  function createCallInvitation(calleeId) {
    const localInvitation = client.createLocalInvitation(calleeId);
    setLocalInvitation(localInvitation);
    return localInvitation;
  }

  async function sendMessageToPeer(message, peerId) {
    await client
      .sendMessageToPeer({ text: message }, peerId, {
        enableOfflineMessaging: true,
      })
      .then((sendResult) => {
        if (sendResult.hasPeerReceived) {
          console.log("Message Recieved");
        } else {
          console.log("User is offline");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const peersOnline = (peerIds) => {
    client.subscribePeersOnlineStatus(peerIds);
  };

  useEffect(() => {
    if (authUser && agoraLoginStatus === "disconnected") {
      loginToAgoraRtm(authUser.uid);
    }
  }, [authUser, agoraLoginStatus]);

  useEffect(() => {
    client.on("MessageFromPeer", function (message, peerId) {
      getUserAttributes(peerId, (attributes) => {
        setMessage({ attributes, message });
      });
    });
    client.on("ConnectionStateChanged", function (newState, reason) {
      console.log(newState, reason);
      if (newState === "CONNECTED") {
        setAgoraLoginStatus("connected");
      }
      if (newState === "DISCONNECTED") {
        console.log("Agora disconnected");
        setAgoraLoginStatus("disconnected");
      }
    });

    client.on("PeersOnlineStatusChanged", (status) => {
      console.log(status);
      setOnlineStatus(status);
    });
    client.on("RemoteInvitationReceived", (RemoteInvitation) => {
      setRemoteInvitation(RemoteInvitation);
      setRemoteCallNotification(true);
    });
  }, []);

  return {
    message,
    sendMessageToPeer,
    loginToAgoraRtm,
    createCallInvitation,
    peersOnline,
    logOutFromAgora,
    onlineStatus,
    localCallNotification,
    setLocalCallNotification,
    remoteCallNotification,
    setRemoteCallNotification,
    inCall,
    setInCall,
    localInvitation,
    remoteInvitation,
    getUserAttributes,
    agoraLoginStatus,
  };
}
