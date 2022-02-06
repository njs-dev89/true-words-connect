import { doc, setDoc } from "@firebase/firestore";
import { httpsCallable } from "@firebase/functions";
import { useRouter } from "next/router";
import * as React from "react";
import { db, functions } from "../config/firebaseConfig";
import { useFirebaseAuth } from "../context/authContext";
import ModalContainer from "./ModalContainer";

const cancelOrder = httpsCallable(functions, "cancelOrder");

function OrderData({ order }) {
  const router = useRouter();
  const { authUser } = useFirebaseAuth();
  const [showModal, setShowModal] = React.useState(false);
  const [cancelError, setCancelError] = React.useState(null);

  console.log({ order });
  const cancelOrderCnfrm = async () => {
    const data = await cancelOrder({
      orderId: order.id,
      paymentIntentId: order.paymentIntentId,
    });
    if (data.data === "succeeded") {
      setShowModal(false);
    } else {
      setCancelError("Something went wrong. Try again");
    }
  };

  const deliverOrder = async () => {
    await setDoc(
      doc(db, `/orders/${router.query.id}`),
      { status: "delivered" },
      { merge: true }
    );
  };

  const acceptDelivery = async () => {
    await setDoc(
      doc(db, `/orders/${router.query.id}`),
      { status: "completed" },
      { merge: true }
    );
  };

  const rejectDelivery = async () => {
    await setDoc(
      doc(db, `/orders/${router.query.id}`),
      { status: "active" },
      { merge: true }
    );
  };
  return (
    <div className="bg-white shadow-md mb-16 px-6 py-4 rounded-md">
      {showModal && (
        <ModalContainer setShowModal={setShowModal} title="Cancel Order">
          <p>Are you sure you want to cancel the order?</p>
          {cancelError && (
            <p className="text-sm text-red font-medium">{cancelError}</p>
          )}
          <button onClick={cancelOrderCnfrm} className="btn btn-yellow">
            Yes
          </button>
          <button onClick={() => setShowModal(false)} className="btn btn-blue">
            Cancel
          </button>
        </ModalContainer>
      )}
      <div className="flex justify-between items-baseline border-b">
        <h3 className="text-blue font-bold text-xl mb-8 mt-4">Order Details</h3>

        {authUser.role === "provider" && (
          <div className="">
            <button
              disabled={order.status !== "active"}
              className={`btn mr-2 ${
                order.status === "active"
                  ? "btn-green"
                  : "bg-gray-200 text-gray-500"
              }`}
              onClick={deliverOrder}
            >
              Deliver Now
            </button>
            <button
              disabled={order.status !== "active"}
              onClick={() => setShowModal(true)}
              className={`btn ${
                order.status === "active"
                  ? "bg-red-500 border-red-500 text-white shadow-md"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              Cancel Order
            </button>
          </div>
        )}

        {authUser.role === "client" && order.status === "delivered" && (
          <div className="">
            <button
              disabled={order.status !== "delivered"}
              className={`btn mr-2 ${
                order.status === "delivered"
                  ? "btn-green"
                  : "bg-gray-200 text-gray-500"
              }`}
              onClick={acceptDelivery}
            >
              Accept Delivery
            </button>
            <button
              disabled={order.status !== "delivered"}
              onClick={rejectDelivery}
              className={`btn ${
                order.status === "delivered"
                  ? "bg-red-500 border-red-500 text-white shadow-md"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              Reject Delievry
            </button>
          </div>
        )}
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3">
        {authUser.role === "client" ? (
          <div className="flex my-4">
            <h3 className="font-medium mr-2">Provider:</h3>
            <p>{order.provider?.username || "John Doe"}</p>
          </div>
        ) : (
          <div className="flex my-4">
            <h3 className="font-medium mr-2">Client:</h3>
            <p>{order.client?.username || "John Doe"}</p>
          </div>
        )}
        <div className="flex my-4">
          <h3 className="font-medium mr-2">Amount:</h3>
          <p>${order.price || "20"}</p>
        </div>
        <div className="flex my-4">
          <h3 className="font-medium mr-2">Service:</h3>
          <p>${order.service}</p>
        </div>
        <div className="flex my-4">
          <h3 className="font-medium mr-2">Duration:</h3>
          <p>{order.hours ? `${order.hours} Hrs` : `${order.days} Days`}</p>
        </div>
        <div className="flex my-4">
          <h3 className="font-medium mr-2">Service Type:</h3>
          <p>{order.serviceType}</p>
        </div>
        <div className="flex my-4">
          <h3 className="font-medium mr-2">Contract Type:</h3>
          <p>{order.contractType}</p>
        </div>
      </div>
    </div>
  );
}

export default OrderData;
