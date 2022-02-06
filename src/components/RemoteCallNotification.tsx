import * as React from "react";
import { useAgora } from "../context/agoraContextNoSsr";
import ModalContainer from "./ModalContainer";
import Image from "next/image";

function RemoteCallNotification({
  remoteInvitation,
  setRemoteCallNotification,
}) {
  const { getUserAttributes } = useAgora();
  const [userAttributes, setUserAttributes] = React.useState(null);

  React.useEffect(() => {
    getUserAttributes(remoteInvitation.callerId, setUserAttributes);
    console.log(userAttributes);
  }, []);
  return (
    <ModalContainer
      setShowModal={(value) => {
        remoteInvitation.refuse();
        setRemoteCallNotification(value);
      }}
      title="Call Recieved"
    >
      <div className="w-96 p-6 flex flex-col items-center">
        {userAttributes?.profile_pic && (
          <div className="relative h-16 w-16 overflow-hidden rounded-full">
            {" "}
            <Image src={userAttributes?.profile_pic} layout="fill" alt="" />
          </div>
        )}
        <p>{userAttributes?.username} is calling you</p>
        <div className="mt-4">
          <button
            onClick={() => remoteInvitation.accept()}
            className="btn btn-green"
          >
            Accept
          </button>
          <button
            onClick={() => remoteInvitation.refuse()}
            className="btn bordered-2 border-red-500 rounded text-white bg-red-500 shadow-md ml-2"
          >
            Decline
          </button>
        </div>
      </div>
    </ModalContainer>
  );
}

export default RemoteCallNotification;
