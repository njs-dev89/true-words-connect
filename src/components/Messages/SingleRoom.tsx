import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";
import { useFirebaseAuth } from "../../context/authContext";
import { useAgora } from "../../context/agoraContextNoSsr";
import Image from "next/image";

function SingleRoom({ room }) {
  const router = useRouter();
  const { authUser } = useFirebaseAuth();
  const { onlineStatus } = useAgora();
  return (
    <div
      className={`border-2 px-2 py-4 rounded-lg mb-2 ${
        router.query.room === room?.id && "text-yellow"
      }`}
    >
      <Link href={`/profile/messages?room=${room?.id}`}>
        <a>
          {authUser.role === "client" ? (
            <div className="flex items-center relative">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                {" "}
                <Image src={room.provider?.profile_pic} layout="fill" alt="" />
              </div>
              {onlineStatus && onlineStatus[room.provider.id] === "ONLINE" && (
                <span className="inline-block w-3 h-3 rounded bg-green absolute left-8 top-7 border-2 border-white"></span>
              )}
              <p className="ml-2">{room?.provider?.username}</p>
            </div>
          ) : (
            <div className="flex items-center relative">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                {" "}
                <Image src={room.client?.profile_pic} layout="fill" alt="" />
              </div>
              {onlineStatus && onlineStatus[room.client.id] === "ONLINE" && (
                <span className="inline-block w-2 h-2 rounded bg-green absolute left-8 top-7"></span>
              )}
              <div className="ml-2">{room?.client?.username}</div>
            </div>
          )}
        </a>
      </Link>
    </div>
  );
}

export default SingleRoom;
