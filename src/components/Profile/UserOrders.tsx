import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useFirebaseAuth } from "../../context/authContext";

function UserOrders() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const { authUser } = useFirebaseAuth();

  useEffect(() => {
    const ordersCollection = collection(db, `/orders`);
    let q;
    if (authUser.role === "client") {
      if (filter === "all") {
        q = query(ordersCollection, where("client.id", "==", authUser.uid));
      } else {
        q = query(
          ordersCollection,
          where("client.id", "==", authUser.uid),
          where("status", "==", filter)
        );
      }
    }
    if (authUser.role === "provider" || authUser.role === undefined) {
      if (filter === "all") {
        q = query(ordersCollection, where("provider.id", "==", authUser.uid));
      } else {
        q = query(
          ordersCollection,
          where("provider.id", "==", authUser.uid),
          where("status", "==", filter)
        );
      }
    }

    const unsubscribe = onSnapshot(q, {}, (querySnapshot) => {
      const orders = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data["id"] = doc.id;
        orders.push(data);
      });
      console.log(orders);
      setOrders(orders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filter]);
  return (
    <div className="mt-8 overflow-x-auto">
      <h3 className="text-blue font-bold text-xl mb-6">Orders</h3>
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
          className={`btn ${filter === "cancelled" ? "bg-gray-200" : ""}`}
          onClick={() => setFilter("cancelled")}
        >
          Cancelled
        </button>
        <button
          className={`btn ${filter === "delivered" ? "bg-gray-200" : ""}`}
          onClick={() => setFilter("delivered")}
        >
          Delivered
        </button>
        <button
          className={`btn ${filter === "completed" ? "bg-gray-200" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>
      {/* <table
        className="w-full text-gray-700 table-bottom-spaced bordered-table"
        style={{ minWidth: "600px" }}
      >
        <thead>
          <tr>
            <th className="py-4 font-medium">CLient</th>
            <th className="py-4 font-medium">Service</th>
            <th className="py-4 font-medium">Price</th>
            <th className="py-4 font-medium">Status</th>
            <th className="py-4 font-medium">Type</th>
            <th className="py-4 font-medium">Contract Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody> */}
      {loading && <p>Loading...</p>}
      {!loading &&
        orders.length > 0 &&
        orders.map((order) => {
          return (
            <div className=" border-2 p-4 rounded-lg mb-8" key={order.id}>
              <div className="flex flex-col sm:flex-row sm:justify-between items-center sm:items-end mb-4 mt-4">
                <div className="flex gap-4">
                  <h3 className="font-medium text-lg">
                    {authUser.role === "client" ? "Provider:" : "Client:"}
                  </h3>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 relative rounded-full overflow-hidden">
                      <Image
                        src={
                          authUser.role === "client"
                            ? order.provider.profile_pic
                            : order.client.profile_pic
                        }
                        alt=""
                        layout="fill"
                      />
                    </div>
                    <p>
                      {authUser.role === "client"
                        ? order.provider.username
                        : order.client.username}
                    </p>
                  </div>
                </div>

                <Link href={`/profile/orders/${order.id}`}>
                  <a className="text-yellow">Details</a>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex gap-4">
                  <h3 className="font-medium">Service:</h3>
                  <div className="flex gap-2">
                    <p>{order.service}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <h3 className="font-medium">Price:</h3>
                  <div className="flex gap-2">
                    <p>${order.price}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <h3 className="font-medium">Contract Type:</h3>
                  <div className="flex gap-2">
                    <p>{order.contractType}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <h3 className="font-medium">Duration:</h3>
                  <div className="flex gap-2">
                    <p>
                      {order.contractType === "hourly"
                        ? `${order.hours} hrs`
                        : `${order.days} days`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <h3 className="font-medium">Service Type:</h3>
                  <div className="flex gap-2">
                    <p>{order.serviceType}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <h3 className="font-medium">Status:</h3>
                  <div className="flex gap-2">
                    <p>{order.status}</p>
                  </div>
                </div>
              </div>
            </div>
            //   <tr className="" key={order.id}>
            //     <td className="py-4 flex justify-center gap-3 items-center">
            //       <div className="w-8 h-8 relative rounded-full overflow-hidden">
            //         <Image
            //           src={
            //             authUser.role === "client"
            //               ? order.provider.profile_pic ||
            //                 "/profile-placeholder.png"
            //               : order.client.profile_pic ||
            //                 "/profile-placeholder.png"
            //           }
            //           alt=""
            //           layout="fill"
            //         />
            //       </div>
            //       {authUser.role === "client"
            //         ? order.provider.username || "John doe"
            //         : order.client.username || "John doe"}
            //     </td>
            //     <td className="py-4 text-center">{order.service}</td>
            //     <td className="py-4 text-center">${order.price}</td>
            //     <td className="py-4 text-center">{order.status}</td>
            //     <td className="py-4 text-center">{order.serviceType}</td>
            //     <td className="py-4 text-center">{order.contractType}</td>

            //     <td>
            //       <Link href={`/profile/orders/${order.id}`}>
            //         <a className="text-yellow">Details</a>
            //       </Link>
            //     </td>
            //   </tr>
          );
        })}

      {/* </tbody>
      // </table> */}
      {orders.length === 0 && (
        <p className="text-center mt-4">
          No {filter === "all" ? "" : filter} Orders to show
        </p>
      )}
    </div>
  );
  // : authUser.role === "client" ? (
  //   <div className="col-span-3 mt-16">
  //     <p className="text-center">You haven&apos;t ordered yet</p>
  //   </div>
  // ) : (
  //   <div className="col-span-3 mt-16">
  //     <p className="text-center">You haven&apos;t recieved any order yet</p>
  //   </div>
  // );
}

export default UserOrders;
