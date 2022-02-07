import { useRouter } from "next/router";
import * as React from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAgora } from "../context/agoraContextNoSsr";
import RemoteCallNotification from "./RemoteCallNotification";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import LocalCallNotification from "./LocalCallNotification";
import { useNotification } from "../customHooks/useNotification";
import Notification from "./Notification";
import { useSiteNotificationContext } from "../context/siteNotificationsContext";

const Msg = ({ msg, attributes }) => {
  let heading;

  const msgContent = msg.split(";");
  if (msgContent[0] === "MESSAGE") heading = "New Message!";
  if (msgContent[0] === "REVIEW") heading = "User Review!";

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
  const {
    siteErrors,
    siteInfo,
    setSiteInfo,
    setSiteErrors,
    siteWarning,
    setSiteWarning,
  } = useSiteNotificationContext();
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

  const displayNotification = (hasNotified, notification) => {
    toast(() => <Notification notification={notification} />, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      onClose: () => hasNotified(notification.id),
    });
  };

  const { notificationsLoading, notifications, hasNotified } =
    useNotification();
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

  React.useEffect(() => {
    if (siteInfo !== "") {
      toast.success(siteInfo, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => setSiteInfo(""),
      });
    }
  }, [siteInfo]);

  React.useEffect(() => {
    if (siteErrors !== "") {
      toast.error(siteErrors, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => setSiteErrors(""),
      });
    }
  }, [siteErrors]);

  React.useEffect(() => {
    if (siteWarning !== "") {
      toast.warn(siteWarning, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => setSiteWarning(""),
      });
    }
  }, [siteWarning]);

  React.useEffect(() => {
    if (message) {
      displayMsg(message.message.text, message.attributes);
    }
  }, [message]);

  React.useEffect(() => {
    if (notifications) {
      notifications.forEach((notification) =>
        displayNotification(hasNotified, notification)
      );
    }
  }, [notifications]);

  React.useEffect(() => {
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
