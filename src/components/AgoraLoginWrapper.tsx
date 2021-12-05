import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAgora } from "../context/agoraContextNoSsr";
import { useFirebaseAuth } from "../context/authContext";
import RemoteCallNotification from "./RemoteCallNotification";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import LocalCallNotification from "./LocalCallNotification";

const Msg = ({ msg, attributes }) => {
  let heading;

  const msgContent = msg.split(";");
  if (msgContent[0] === "MESSAGE") heading = "New Message!";
  if (msgContent[0] === "OFFER") heading = "New Offer!";
  if (msgContent[0] === "OFFER_REQUEST") heading = "New Offer Request!";
  if (msgContent[0] === "ORDER") heading = "New Order!";
  if (msgContent[0] === "REVIEW") heading = "User Review!";
  if (msgContent[0] === "OFFER_REJECTED") heading = "Offer rejected!";
  return (
    <div>
      <h3 className="font-bold text-lg text-blue mb-4">{heading}</h3>
      <div className="flex items-center">
        <div className="relative h-10 w-10 overflow-hidden rounded-full mr-2">
          {" "}
          <Image src={attributes?.profile_pic} layout="fill" alt="" />
        </div>
        <p className="font-semibold">{attributes.username}</p>
      </div>
      <p className="ml-12">{msgContent[1]}</p>
    </div>
  );
};

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
    localInvitation,
    remoteInvitation,
    setInCall,
    setRemoteCallNotification,
    setLocalCallNotification,
    localCallNotification,
    remoteCallNotification,
    message,
  } = useAgora();

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
        <LocalCallNotification
          localInvitation={localInvitation}
          setLocalCallNotification={setLocalCallNotification}
        />
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
