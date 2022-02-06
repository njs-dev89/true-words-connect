import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
} from "@firebase/firestore";
import { where } from "firebase/firestore";
import { useRouter } from "next/router";
import * as React from "react";
import { db } from "../../config/firebaseConfig";
import { useFirebaseAuth } from "../../context/authContext";
import CreateOfferRequest from "./CreateOfferRequest";

function ProviderOverview({ provider }) {
  const router = useRouter();
  const { authUser } = useFirebaseAuth();
  const [showModal, setShowModal] = React.useState(false);
  const createMessage = async (client, provider) => {
    if (authUser.uid === provider.id) {
      return;
    }
    const messageRoomsCollection = collection(db, `/messageRooms`);

    try {
      const q = query(
        messageRoomsCollection,
        where("client.id", "==", client.id),
        where("provider.id", "==", provider.id)
      );
      const roomsSnap = await getDocs(q);
      if (roomsSnap.empty) {
        const msgRoomDocRef = await addDoc(messageRoomsCollection, {
          client: {
            id: client.id,
            username: client.username,
            profile_pic: client.profile_pic,
            email: client.email,
          },
          provider: {
            id: provider.id,
            username: provider.username,
            profile_pic: provider.profile_pic,
            email: provider.email,
          },
        });
        const msgRoomSnap = await getDoc(msgRoomDocRef);
        return router.push(`/profile/messages?room=${msgRoomSnap.id}`);
      } else {
        let roomId;
        roomsSnap.forEach((r) => {
          roomId = r.id;
        });
        return router.push(`/profile/messages?room=${roomId}`);
      }
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
                console.log(provider);
                if (!authUser) {
                  return router.push("/login");
                }
                createMessage(
                  {
                    id: authUser?.uid,
                    username: authUser.profile.username,
                    profile_pic: authUser.profile.profile_pic,
                    email: authUser.profile.email,
                  },
                  {
                    id: provider.id,
                    username: provider.username,
                    profile_pic: provider.profile_pic,
                    email: provider.email,
                  }
                );
              }}
            >
              Send message
            </button>
          </div>
        </div>
        <p className="p-4 mt-4 pb-8 border rounded">{provider.about}</p>
      </div>
      <div className="mt-6">
        <h3 className="text-blue font-bold text-xl">Languages</h3>
        <ul className="list-disc list-inside mt-4">
          {provider.languages.map((lang, idx) => (
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

export default ProviderOverview;
