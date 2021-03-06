import { httpsCallable } from "@firebase/functions";
import AgoraRTM from "agora-rtm-sdk";
import { collection, doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db, functions } from "../config/firebaseConfig";
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
      }
    },
    [authUser]
  );

  function logOutFromAgora() {
    client.logout();
  }

  async function getUserAttributes(userId, callBack) {
    const attributes = await client.getUserAttributes(userId);

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
        } else {
        }
      })
      .catch((err) => {});
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
    client.on("MessageFromPeer", async function (message, peerId) {
      const clients = collection(db, "clients");
      const providers = collection(db, "providers");
      const userDoc = doc(clients, peerId);
      const providerDoc = doc(providers, peerId);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        const attributes = {
          profile_pic: docSnap.data().profile_pic,
          username: docSnap.data().username,
        };
        setMessage({ attributes, message });
      } else {
        const providerSnap = await getDoc(providerDoc);
        if (providerSnap.exists()) {
          const attributes = {
            profile_pic: providerSnap.data().profile_pic,
            username: providerSnap.data().username,
          };
          setMessage({ attributes, message });
        } else {
          const attributes = {
            profile_pic: "/profile-placeholder.png",
            username: "Unknown",
          };
          setMessage({ attributes, message });
        }
      }
    });
    client.on("ConnectionStateChanged", function (newState, reason) {
      if (newState === "CONNECTED") {
        setAgoraLoginStatus("connected");
      }
      if (newState === "DISCONNECTED") {
        setAgoraLoginStatus("disconnected");
      }
    });

    client.on("PeersOnlineStatusChanged", (status) => {
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
