import { collection, onSnapshot, query } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../config/firebaseConfig";
import { useFirebaseAuth } from "../context/authContext";
import OfferRequestToOffer from "./OfferRequestToOffer";
import TableRowCollapse from "./TableRowCollapse";

function OfferRequest() {
  const { authUser } = useFirebaseAuth();
  const [showModal, setShowModal] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offerRequests, setOfferRequests] = useState(null);

  useEffect(() => {
    const offerRequestCollection = collection(
      db,
      `/translators/${authUser.uid}/offerRequest`
    );
    const q = query(offerRequestCollection);
    const unsubscribe = onSnapshot(q, {}, (querySnapshot) => {
      const offerRequests = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data["id"] = doc.id;
        offerRequests.push(data);
      });
      console.log(offerRequests);
      setOfferRequests(offerRequests);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  } else {
    return offerRequests.length > 0 ? (
      <div className="mt-8">
        <h3 className="text-blue font-bold text-xl mb-6">Offer Requests</h3>
        <div className="w-full text-gray-700 table-bottom-spaced bordered-table">
          <div className="grid grid-cols-7 border-2 rounded-lg">
            <div className="py-4 font-medium text-center">Client</div>
            <div className="py-4 font-medium text-center">Service</div>
            <div className="py-4 font-medium text-center">Budget</div>
            <div className="py-4 font-medium text-center">Contract</div>
            <div className="py-4 font-medium text-center">Duration</div>
            <div className="py-4 font-medium text-center">Type</div>
            <div className="py-4 font-medium col-span-1"></div>
          </div>

          {offerRequests.map((req) => {
            return (
              <TableRowCollapse
                rowItems={[
                  req.client.username,
                  req.service,
                  `$${req.budget}`,
                  req.contractType,
                  req.contractType === "hourly"
                    ? `${req.hours} hrs`
                    : `${req.days} days`,
                  req.serviceType,
                ]}
              >
                <div className="ml-12">
                  {req.contractType === "fullDay" ? (
                    <div className="flex">
                      <h3>Start Day:</h3>
                      <p>{req.startDate.seconds}</p>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flex">
                    <h3>Language:</h3>
                    <p>{req.language}</p>
                  </div>
                  <button
                    className="btn btn-green"
                    onClick={() => {
                      setRequestData(req);
                      setShowModal(true);
                    }}
                  >
                    Create Offer
                  </button>
                </div>
              </TableRowCollapse>
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
    ) : authUser.role === "client" ? (
      <div className="col-span-3 mt-16">
        <p className="text-center">
          You haven't sent any offer request yet yet
        </p>
      </div>
    ) : (
      <div className="col-span-3 mt-16">
        <p className="text-center">
          You haven't recieved any offer request yet
        </p>
      </div>
    );
  }
}

export default OfferRequest;
