import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { AiOutlinePaperClip } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";
import { db } from "../../config/firebaseConfig";
import { useAgora } from "../../context/agoraContextNoSsr";
import { useFirebaseAuth } from "../../context/authContext";
import { v4 as uuidv4 } from "uuid";
import AttachementUpload from "./AttachementUpload";

function CreateMessage({ room, setShowModal }) {
  const [msg, setMsg] = useState("");
  const [id, setId] = useState(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const { authUser } = useFirebaseAuth();
  const { message, sendMessageToPeer } = useAgora();

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

  const handleUserKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // e.preventDefault();
      sendMessage(e); // this won't be triggered
    }
  };
  return (
    <>
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
            <textarea
              className="border-2 rounded-md px-4 py-4 flex-grow pr-32"
              onKeyPress={handleUserKeyPress}
              name="msg"
              autoComplete="off"
              id=""
              placeholder="Type your message"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            ></textarea>
            <div className="absolute right-0 transform top-1/2 -translate-y-2/4 flex">
              <div className="">
                <label className="w-full flex items-center justify-center px-4 py-3 bg-white rounded-md  tracking-wide cursor-pointer ease-linear transition-all duration-150">
                  <div className="text-3xl text-green">
                    <AiOutlinePaperClip />
                  </div>

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

              <button className=" text-yellow  mr-4 " type="submit">
                <IoMdSend className="text-3xl" />
              </button>
            </div>
          </div>
        </form>
        <div className="flex w-full justify-between">
          <p className="text-sm">*Press Shift+Enter to start a new Line</p>
          {authUser.role === "provider" && (
            <button
              onClick={() => setShowModal(true)}
              className="text-green font-medium text-sm mr-2"
            >
              Create Offer
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default CreateMessage;
