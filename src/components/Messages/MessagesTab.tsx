import React, { useEffect, useState } from "react";
import { useAgora } from "../../context/agoraContextNoSsr";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "@firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useFirebaseAuth } from "../../context/authContext";
import MessageRooms from "./MessageRooms";
import { IoMdSend } from "react-icons/io";
import Messages from "./Messages";
import CreateOffer from "../Profile/CreateOffer";

function MessagesTab({ loading, rooms }) {
  const router = useRouter();
  const { authUser } = useFirebaseAuth();
  const { peersOnline } = useAgora();
  // const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState(null);
  // const [loading, setLoading] = useState(true);
  const { message, sendMessageToPeer } = useAgora();
  const [msg, setMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

  // useEffect(() => {
  //   const messageRoomsCollection = collection(db, `/messageRooms`);
  //   let q;
  //   if (authUser.role === "client") {
  //     q = query(messageRoomsCollection, where("client.id", "==", authUser.uid));
  //   }
  //   if (authUser.role === "provider") {
  //     q = query(
  //       messageRoomsCollection,
  //       where("provider.id", "==", authUser.uid)
  //     );
  //   }

  //   const unsubscribe = onSnapshot(q, {}, (querySnapshot) => {
  //     const rooms = [];
  //     querySnapshot.forEach((doc) => {
  //       const data = doc.data();
  //       data["id"] = doc.id;
  //       rooms.push(data);
  //     });
  //     console.log(rooms);
  //     setRooms(rooms);
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    if (!loading) {
      let peerIds;
      if (authUser.role === "client") {
        peerIds = rooms.map((room) => room.provider.id);
      } else {
        peerIds = rooms.map((room) => room.client.id);
      }
      if (peerIds.length > 0) {
        peersOnline(peerIds);
      }
    }
  }, [loading]);

  useEffect(() => {
    if (!router.query.room && rooms.length > 0) {
      router.push(`/profile/messages?room=${rooms[0].id}`);
    }
    if (router.query.room && rooms.length > 0) {
      return setRoom(rooms.find((room) => room.id === router.query.room));
    }
  }, [rooms, router]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const peerId =
      authUser.role === "client" ? room.provider.id : room.client.id;
    console.log({ peerId });
    const roomData =
      authUser.role === "client"
        ? { provider: { hasUnreadMessages: true } }
        : { client: { hasUnreadMessages: true } };
    await setDoc(doc(db, `/messageRooms/${room.id}`), roomData, {
      merge: true,
    });
    const messageCollection = collection(
      db,
      `/messageRooms/${room.id}/messages`
    );
    const offerReqDocRef = await addDoc(messageCollection, {
      text: msg,
      senderId: authUser.uid,
      hasReceiverRead: false,
      time: new Date(),
    });
    setMsg("");

    sendMessageToPeer(msg, peerId);
  };
  return (
    <div className="grid grid-cols-3 gap-4">
      {console.log(message)}
      {!loading && rooms.length > 0 ? (
        <>
          <MessageRooms rooms={rooms} />
          <div className="col-span-3 md:col-span-2">
            {room && <Messages room={room} />}
            <div className="flex flex-col items-end gap-2">
              <form onSubmit={sendMessage}>
                <div className="flex relative">
                  <input
                    className="form-input border-2 rounded-md px-4 py-4 flex-grow"
                    name="msg"
                    autoComplete="off"
                    id=""
                    placeholder="Type your message"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                  />

                  <button
                    className="absolute text-yellow right-0 mr-4 transform top-1/2 -translate-y-2/4"
                    // onClick={sendMessage}
                  >
                    <IoMdSend className="text-3xl" />
                  </button>
                </div>
              </form>
              {authUser.role === "provider" && (
                <button
                  onClick={() => setShowModal(true)}
                  className="text-green font-medium text-sm mr-2"
                >
                  Create Offer
                </button>
              )}
            </div>
            {showModal && (
              <CreateOffer setShowModal={setShowModal} room={room} />
            )}
          </div>
        </>
      ) : authUser.role === "client" ? (
        <div className="col-span-3 mt-16">
          <p className="text-center">You haven&apos;t started any chat yet</p>
        </div>
      ) : (
        <div className="col-span-3 mt-16">
          <p className="text-center">No one has contacted you yet</p>
        </div>
      )}
    </div>
  );
}

export default MessagesTab;
