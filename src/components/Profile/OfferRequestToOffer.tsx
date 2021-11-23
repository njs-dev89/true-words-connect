import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useFirebaseAuth } from "../../context/authContext";
import { doc, collection, addDoc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import ModalContainer from "../ModalContainer";

function OfferRequestToOffer({ setShowModal, reqData }) {
  const [offerAmount, setOfferAmount] = useState(0);
  const { authUser } = useFirebaseAuth();
  console.log(authUser);
  const handleSubmit = async (e) => {
    e.preventDefault();
    delete reqData.budget;
    reqData.price = offerAmount;
    reqData.status = "active";
    reqData.provider = {
      id: authUser.uid,
      username: authUser.profile.username,
      profile_pic: authUser.profile.profile_pic,
      email: authUser.profile.email,
    };
    const offerCollection = collection(db, `/offers`);
    try {
      const offerDocRef = await addDoc(offerCollection, reqData);
      await setDoc(
        doc(db, `/providers/${authUser.uid}/offerRequest`, reqData.id),
        { status: "offer Sent" },
        { merge: true }
      );
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ModalContainer title="Create Offer" setShowModal={setShowModal}>
      {/*body*/}
      <form
        className="w-96 px-8 py-8 overflow-y-auto h-3/4 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Enter offer amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              min="0"
              name="price"
              id="price"
              value={offerAmount}
              onChange={(e) => setOfferAmount(Number(e.target.value))}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-6 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
        </div>

        <button className="btn btn-green">Send Offer</button>
      </form>
      {/*Endbody*/}
    </ModalContainer>
  );
}

export default OfferRequestToOffer;
