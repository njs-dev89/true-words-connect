import * as React from "react";
import { useAgora } from "../../context/agoraContextNoSsr";
import { useRouter } from "next/router";
import { useFirebaseAuth } from "../../context/authContext";
import MessageRooms from "./MessageRooms";
import Messages from "./Messages";
import CreateOffer from "../Profile/CreateOffer";
import CreateMessage from "./CreateMessage";
import Link from "next/link";

function MessagesTab({ loading, rooms }) {
  const router = useRouter();
  const { authUser } = useFirebaseAuth();
  const [room, setRoom] = React.useState(null);
  const { message } = useAgora();
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    if (!router.query.room && rooms.length > 0) {
      router.push(`/profile/messages?room=${rooms[0].id}`);
    }
    if (router.query.room && rooms.length > 0) {
      return setRoom(rooms.find((room) => room.id === router.query.room));
    }
  }, [rooms, router]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {!loading && rooms.length > 0 ? (
        <>
          <MessageRooms rooms={rooms} loading={loading} />
          <div className="col-span-3 md:col-span-2">
            {room && <Messages room={room} />}

            <CreateMessage room={room} setShowModal={setShowModal} />

            {showModal && (
              <CreateOffer setShowModal={setShowModal} room={room} />
            )}
          </div>
        </>
      ) : authUser.role === "client" ? (
        <div className="col-span-3 mt-16 text-center">
          <Link href="/">
            <a className="btn btn-blue">Find a Provider</a>
          </Link>
          <p className="text-center">No Current Messages</p>
        </div>
      ) : (
        <div className="col-span-3 mt-16 text-center">
          <Link href="/">
            <a className="btn btn-blue">Find a Provider</a>
          </Link>
          <p className="text-center">No Current Messages</p>
        </div>
      )}
    </div>
  );
}

export default MessagesTab;
