import React, { useEffect, useState } from "react";
import { useAgora } from "../context/agoraContextNoSsr";
import { useRouter } from "next/router";
import { collection, doc, onSnapshot, query, where } from "@firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useFirebaseAuth } from "../context/authContext";
import MessageRooms from "./MessageRooms";
import { IoMdSend } from "react-icons/io";
import Image from "next/image";

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
    if (authUser.role === "provider") {
      q = query(
        messageRoomsCollection,
        where("provider.id", "==", authUser.uid)
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
    <div className="grid grid-cols-3 gap-4">
      {!loading && rooms.length > 0 ? (
        <>
          <MessageRooms rooms={rooms} />
          <div className="col-span-3 md:col-span-2">
            <div className="grid grid-cols-12">
              <div className="col-span-1 w-8 h-8 relative rounded-full overflow-hidden mt-4">
                <Image src="/profile-placeholder.png" alt="" layout="fill" />
              </div>
              <div className="flex justify-between col-span-10">
                <div className="">
                  <div className="flex">
                    <p className="font-medium">John Doe</p>
                  </div>
                  <div className="bg-gray-300 p-4 rounded-xl text-sm mb-4">
                    <p>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Excepturi explicabo obcaecati doloremque quasi beatae?
                      Earum pariatur sequi repudiandae reprehenderit, a maiores
                      culpa suscipit consequatur expedita officia reiciendis,
                      tenetur aperiam corporis.
                    </p>
                  </div>
                </div>
              </div>

              {/* {messages.length &&
                messages.map((mesg) => {
                  return <p>{mesg.text}</p>;
                })} */}
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-1 w-8 h-8 relative rounded-full overflow-hidden mt-4">
                <Image src="/profile-placeholder.png" alt="" layout="fill" />
              </div>
              <div className="flex justify-between col-span-10">
                <div className="">
                  <div className="flex">
                    <p className="font-medium">John Doe</p>
                  </div>
                  <div className="bg-gray-300 p-4 rounded-xl text-sm mb-4">
                    <p>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Excepturi explicabo obcaecati doloremque quasi beatae?
                      Earum pariatur sequi repudiandae reprehenderit, a maiores
                      culpa suscipit consequatur expedita officia reiciendis,
                      tenetur aperiam corporis.
                    </p>
                  </div>
                </div>
              </div>

              {/* {messages.length &&
                messages.map((mesg) => {
                  return <p>{mesg.text}</p>;
                })} */}
            </div>
            <div className="flex relative">
              <input
                className="form-input border-2 rounded-md px-4 py-4 flex-grow"
                name="msg"
                id=""
                placeholder="Type your message"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />

              <button
                className="absolute text-yellow right-0 mr-4 transform top-1/2 -translate-y-2/4"
                onClick={() => {
                  const peerId =
                    authUser.role === "client"
                      ? room.provider.id
                      : room.client.id;
                  console.log({ peerId });
                  sendMessageToPeer(msg, peerId);
                }}
              >
                <IoMdSend className="text-3xl" />
              </button>
            </div>
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
