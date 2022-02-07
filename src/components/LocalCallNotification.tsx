import * as React from "react";
import { useAgora } from "../context/agoraContextNoSsr";
import ModalContainer from "./ModalContainer";
import Image from "next/image";

function LocalCallNotification({ localInvitation, setLocalCallNotification }) {
  const { getUserAttributes } = useAgora();
  const [userAttributes, setUserAttributes] = React.useState(null);

  React.useEffect(() => {
    getUserAttributes(localInvitation.calleeId, setUserAttributes);
  }, []);
  return (
    <ModalContainer
      setShowModal={(value) => {
        localInvitation.cancel();
        setLocalCallNotification(value);
      }}
      title="Calling..."
    >
      <div className="w-96 p-6 flex flex-col items-center">
        {userAttributes?.profile_pic && (
          <div className="relative h-16 w-16 overflow-hidden rounded-full">
            {" "}
            <Image src={userAttributes?.profile_pic} layout="fill" alt="" />
          </div>
        )}
        <p>You are calling {userAttributes?.username}</p>
        <div className="mt-4">
          <button
            onClick={() => localInvitation.cancel()}
            className="btn bordered-2 border-red-500 rounded text-white bg-red-500 shadow-md ml-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalContainer>
  );
}

export default LocalCallNotification;
