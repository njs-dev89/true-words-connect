import * as React from "react";
import Image from "next/image";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "@firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useFirebaseAuth } from "../../context/authContext";

function SentOffers() {
  const [loading, setLoading] = React.useState(false);
  const [offers, setOffers] = React.useState([]);
  const { authUser } = useFirebaseAuth();
  const [filter, setFilter] = React.useState("all");

  React.useEffect(() => {
    const offersCollection = collection(db, `/offers`);
    let q;
    if (filter === "all") {
      q = query(offersCollection, where("provider.id", "==", authUser.uid));
    } else {
      q = query(
        offersCollection,
        where("provider.id", "==", authUser.uid),
        where("status", "==", filter)
      );
    }
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
  }, [filter]);

  const withdrawOffer = async (id) => {
    try {
      await setDoc(
        doc(db, `/offers/${id}`),
        { status: "withdrawn" },
        { merge: true }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-8 overflow-auto">
      <h3 className="text-blue font-bold text-xl mb-6">Offers</h3>
      <div className="gap-3 flex justify-end mb-8">
        <button
          className={`btn ${filter === "all" ? "bg-gray-200" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`btn ${filter === "active" ? "bg-gray-200" : ""}`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`btn ${filter === "accepted" ? "bg-gray-200" : ""}`}
          onClick={() => setFilter("accepted")}
        >
          Accepted
        </button>
        <button
          className={`btn ${filter === "rejected" ? "bg-gray-200" : ""}`}
          onClick={() => setFilter("rejected")}
        >
          Rejected
        </button>
        <button
          className={`btn ${filter === "withdrawn" ? "bg-gray-200" : ""}`}
          onClick={() => setFilter("withdrawn")}
        >
          Withdrawn
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {!loading &&
        offers.length > 0 &&
        offers.map((offer) => {
          return (
            <div className=" border-2 p-4 rounded-lg mb-8" key={offer.id}>
              <div className="flex flex-col sm:flex-row sm:justify-between items-center sm:items-end mb-4">
                <div className="flex gap-4">
                  <h3 className="font-medium text-lg">Provider:</h3>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 relative rounded-full overflow-hidden">
                      <Image
                        src={offer.provider.profile_pic}
                        alt=""
                        layout="fill"
                      />
                    </div>
                    <p>{offer.provider.username}</p>
                  </div>
                </div>
                <div className="mt-8 sm:mt-0">
                  <button
                    disabled={offer.status !== "active"}
                    className={`btn-small mr-2 ${
                      offer.status === "active"
                        ? "btn-blue"
                        : "bg-gray-200 text-gray-400 cursor-default"
                    }`}
                    onClick={() => withdrawOffer(offer.id)}
                  >
                    Withdraw
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex gap-4">
                  <h3 className="font-medium">Service:</h3>
                  <div className="flex gap-2">
                    <p>{offer.service}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <h3 className="font-medium">Price:</h3>
                  <div className="flex gap-2">
                    <p>${offer.price}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <h3 className="font-medium">Contract Type:</h3>
                  <div className="flex gap-2">
                    <p>{offer.contractType}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <h3 className="font-medium">Duration:</h3>
                  <div className="flex gap-2">
                    <p>
                      {offer.contractType === "hourly"
                        ? `${offer.hours} hrs`
                        : `${offer.days} days`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <h3 className="font-medium">Service Type:</h3>
                  <div className="flex gap-2">
                    <p>{offer.serviceType}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <h3 className="font-medium">Status:</h3>
                  <div className="flex gap-2">
                    <p>{offer.status}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      {!loading && offers.length === 0 && (
        <p>No {filter === "all" ? "" : filter} offers to show</p>
      )}
    </div>
  );
}

export default SentOffers;
