import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "@firebase/firestore";
import * as React from "react";
import { db } from "../../config/firebaseConfig";
import { useFirebaseAuth } from "../../context/authContext";
import OfferRequestToOffer from "./OfferRequestToOffer";
import Image from "next/image";
import { useSiteNotificationContext } from "../../context/siteNotificationsContext";

function OfferRequest() {
  const { setSiteInfo, setSiteErrors } = useSiteNotificationContext();
  const { authUser } = useFirebaseAuth();
  const [showModal, setShowModal] = React.useState(false);
  const [requestData, setRequestData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [offerRequests, setOfferRequests] = React.useState(null);

  const [filter, setFilter] = React.useState("all");

  React.useEffect(() => {
    const offerRequestCollection = collection(
      db,
      `/providers/${authUser.uid}/offerRequest`
    );
    let q;
    if (filter === "all") {
      q = query(offerRequestCollection);
    } else {
      q = query(offerRequestCollection, where("status", "==", filter));
    }
    const unsubscribe = onSnapshot(q, {}, (querySnapshot) => {
      const offerRequests = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data["id"] = doc.id;
        offerRequests.push(data);
      });

      setOfferRequests(offerRequests);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filter]);

  const acceptRequest = async (req) => {
    req.price = req.budget;
    delete req.budget;
    req.provider = {
      id: authUser.uid,
      username: authUser.profile.username,
      profile_pic: authUser.profile.profile_pic,
      email: authUser.profile.email,
    };
    const offerCollection = collection(db, `/offers`);

    try {
      const offerDocRef = await addDoc(offerCollection, req);

      await setDoc(
        doc(db, `/providers/${authUser.uid}/offerRequest`, req.id),
        { status: "offer sent" },
        { merge: true }
      );
      setSiteInfo("Offer Sent Successfully");
    } catch (error) {
      console.error(error);
      setSiteErrors("Offer could not be sent. Try again");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-blue font-bold text-xl mb-6">Offer Requests</h3>
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
          className={`btn ${filter === "offer sent" ? "bg-gray-200" : ""}`}
          onClick={() => setFilter("offer sent")}
        >
          Offer Sent
        </button>
      </div>
      <div className="w-full text-gray-700 table-bottom-spaced bordered-table">
        {loading && <p>Loading...</p>}
        {!loading && offerRequests.length === 0 && (
          <p>No {filter === "all" ? "" : filter} offer requests to show</p>
        )}
        {!loading &&
          offerRequests.length > 0 &&
          offerRequests.map((req) => {
            return (
              <div className=" border-2 p-4 rounded-lg mb-8" key={req.id}>
                <div className="flex flex-col sm:flex-row sm:justify-between items-center sm:items-end mb-4">
                  <div className="flex gap-4">
                    <h3 className="font-medium text-lg">Client:</h3>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 relative rounded-full overflow-hidden">
                        <Image
                          src={req.client.profile_pic}
                          alt=""
                          layout="fill"
                        />
                      </div>
                      <p>{req.client.username}</p>
                    </div>
                  </div>
                  <div className="mt-8 sm:mt-0">
                    <button
                      disabled={req.satatus === "offer sent"}
                      className={`btn-small mr-2 ${
                        req.status === "active"
                          ? "btn-green"
                          : "bg-gray-200 text-gray-400 cursor-default"
                      }`}
                      onClick={() => {
                        setRequestData(req);
                        setShowModal(true);
                      }}
                    >
                      Create Offer
                    </button>
                    <button
                      disabled={req.status !== "active"}
                      className={`btn-small mr-2 ${
                        req.status === "active"
                          ? "btn-blue"
                          : "bg-gray-200 text-gray-400 cursor-default"
                      }`}
                      onClick={(e) => {
                        acceptRequest(req);
                      }}
                    >
                      Accept
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex gap-4">
                    <h3 className="font-medium">Service:</h3>
                    <div className="flex gap-2">
                      <p>{req.service}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <h3 className="font-medium">Budget:</h3>
                    <div className="flex gap-2">
                      <p>${req.budget}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <h3 className="font-medium">Contract Type:</h3>
                    <div className="flex gap-2">
                      <p>{req.contractType}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <h3 className="font-medium">Duration:</h3>
                    <div className="flex gap-2">
                      <p>
                        {req.contractType === "hourly"
                          ? `${req.hours} hrs`
                          : `${req.days} days`}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <h3 className="font-medium">Service Type:</h3>
                    <div className="flex gap-2">
                      <p>{req.serviceType}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <h3 className="font-medium">Status:</h3>
                    <div className="flex gap-2">
                      <p>{req.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        {showModal && (
          <OfferRequestToOffer
            setShowModal={setShowModal}
            reqData={requestData}
          />
        )}
      </div>
    </div>
  );
}

export default OfferRequest;
