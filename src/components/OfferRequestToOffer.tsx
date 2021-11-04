import { useRouter } from "next/router";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useFirebaseAuth } from "../context/authContext";
import { doc, collection, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

function OfferRequestToOffer({ setShowModal, reqData }) {
  const [offerAmount, setOfferAmount] = useState(0);
  const { authUser } = useFirebaseAuth();
  console.log(authUser);
  const handleSubmit = async (e) => {
    e.preventDefault();
    delete reqData.budget;
    reqData.price = offerAmount;
    reqData.translator = {
      id: authUser.uid,
      username: authUser.profile.username,
      profile_pic: authUser.profile.profile_pic,
    };
    const offerCollection = collection(db, `/offers`);
    try {
      const offerDocRef = await addDoc(offerCollection, reqData);
      await deleteDoc(
        doc(db, `/translators/${authUser.uid}/offerRequest`, reqData.id)
      );
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-center justify-between py-3 mx-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-lg text-blue font-semibold">Offer Request</h3>
              <button
                className="ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                  x
                </span>
              </button>
            </div>
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
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default OfferRequestToOffer;
