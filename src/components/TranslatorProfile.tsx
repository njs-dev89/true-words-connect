import { doc, getDoc } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import EditUser from "../components/EditUser";
import OfferRequest from "../components/OfferRequest";
import Tab from "./Tabs/Tab";
import TabPane from "./Tabs/TabPane";
import TabsPaneContainer from "./Tabs/TabsPaneContainer";
import UserDetails from "./UserDetails";
import UserOrders from "./UserOrders";
import UserReviews from "./UserReviews";
import { db } from "../config/firebaseConfig";
import MessagesTab from "./MessagesTab";
import Link from "next/link";
import { useRouter } from "next/router";

function TranslatorProfile({ userId }) {
  const { query } = useRouter();
  const [openTab, setOpenTab] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [translator, setTranslator] = useState(null);

  async function loadData(userId) {
    const docRef = doc(db, `/translators/${userId}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const translator = docSnap.data();
      translator.id = docSnap.id;
      setTranslator(translator);
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
          <div className="col-span-4 sm:col-span-3 rounded-xl bg-white shadow-md">
            <div className="flex justify-start flex-wrap">
              <div className="w-full px-1 sm:px-8 pt-6">
                {/*========Tabs========== */}
                <ul
                  className="flex justify-center sm:justify-start gap-1 sm:gap-12 mb-0 flex-wrap pt-3 sm:pl-4 border-b"
                  role="tablist"
                >
                  <li
                    className={`-mb-px font-medium px-1 sm:px-2 py-2 sm:text-base text-sm ${
                      query.handle === "overview" &&
                      "text-yellow border-b-2 border-yellow"
                    }`}
                  >
                    <Link href="/profile/overview">
                      <a>Overview</a>
                    </Link>
                  </li>
                  <li
                    className={`-mb-px font-medium px-1 sm:px-2 py-2 sm:text-base text-sm ${
                      query.handle === "orders" &&
                      "text-yellow border-b-2 border-yellow"
                    }`}
                  >
                    <Link href="/profile/orders">
                      <a>Orders</a>
                    </Link>
                  </li>
                  <li
                    className={`-mb-px font-medium px-1 sm:px-2 py-2 sm:text-base text-sm ${
                      query.handle === "messages" &&
                      "text-yellow border-b-2 border-yellow"
                    }`}
                  >
                    <Link href="/profile/messages">
                      <a>Messages</a>
                    </Link>
                  </li>
                  <li
                    className={`-mb-px font-medium px-1 sm:px-2 py-2 sm:text-base text-sm ${
                      query.handle === "offerRequest" &&
                      "text-yellow border-b-2 border-yellow"
                    }`}
                  >
                    <Link href="/profile/offerRequest">
                      <a>Offer Request</a>
                    </Link>
                  </li>
                  <li
                    className={`-mb-px font-medium px-1 sm:px-2 py-2 sm:text-base text-sm ${
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
                  {query.handle === "overview" && (
                    <div>
                      {userLoading ? (
                        <p>Loading...</p>
                      ) : (
                        <>
                          {" "}
                          <div className="mb-4 mt-8">
                            <h3 className="text-blue font-bold text-xl">
                              Hourly Price
                            </h3>
                            <p className="text-sm mt-2">
                              {translator.hourly_rate
                                ? `$${translator.hourly_rate}`
                                : "Rate Not set yet"}
                            </p>
                          </div>
                          <div className="mt-8">
                            <h3 className="text-blue font-bold text-xl">
                              About
                            </h3>
                            <p className="p-4 mt-4 pb-8 border rounded">
                              {translator.about
                                ? translator.about
                                : "Please add something about yourself to show here"}
                            </p>
                          </div>
                          <div className="mt-6">
                            <h3 className="text-blue font-bold text-xl">
                              Languages
                            </h3>
                            <ul className="list-disc list-inside mt-4">
                              {translator.languages.map((lang, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-baseline mb-2"
                                >
                                  {lang.language}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}{" "}
                    </div>
                  )}
                  {query.handle === "orders" && <UserOrders />}
                  {query.handle === "messages" && <MessagesTab />}
                  {query.handle === "offerRequest" && <OfferRequest />}
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

export default TranslatorProfile;