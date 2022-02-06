import * as React from "react";
import EditClient from "./EditClient";
import TabsPaneContainer from "../Tabs/TabsPaneContainer";
import UserDetails from "./UserDetails";
import UserOrders from "./UserOrders";
import UserReviews from "./UserReviews";
import MessagesTab from "../Messages/MessagesTab";
import UserOffers from "./UserOffers";
import { useRouter } from "next/router";
import Link from "next/link";
import { BiEdit } from "react-icons/bi";
import { useFirebaseAuth } from "../../context/authContext";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { db } from "../../config/firebaseConfig";

function ClientProfile({ userId }) {
  const [showModal, setShowModal] = React.useState(false);
  const [roomsLoading, setRoomsLoading] = React.useState(true);
  const [rooms, setRooms] = React.useState([]);
  const [hasUnreadMessages, setHasUnreadMessages] = React.useState(false);
  const router = useRouter();
  const { authUser, loading } = useFirebaseAuth();

  React.useEffect(() => {
    const messageRoomsCollection = collection(db, `/messageRooms`);
    const q = query(
      messageRoomsCollection,
      where("client.id", "==", authUser.uid)
    );

    const unsubscribe = onSnapshot(q, {}, (querySnapshot) => {
      const rooms = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data["id"] = doc.id;
        rooms.push(data);
      });
      console.log(rooms);
      setRooms(rooms);
      setRoomsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (rooms.length > 0) {
      const noOfRooms = rooms.filter(
        (room) => room.client.hasUnreadMessages
      ).length;
      if (noOfRooms > 0) {
        setHasUnreadMessages(true);
      }
      if (noOfRooms === 0) {
        setHasUnreadMessages(false);
      }
    }
  }, [rooms]);

  return (
    <div className="bg-light-blue pb-16 pt-32 min-h-screen">
      <div className="container">
        {showModal && (
          <EditClient setShowModal={setShowModal} client={authUser.profile} />
        )}
        <div className="grid grid-cols-4 gap-4">
          {/*========= Left Panel ========== */}
          <div className="col-span-4 sm:col-span-1 bg-white py-6 shadow-md rounded-xl">
            {loading ? (
              <p>loading...</p>
            ) : (
              <>
                <div className="flex justify-end mr-4 mb-8 text-blue">
                  <button
                    className=" p-2 bg-indigo-200 rounded-full"
                    onClick={() => setShowModal(true)}
                  >
                    <BiEdit className="text-2xl" />
                  </button>
                </div>
                <UserDetails
                  provider={authUser.profile}
                  self={true}
                  setShowModal={setShowModal}
                />
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
                      router.query.handle === "orders" &&
                      "text-yellow border-b-2 border-yellow"
                    }`}
                  >
                    <Link href="/profile/orders">
                      <a>Orders</a>
                    </Link>
                  </li>

                  <li
                    className={`-mb-px font-medium px-1 sm:px-2 py-2 sm:text-base text-xs ${
                      router.query.handle === "messages" &&
                      "text-yellow border-b-2 border-yellow"
                    }`}
                  >
                    <Link href="/profile/messages">
                      <a>
                        Messages{" "}
                        {hasUnreadMessages && (
                          <span className="w-1 rounded relative -top-2 inline-block h-1 bg-blue-600"></span>
                        )}
                      </a>
                    </Link>
                  </li>
                  <li
                    className={`-mb-px font-medium px-1 sm:px-2 py-2 sm:text-base text-xs ${
                      router.query.handle === "offers" &&
                      "text-yellow border-b-2 border-yellow"
                    }`}
                  >
                    <Link href="/profile/offers">
                      <a>Offers</a>
                    </Link>
                  </li>

                  <li
                    className={`-mb-px font-medium px-1 sm:px-2 py-2 sm:text-base text-xs ${
                      router.query.handle === "reviews" &&
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
                  {router.query.handle === "orders" && <UserOrders />}

                  {router.query.handle === "messages" && (
                    <MessagesTab loading={roomsLoading} rooms={rooms} />
                  )}
                  {router.query.handle === "offers" && <UserOffers />}
                  {router.query.handle === "reviews" && <UserReviews />}
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
