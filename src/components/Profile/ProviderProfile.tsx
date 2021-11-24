import React, { useEffect, useState } from "react";
import EditUser from "./EditUser";
import OfferRequest from "./OfferRequest";
import TabsPaneContainer from "../Tabs/TabsPaneContainer";
import UserDetails from "./UserDetails";
import UserOrders from "./UserOrders";
import UserReviews from "./UserReviews";
import MessagesTab from "../Messages/MessagesTab";
import Link from "next/link";
import { useRouter } from "next/router";
import { BiEdit } from "react-icons/bi";
import { useFirebaseAuth } from "../../context/authContext";
import SentOffers from "./SentOffers";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "@firebase/firestore";
import { db, functions } from "../../config/firebaseConfig";
import { httpsCallable } from "@firebase/functions";

const createStripeAccountLink = httpsCallable(
  functions,
  "createStripeAccountLink"
);

const checkOnboardingComplete = httpsCallable(
  functions,
  "checkOnboardingComplete"
);

const stripeDashboardLoginLink = httpsCallable(
  functions,
  "stripeDashboardLoginLink"
);

function ProviderProfile({ userId }) {
  const router = useRouter();
  const { authUser, loading } = useFirebaseAuth();
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  const stripeOnboarding = async () => {
    const accountLink: any = await createStripeAccountLink({
      accountId: authUser.profile.stripeAccountId,
    });

    if (window !== undefined) {
      console.log(accountLink.data.url);
      window.location.href = accountLink.data.url;
    }
  };

  const stripeLogin = async () => {
    const link: any = await stripeDashboardLoginLink({
      accountId: authUser.profile.stripeAccountId,
    });
    if (window !== undefined) {
      console.log(link.data.url);
      window.open(link.data.url);
    }
  };

  useEffect(() => {
    if (authUser && authUser.profile.isStripeOnboardingComplete) {
      setOnboardingComplete(true);
    }
    if (authUser && !authUser.profile.isStripeOnboardingComplete) {
      checkOnboardingComplete({
        accountId: authUser.profile.stripeAccountId,
      }).then((account: any) => {
        console.log(account.data);
        if (account.data.details_submitted) {
          setDoc(
            doc(db, `/providers/${authUser.uid}`),
            { isStripeOnboardingComplete: true },
            { merge: true }
          );
        }
        setOnboardingComplete(account.data.details_submitted);
      });
    }
  }, [authUser]);

  useEffect(() => {
    const messageRoomsCollection = collection(db, `/messageRooms`);
    const q = query(
      messageRoomsCollection,
      where("provider.id", "==", authUser.uid)
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

  useEffect(() => {
    if (rooms.length > 0) {
      const noOfRooms = rooms.filter(
        (room) => room.provider.hasUnreadMessages
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
          <EditUser setShowModal={setShowModal} provider={authUser.profile} />
        )}
        {!authUser.profile.isProfileComplete && (
          <div className="text-center bg-yellow-100 text-red-500 mb-4 py-2 rounded font-medium -mt-8 shadow">
            Please Complete Your profile to be listed on the search page
          </div>
        )}
        <div className="grid grid-cols-4 gap-4">
          {/*========= Left Panel ========== */}
          <div className="col-span-4 sm:col-span-1 bg-white py-6 shadow-md rounded-xl">
            {loading ? (
              <p>loading...</p>
            ) : (
              <>
                <div className="flex justify-end mr-4 mb-8 text-blue">
                  {authUser.profile.isProfileComplete ? (
                    <button
                      className=" p-2 bg-indigo-200 rounded-full"
                      onClick={() => setShowModal(true)}
                    >
                      <BiEdit className="text-2xl" />
                    </button>
                  ) : (
                    <button
                      className="font-medium text-sm flex items-center gap-1"
                      onClick={() => setShowModal(true)}
                    >
                      <BiEdit className="" />
                      Complete Profile
                    </button>
                  )}
                </div>
                <UserDetails provider={authUser.profile} />
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
                      router.query.handle === "overview" &&
                      "text-yellow border-b-2 border-yellow"
                    }`}
                  >
                    <Link href="/profile/overview">
                      <a>Overview</a>
                    </Link>
                  </li>
                  <li
                    className={`-mb-px font-medium px-1 sm:px-2 py-2 sm:text-base text-sm ${
                      router.query.handle === "orders" &&
                      "text-yellow border-b-2 border-yellow"
                    }`}
                  >
                    <Link href="/profile/orders">
                      <a>Orders</a>
                    </Link>
                  </li>
                  <li
                    className={`-mb-px font-medium px-1 sm:px-2 py-2 sm:text-base text-sm ${
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
                    className={`-mb-px font-medium px-1 sm:px-2 py-2 sm:text-base text-sm ${
                      router.query.handle === "offerRequest" &&
                      "text-yellow border-b-2 border-yellow"
                    }`}
                  >
                    <Link href="/profile/offerRequest">
                      <a>Offer Requests</a>
                    </Link>
                  </li>
                  <li
                    className={`-mb-px font-medium px-1 sm:px-2 py-2 sm:text-base text-sm ${
                      router.query.handle === "sentOffers" &&
                      "text-yellow border-b-2 border-yellow"
                    }`}
                  >
                    <Link href="/profile/sentOffers">
                      <a>Sent Offers</a>
                    </Link>
                  </li>
                  <li
                    className={`-mb-px font-medium px-1 sm:px-2 py-2 sm:text-base text-sm ${
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
                  {router.query.handle === "overview" && (
                    <div>
                      {loading ? (
                        <p>Loading...</p>
                      ) : (
                        <>
                          <div className="mb-4 mt-8">
                            <h3 className="text-blue font-bold text-xl">
                              Stripe Onboarding
                            </h3>
                            {onboardingComplete ? (
                              <>
                                <p className="text-sm mt-4 mb-4">
                                  Stripe Onboarding Complete
                                </p>
                                <button
                                  className="btn-small btn-blue"
                                  onClick={stripeLogin}
                                >
                                  Stripe Dashboard
                                </button>
                              </>
                            ) : (
                              <>
                                <p className="text-sm mt-4 mb-4">
                                  You need to complete stripe onboarding to be
                                  listed on search page and to recieve orders
                                  and payments.
                                </p>
                                <button
                                  className="btn-small btn-blue"
                                  onClick={stripeOnboarding}
                                >
                                  Connect to stripe
                                </button>
                              </>
                            )}
                          </div>{" "}
                          <div className="mb-4 mt-8">
                            <h3 className="text-blue font-bold text-xl">
                              Hourly Price
                            </h3>
                            <p className="text-sm mt-2">
                              {authUser.profile.hourly_rate
                                ? `$${authUser.profile.hourly_rate}`
                                : "Rate Not set yet"}
                            </p>
                          </div>
                          <div className="mt-8">
                            <h3 className="text-blue font-bold text-xl">
                              About
                            </h3>
                            <p className="p-4 mt-4 pb-8 border rounded">
                              {authUser.profile.about
                                ? authUser.profile.about
                                : "Please add something about yourself to show here"}
                            </p>
                          </div>
                          <div className="mt-6">
                            <h3 className="text-blue font-bold text-xl">
                              Languages
                            </h3>
                            <ul className="list-disc list-inside mt-4">
                              {authUser.profile.languages.map((lang, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-baseline mb-2"
                                >
                                  <span className="font-medium mr-2">
                                    {lang.language}
                                  </span>
                                  ({lang.proficiency})
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}{" "}
                    </div>
                  )}
                  {router.query.handle === "orders" && <UserOrders />}
                  {router.query.handle === "messages" && (
                    <MessagesTab loading={roomsLoading} rooms={rooms} />
                  )}
                  {router.query.handle === "offerRequest" && <OfferRequest />}
                  {router.query.handle === "sentOffers" && <SentOffers />}
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

export default ProviderProfile;
