import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "@firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useFirebaseAuth } from "../context/authContext";

function UserOffers() {
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const { authUser } = useFirebaseAuth();

  useEffect(() => {
    const offersCollection = collection(db, `/offers`);
    const q = query(offersCollection, where("client.id", "==", authUser.uid));
    const unsubscribe = onSnapshot(q, {}, (querySnapshot) => {
      const offers = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data["id"] = doc.id;
        offers.push(data);
      });
      console.log(offers);
      setOffers(offers);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const acceptOffer = async (offerData) => {
    const ordersCollection = collection(db, `/orders`);
    try {
      offerData.status = "active";
      const offerDocRef = await addDoc(ordersCollection, offerData);
      await deleteDoc(doc(db, `/offers/${offerData.id}`));
    } catch (error) {
      console.error(error);
    }
  };
  return offers.length > 0 ? (
    <div className="mt-8">
      <h3 className="text-blue font-bold text-xl mb-6">Orders</h3>
      <table className="w-full text-gray-700 table-bottom-spaced bordered-table">
        <thead>
          <tr>
            <th className="py-4 font-medium">Name</th>
            <th className="py-4 font-medium">Service</th>
            <th className="py-4 font-medium">Price</th>
            <th className="py-4 font-medium">Status</th>
            <th className="py-4 font-medium">Type</th>
            <th className="py-4 font-medium">Contract Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading && <p>Loading...</p>}
          {!loading &&
            offers.length > 0 &&
            offers.map((offer) => (
              <tr className="" key={offer.id}>
                <td className="py-4 flex justify-center gap-3 items-center">
                  <div className="w-8 h-8 relative rounded-full overflow-hidden">
                    <Image
                      src={offer.translator.profile_pic}
                      alt=""
                      layout="fill"
                    />
                  </div>
                  {offer.translator.username}
                </td>
                <td className="py-4 text-center">{offer.service}</td>
                <td className="py-4 text-center">${offer.price}</td>
                <td className="py-4 text-center">Active</td>
                <td className="py-4 text-center">{offer.serviceType}</td>
                <td className="py-4 text-center">{offer.contractType}</td>
                <td className="py-2 text-center">
                  <button
                    className="btn-blue btn-small"
                    onClick={() => acceptOffer(offer)}
                  >
                    Accept
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  ) : authUser.role === "client" ? (
    <div className="col-span-3 mt-16">
      <p className="text-center">You haven&apos;t recieved any offer yet</p>
    </div>
  ) : (
    <div className="col-span-3 mt-16">
      <p className="text-center">You haven&apos;t sent any offer</p>
    </div>
  );
}

export default UserOffers;
