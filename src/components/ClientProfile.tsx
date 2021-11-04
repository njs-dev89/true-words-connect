import { doc, getDoc } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import EditUser from "../components/EditUser";
import TabsPaneContainer from "./Tabs/TabsPaneContainer";
import UserDetails from "./UserDetails";
import UserOrders from "./UserOrders";
import UserReviews from "./UserReviews";
import { db } from "../config/firebaseConfig";
import MessagesTab from "./MessagesTab";
import UserOffers from "./UserOffers";
import { useRouter } from "next/router";
import Link from "next/link";

function ClientProfile({ userId }) {
  const [openTab, setOpenTab] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [translator, setTranslator] = useState(null);
  const { query } = useRouter();

  async function loadData(userId) {
    const docRef = doc(db, `/clients/${userId}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setTranslator(docSnap.data());
      setUserLoading(false);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  useEffect(() => {
    loadData(userId);
  }, []);

  return (
    <div className="bg-blue-50 pb-16 pt-32 min-h-screen">
      <div className="container">
        {showModal && (
          <EditUser setShowModal={setShowModal} translator={translator} />
        )}
        <div className="grid grid-cols-4 gap-4">
          {/*========= Left Panel ========== */}
          <div className="col-span-4 sm:col-span-1 bg-white py-6 shadow-md rounded-xl">
            {userLoading ? (
              <p>loading...</p>
            ) : (
              <>
                <div className="flex justify-end mr-4 mb-8 text-blue">
                  <button onClick={() => setShowModal(true)}>Edit</button>
                </div>
                <UserDetails translator={translator} />
              </>
            )}
          </div>
          {/*========= Left Panel End ========== */}

          {/*==========Right Panel ============= */}
          <div className=" col-span-4 sm:col-span-3 rounded-xl bg-white shadow-md">
            <div className="flex flex-wrap">
              <div className="w-full px-1 sm:px-8 pt-6">
                {/*========Tabs========== */}
                <ul
                  className="flex justify-center sm:justify-start gap-1 sm:gap-12 mb-0 flex-wrap pt-3 sm:pl-4 border-b"
                  role="tablist"
                >
                  <li
                    className={`-mb-px font-medium px-1 sm:px-2 py-2 sm:text-base text-xs ${
                      query.handle === "orders" &&
                      "text-yellow border-b-2 border-yellow"
                    }`}
                  >
                    <Link href="/profile/orders">
                      <a>Orders</a>
                    </Link>
                  </li>

                  <li
                    className={`-mb-px font-medium px-1 sm:px-2 py-2 sm:text-base text-xs ${
                      query.handle === "messages" &&
                      "text-yellow border-b-2 border-yellow"
                    }`}
                  >
                    <Link href="/profile/messages">
                      <a>Messages</a>
                    </Link>
                  </li>
                  <li
                    className={`-mb-px font-medium px-1 sm:px-2 py-2 sm:text-base text-xs ${
                      query.handle === "offers" &&
                      "text-yellow border-b-2 border-yellow"
                    }`}
                  >
                    <Link href="/profile/offers">
                      <a>Offers</a>
                    </Link>
                  </li>

                  <li
                    className={`-mb-px font-medium px-1 sm:px-2 py-2 sm:text-base text-xs ${
                      query.handle === "reviews" &&
                      "text-yellow border-b-2 border-yellow"
                    }`}
                  >
                    <Link href="/profile/reviews">
                      <a>Reviews</a>
                    </Link>
                  </li>
                </ul>
                {/*========Tabs End========== */}

                {/*========Tabs Pane========== */}
                <TabsPaneContainer>
                  {query.handle === "orders" && <UserOrders />}

                  {query.handle === "messages" && <MessagesTab />}
                  {query.handle === "offers" && <UserOffers />}
                  {query.handle === "reviews" && <UserReviews />}
                </TabsPaneContainer>
                {/*========Tabs Pane End========== */}
              </div>
            </div>
          </div>
          {/*==========Right Panel End ========= */}
        </div>
      </div>
    </div>
  );
}

export default ClientProfile;
