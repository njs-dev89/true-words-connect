import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  collection,
  doc,
  limit,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "@firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useFirebaseAuth } from "../../context/authContext";
import dayjs from "dayjs";
import ScrollableFeed from "react-scrollable-feed";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function Messages({ room }) {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState(null);
  const { authUser } = useFirebaseAuth();
  //   const mesgRef = useRef<any>();

  useEffect(() => {
    const q = query(
      collection(db, `/messageRooms/${room.id}/messages`),
      limitToLast(50),
      orderBy("time", "asc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data["id"] = doc.id;
        messages.push(data);
      });
      setLoading(true);
      console.log(messages);
      setMessages(messages);

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (messages) {
      const roomData =
        authUser.role === "client"
          ? { client: { hasUnreadMessages: false } }
          : { provider: { hasUnreadMessages: false } };
      setDoc(doc(db, `/messageRooms/${room.id}`), roomData, {
        merge: true,
      });
      const unreadMsgs = messages.filter((msg) => {
        return msg.senderId !== authUser.uid && msg.hasReceiverRead === false;
      });
      unreadMsgs.forEach((msg) => {
        const msgRef = setDoc(
          doc(db, `/messageRooms/${room.id}/messages/${msg.id}`),
          { hasReceiverRead: true },
          { merge: true }
        );
      });
    }
  }, [messages]);

  //   useEffect(() => {
  //     // mesgRef.current?.scrollIntoView();
  //     if (mesgRef) {
  //       mesgRef.current?.scrollIntoView();
  //     }
  //   }, [messages, mesgRef.current]);
  if (loading) {
    return <p>Loading....</p>;
  } else {
    return (
      <div className="h-64 overflow-auto mb-4">
        <ScrollableFeed>
          {messages &&
            messages.reverse().map((message) => (
              <div className="grid grid-cols-12" key={message.id}>
                <div className="col-span-1 w-8 h-8 relative rounded-full overflow-hidden mt-4">
                  <Image
                    src={
                      room.client.id === message.senderId
                        ? room.client.profile_pic
                        : room.provider.profile_pic
                    }
                    alt=""
                    layout="fill"
                  />
                </div>
                <div className="col-span-10">
                  <div className="flex justify-between">
                    <p className="font-medium">
                      {authUser.uid === message.senderId
                        ? "Me"
                        : room.client.id === message.senderId
                        ? room.client.username
                        : room.provider.username}
                    </p>
                    <p className="text-sm">
                      {dayjs(message.time.toDate()).fromNow()}
                    </p>
                  </div>
                  <div className="bg-gray-300 p-4 rounded-xl text-sm mb-4 inline-block">
                    <p>{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
        </ScrollableFeed>
        {/* <span ref={mesgRef}></span> */}
      </div>
    );
  }
}

export default Messages;
