import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useFirebaseAuth } from "../context/authContext";

function UserOrders() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const { authUser } = useFirebaseAuth();

  useEffect(() => {
    const ordersCollection = collection(db, `/orders`);
    let q;
    if (authUser.role === "client") {
      q = query(ordersCollection, where("client.id", "==", authUser.uid));
    }
    if (authUser.role === "translator" || authUser.role === undefined) {
      q = query(ordersCollection, where("translator.id", "==", authUser.uid));
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
  }, []);
  return orders.length > 0 ? (
    <div className="mt-8">
      <h3 className="text-blue font-bold text-xl mb-6">Orders</h3>
      <table className="w-full text-gray-700 table-bottom-spaced bordered-table">
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
        <tbody>
          {loading && <p>Loading...</p>}
          {!loading &&
            orders.length > 0 &&
            orders.map((order) => (
              <tr className="" key={order.id}>
                <td className="py-4 flex justify-center gap-3 items-center">
                  <div className="w-8 h-8 relative rounded-full overflow-hidden">
                    <Image
                      src={
                        authUser.role === "client"
                          ? order.translator.profile_pic ||
                            "/profile-placeholder.png"
                          : order.client.profile_pic ||
                            "/profile-placeholder.png"
                      }
                      alt=""
                      layout="fill"
                    />
                  </div>
                  {authUser.role === "client"
                    ? order.translator.username || "John doe"
                    : order.client.username || "John doe"}
                </td>
                <td className="py-4 text-center">{order.service}</td>
                <td className="py-4 text-center">${order.price}</td>
                <td className="py-4 text-center">{order.status}</td>
                <td className="py-4 text-center">{order.serviceType}</td>
                <td className="py-4 text-center">{order.contractType}</td>

                <td>
                  <Link href={`/profile/orders/${order.id}`}>
                    <a className="text-yellow-600">Details</a>
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  ) : authUser.role === "client" ? (
    <div className="col-span-3 mt-16">
      <p className="text-center">You haven&apos;t ordered yet</p>
    </div>
  ) : (
    <div className="col-span-3 mt-16">
      <p className="text-center">You haven&apos;t recieved any order yet</p>
    </div>
  );
}

export default UserOrders;
