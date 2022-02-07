import * as React from "react";
import Image from "next/image";
import {
  collection,
  doc,
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
import { useRouter } from "next/router";
import { HiDownload } from "react-icons/hi";

dayjs.extend(relativeTime);

function Messages({ room }) {
  const [loading, setLoading] = React.useState(true);
  const [messages, setMessages] = React.useState(null);
  const { authUser } = useFirebaseAuth();
  const router = useRouter();

  const downloadFile = (url, name) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = (event) => {
      const blob = xhr.response;
      if (window !== undefined) {
        var saveBlob = (function () {
          let a = document.createElement("a");
          document.body.appendChild(a);

          return function (blob, fileName) {
            var url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
          };
        })();

        saveBlob(blob, name);
      }
    };
    xhr.open("GET", url);
    xhr.send();
  };

  React.useEffect(() => {
    const q = query(
      collection(db, `/messageRooms/${router.query.room}/messages`),
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

      setMessages(messages);

      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  React.useEffect(() => {
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

  if (loading) {
    return <p>Loading....</p>;
  } else {
    return (
      <div className="h-64 overflow-auto mb-4">
        <ScrollableFeed>
          {messages &&
            messages.map((message) => (
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
                  <div
                    className={`p-4 rounded-xl text-sm mb-4 inline-block ${
                      authUser.uid === message.senderId
                        ? "bg-gray-100"
                        : "bg-gray-300"
                    }`}
                  >
                    <p>{message.text}</p>
                    {message.attachements ? (
                      <ol className="text-green font-medium ml-0">
                        {message.attachements.map((attach, idx) => (
                          <li key={idx + 1}>
                            <button
                              className="flex items-center"
                              onClick={() =>
                                downloadFile(attach.downloadUrl, attach.name)
                              }
                            >
                              {attach.name} <HiDownload />
                            </button>
                          </li>
                        ))}
                      </ol>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
        </ScrollableFeed>
      </div>
    );
  }
}

export default Messages;
