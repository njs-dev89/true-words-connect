import { addDoc, collection, getDoc } from "@firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { db } from "../config/firebaseConfig";
import { useFirebaseAuth } from "../context/authContext";
import CreateOfferRequest from "./CreateOfferRequest";

function TranslatorOverview({ translator }) {
  const router = useRouter();
  const { authUser } = useFirebaseAuth();
  const [showModal, setShowModal] = useState(false);
  const createMessage = async (client, translator) => {
    const messageRoomsCollection = collection(db, `/messageRooms`);
    try {
      const msgRoomDocRef = await addDoc(messageRoomsCollection, {
        client: {
          id: client.id,
          username: client.username,
          profile_pic: client.profile_pic,
        },
        translator: {
          id: translator.id,
          username: translator.username,
          profile_pic: translator.profile_pic,
        },
      });
      const msgRoomSnap = await getDoc(msgRoomDocRef);
      router.push(`/profile/messages?room=${msgRoomSnap.id}`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="">
        {showModal && <CreateOfferRequest setShowModal={setShowModal} />}
        <div className="flex justify-between sm:items-end">
          <h3 className="text-blue font-bold text-xl">About</h3>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              className="btn-small btn-green xs:mr-2"
              onClick={() => {
                if (!authUser) {
                  return router.push("/login");
                }
                setShowModal(true);
              }}
            >
              Request an Offer
            </button>
            <button
              className="btn-small btn-blue"
              onClick={() => {
                console.log(translator);
                if (!authUser) {
                  return router.push("/login");
                }
                createMessage(
                  {
                    id: authUser?.uid,
                    username: authUser.profile.username,
                    profile_pic: authUser.profile.profile_pic,
                  },
                  {
                    id: translator.id,
                    username: translator.username,
                    profile_pic: translator.profile_pic,
                  }
                );
              }}
            >
              Send message
            </button>
          </div>
        </div>
        <p className="p-4 mt-4 pb-8 border rounded">{translator.about}</p>
      </div>
      <div className="mt-6">
        <h3 className="text-blue font-bold text-xl">Languages</h3>
        <ul className="list-disc list-inside mt-4">
          {translator.languages.map((lang, idx) => (
            <li key={idx} className="flex items-baseline mb-2">
              <span className="font-medium mr-2">{lang.language}</span>(
              {lang.proficiency})
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default TranslatorOverview;
