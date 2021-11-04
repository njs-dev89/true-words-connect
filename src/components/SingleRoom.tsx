import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";

function SingleRoom({ room }) {
  const router = useRouter();
  return (
    <div className={`${router.query.room === room.id && "text-yellow-600"}`}>
      <Link href={`/profile/messages?room=${room.id}`}>
        <a>Single Room {room.id}</a>
      </Link>
    </div>
  );
}

export default SingleRoom;
