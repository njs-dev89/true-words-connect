import React, { useEffect, useState } from "react";
import { useAgora } from "../../context/agoraContextNoSsr";
import { useRouter } from "next/router";
import { addDoc, collection, doc, setDoc } from "@firebase/firestore";
import { db, storage } from "../../config/firebaseConfig";
import { useFirebaseAuth } from "../../context/authContext";
import MessageRooms from "./MessageRooms";
import { IoMdSend } from "react-icons/io";
import Messages from "./Messages";
import CreateOffer from "../Profile/CreateOffer";
import { AiOutlinePaperClip } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import AttachementUpload from "./AttachementUpload";

function MessagesTab({ loading, rooms }) {
  const router = useRouter();
  const { authUser } = useFirebaseAuth();
  const { peersOnline, agoraLoginStatus } = useAgora();
  const [room, setRoom] = useState(null);
  const { message, sendMessageToPeer } = useAgora();
  const [msg, setMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);

  const [files, setFiles] = useState([]);

  const attachFiles = (e) => {
    if (!id) {
      setId(uuidv4());
    }
    if (files && files.length > 5) {
      return setError("You can not attach more than 5 files");
    }
    if (files && e.target.files[0].length + files.length > 5) {
      return setError("You can not attach more than 5 files");
    }
    if (e.target.files[0].length > 5) {
      return setError("You can not attach more than 5 files");
    }
    console.log(e.target.files);

    e.target.files.forEach(function (file) {
      file.uploadComplete = false;
    });
    setFiles((prevFiles) => [...prevFiles, ...e.target.files]);
  };

  useEffect(() => {
    if (!loading && agoraLoginStatus === "connected") {
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
  }, [loading, agoraLoginStatus]);

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
    if (files.length > 0) {
      const attachements = files.map((file) => {
        return { name: file.name, downloadUrl: file.downloadURL };
      });
      console.log(attachements);
      await setDoc(doc(db, `/messageRooms/${room.id}/messages/${id}`), {
        text: msg,
        senderId: authUser.uid,
        hasReceiverRead: false,
        attachements,
        time: new Date(),
      });
      setFiles([]);
      setId(null);
    } else {
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
    }

    setMsg("");
    sendMessageToPeer(`MESSAGE;${msg}`, peerId);
  };
  return (
    <div className="grid grid-cols-3 gap-4">
      {console.log(message)}
      {!loading && rooms.length > 0 ? (
        <>
          <MessageRooms rooms={rooms} />
          <div className="col-span-3 md:col-span-2">
            {room && <Messages room={room} />}
            <div className="flex mb-2">
              {files.map((file, idx) => (
                <AttachementUpload
                  file={file}
                  files={files}
                  setFiles={setFiles}
                  id={id}
                  room={room}
                  key={idx}
                />
              ))}
            </div>
            <div className="flex flex-col items-end gap-2">
              <form onSubmit={sendMessage} className="w-full">
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
                  <div className="absolute right-0 transform top-1/2 -translate-y-2/4 flex">
                    <div className="">
                      <label className="w-full flex items-center justify-center px-4 py-3 bg-white rounded-md  tracking-wide cursor-pointer ease-linear transition-all duration-150">
                        <div className="text-3xl text-green">
                          <AiOutlinePaperClip />
                        </div>
                        {/* <div className="text-base ml-2 mr-2">Upload Scanned Id Card</div>
        {upload && (
          <ProgressRing radius={12} stroke={2} progress={idCardProgress} />
        )}
        {!upload && uploadSuccess && <FcOk className="text-xl" />}
        {!upload && uploadFailed && <FcHighPriority className="text-xl" />} */}

                        <input
                          type="file"
                          name="attachement"
                          multiple
                          id="attachement"
                          className="hidden"
                          onChange={attachFiles}
                        />
                      </label>
                    </div>
                    {/* <button type="button" className="text-green text-3xl mr-3" onClick={attachFiles}>
                      <AiOutlinePaperClip />
                    </button> */}
                    <button
                      className=" text-yellow  mr-4 "
                      // onClick={sendMessage}
                    >
                      <IoMdSend className="text-3xl" />
                    </button>
                  </div>
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
