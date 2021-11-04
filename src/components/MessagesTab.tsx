import React, { useEffect, useState } from "react";
import { useAgora } from "../context/agoraContextNoSsr";
import { useRouter } from "next/router";
import { collection, doc, onSnapshot, query, where } from "@firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useFirebaseAuth } from "../context/authContext";
import MessageRooms from "./MessageRooms";

function MessagesTab() {
  const router = useRouter();
  const { authUser } = useFirebaseAuth();
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const { messages, sendMessageToPeer } = useAgora();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const messageRoomsCollection = collection(db, `/messageRooms`);
    let q;
    if (authUser.role === "client") {
      q = query(messageRoomsCollection, where("client.id", "==", authUser.uid));
    }
    if (authUser.role === "translator") {
      q = query(
        messageRoomsCollection,
        where("translator.id", "==", authUser.uid)
      );
    }

    const unsubscribe = onSnapshot(q, {}, (querySnapshot) => {
      const rooms = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data["id"] = doc.id;
        rooms.push(data);
      });
      console.log(rooms);
      setRooms(rooms);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!router.query.room && rooms.length > 0) {
      router.push(`/profile/messages?room=${rooms[0].id}`);
    }
    if (router.query.room && rooms.length > 0) {
      return setRoom(rooms.find((room) => room.id === router.query.room));
    }
  }, [rooms, router]);
  return (
    <div className="grid grid-cols-3">
      {!loading && rooms.length > 0 ? (
        <>
          <MessageRooms rooms={rooms} />
          <div className="col-span-2">
            <div>
              {messages.length &&
                messages.map((mesg) => {
                  return <p>{mesg.text}</p>;
                })}
            </div>
            <div>
              <textarea
                name="msg"
                id=""
                cols={20}
                rows={5}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              >
                Enter message
              </textarea>
              <button
                onClick={() => {
                  const peerId =
                    authUser.role === "client"
                      ? room.translator.id
                      : room.client.id;
                  console.log({ peerId });
                  sendMessageToPeer(msg, peerId);
                }}
              >
                Send
              </button>
            </div>
          </div>
        </>
      ) : authUser.role === "client" ? (
        <div className="col-span-3 mt-16">
          <p className="text-center">You haven't started any chat yet</p>
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
