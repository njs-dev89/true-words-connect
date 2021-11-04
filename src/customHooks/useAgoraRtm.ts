import { httpsCallable } from "@firebase/functions";
import { useEffect, useState } from "react";
import { functions } from "../config/firebaseConfig";
import { useFirebaseAuth } from "../context/authContext";

const genRtmToken = httpsCallable(functions, "genRtmToken");

export default function useAgoraRtm(client) {
  const { authUser } = useFirebaseAuth();
  const [messages, setMessages] = useState([]);
  async function loginToAgoraRtm(uid, token) {
    try {
      await client.login({
        token,
        uid,
      });
    } catch (error) {
      console.log(error);
    }
    // await client.setLocalUserAttributes({
    //   name: username,
    //   img: picUrl,
    // });
  }

  function createCallInvitation(calleeId) {
    const localInvitation = client.createLocalInvitation(calleeId);
    return localInvitation;
  }
  const agoraLogin = async (uid) => {
    const token = await genRtmToken({ uid });
    console.log(token);
    loginToAgoraRtm(uid, token.data);
  };

  async function sendMessageToPeer(message, peerId) {
    await client
      .sendMessageToPeer({ text: message }, peerId, {
        enableOfflineMessaging: true,
      })
      .then((sendResult) => {
        if (sendResult.hasPeerRecieved) {
          setMessages((prevMessages) => [...prevMessages, message]);
        } else {
          console.log("User is offline");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    client.on("MessageFromPeer", function (message, peerId) {
      setMessages([message, ...messages]);
      console.log(message);
    });
    client.on("ConnectionStateChanged", function (newState, reason) {
      console.log(newState, reason);
      if (newState === "DISCONNECTED") {
        if (authUser) {
          // agoraLogin(authUser.uid);
        }
      }
    });
    // client.on("RemoteInvitationRecieved", function (remoteInvitation) {});
  }, []);

  return { messages, sendMessageToPeer, loginToAgoraRtm, createCallInvitation };
}
