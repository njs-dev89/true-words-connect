import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { doc } from "@firebase/firestore";
import { db } from "../config/firebaseConfig";
import UserDetails from "./Profile/UserDetails";
import { useFirebaseAuth } from "../context/authContext";
import OrderData from "./OrderData";
import OrderReviews from "./OrderReviews";
import { onSnapshot } from "firebase/firestore";

const VideoChatNoSSR = dynamic(() => import("./VideoChatAgora"), {
  ssr: false,
});

function OrderDetails() {
  const router = useRouter();
  const { authUser } = useFirebaseAuth();
  const [order, setOrder] = React.useState(null);
  const [orderLoading, setOrderLoading] = React.useState(true);

  React.useEffect(() => {
    const docRef = doc(db, `/orders/${router.query.id}`);
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        data.id = docSnap.id;
        setOrder(data);
        setOrderLoading(false);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="bg-blue-50 pb-16 pt-32 min-h-screen">
      <div className="container">
        <div className="grid grid-cols-4 gap-4">
          {/*========= Left Panel ========== */}
          <div className="col-span-4 sm:col-span-1 bg-white py-6 shadow-md rounded-xl">
            <>
              <UserDetails provider={authUser?.profile} self={true} />
            </>
          </div>
          <div className=" col-span-4 sm:col-span-3">
            {orderLoading ? <p>Loading...</p> : <OrderData order={order} />}
            {!orderLoading && order.status === "completed" && (
              <OrderReviews order={order} />
            )}
            {!orderLoading && order.status === "active" && (
              <VideoChatNoSSR channelName={router.query.id} order={order} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
