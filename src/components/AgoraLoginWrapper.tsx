import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAgora } from "../context/agoraContextNoSsr";
import { useFirebaseAuth } from "../context/authContext";
import ModalContainer from "./ModalContainer";
import RemoteCallNotification from "./RemoteCallNotification";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const Msg = ({ msg, attributes }) => (
  <div>
    <h3 className="font-bold text-lg text-blue mb-4">New Message!</h3>
    <div className="flex items-center">
      <div className="relative h-10 w-10 overflow-hidden rounded-full mr-2">
        {" "}
        <Image src={attributes?.profile_pic} layout="fill" alt="" />
      </div>
      <p className="font-semibold">{attributes.username}</p>
    </div>
    <p className="ml-12">{msg}</p>
  </div>
);

function AgoraLoginWrapper({ children }) {
  const displayMsg = (msg, attributes) => {
    toast(() => <Msg msg={msg} attributes={attributes} />, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const { authUser, loading } = useFirebaseAuth();
  const router = useRouter();
  const {
    loginToAgoraRtm,
    logOutFromAgora,
    localInvitation,
    remoteInvitation,
    setInCall,
    setRemoteCallNotification,
    setLocalCallNotification,
    localCallNotification,
    remoteCallNotification,
    message,
    agoraLoginStatus,
  } = useAgora();

  // useEffect(() => {
  //   if (window !== undefined) {
  //     window.onload = () => {
  //       if (authUser && authUser.uid && agoraLoginStatus === "disconnected") {
  //         loginToAgoraRtm(authUser.uid);
  //       }
  //     };
  //   }
  // }, [authUser, agoraLoginStatus]);

  useEffect(() => {
    if (message) {
      console.log(message);
      displayMsg(message.message.text, message.attributes);
    }
  }, [message]);

  useEffect(() => {
    if (localInvitation) {
      localInvitation.on("LocalInvitationReceivedByPeer", () => {
        setLocalCallNotification(true);
      });
      localInvitation.on("LocalInvitationCanceled", () => {
        setLocalCallNotification(false);
      });
      localInvitation.on("LocalInvitationRefused", () => {
        setLocalCallNotification(false);
      });
      localInvitation.on("LocalInvitationAccepted", () => {
        setLocalCallNotification(false);
        setInCall(true);
      });

      localInvitation.on("LocalInvitationFailure", (reason) => {
        setLocalCallNotification(false);
      });
    }

    if (remoteInvitation) {
      remoteInvitation.on("RemoteInvitationRefused", () => {
        setRemoteCallNotification(false);
      });
      remoteInvitation.on("RemoteInvitationCanceled", () => {
        setRemoteCallNotification(false);
      });
      remoteInvitation.on("RemoteInvitationFailure", () => {
        setRemoteCallNotification(false);
      });
      remoteInvitation.on("RemoteInvitationAccepted", () => {
        if (router.query?.id !== remoteInvitation.content) {
          setRemoteCallNotification(false);
          setInCall(true);
          router.push(`/profile/orders/${remoteInvitation.content}`);
        } else {
          setRemoteCallNotification(false);
          setInCall(true);
        }
      });
    }
  }, [localInvitation, remoteInvitation]);
  return (
    <>
      {remoteCallNotification && (
        <RemoteCallNotification
          remoteInvitation={remoteInvitation}
          setRemoteCallNotification={setRemoteCallNotification}
        />
      )}

      {localCallNotification && (
        <ModalContainer setShowModal={setLocalCallNotification} title="Calling">
          <div className="w-96 p-6">
            <p>You are calling someone</p>
            <button
              onClick={() => localInvitation.cancel()}
              className="px-4 py-2 rounded text-white bg-red-500 shadow-md"
            >
              Cancel
            </button>
          </div>
        </ModalContainer>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {children}
    </>
  );
}

export default AgoraLoginWrapper;
