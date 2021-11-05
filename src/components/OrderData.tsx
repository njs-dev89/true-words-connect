import React from "react";
import { useFirebaseAuth } from "../context/authContext";

function OrderData({ order }) {
  const { authUser } = useFirebaseAuth();
  console.log({ order });
  return (
    <div className="bg-white shadow-md mb-16 px-6 py-4 rounded-md">
      <div className="flex justify-between items-baseline border-b">
        <h3 className="text-blue font-bold text-xl mb-8 mt-4">Order Details</h3>
        <button className="px-4 py-2 rounded text-white bg-red-500 shadow-md">
          Cancel Order
        </button>
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
