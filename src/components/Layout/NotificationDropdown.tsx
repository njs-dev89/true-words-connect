import { Menu, Transition } from "@headlessui/react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { Fragment, useEffect, useState } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { db } from "../../config/firebaseConfig";
import { useFirebaseAuth } from "../../context/authContext";
import Image from "next/image";
import SingleNotification from "./SingleNotification";

function NotificationDropdown() {
  const { loading, authUser } = useFirebaseAuth();
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!loading && authUser) {
      let q;
      if (authUser.role === "client") {
        const notificationssCollection = collection(
          db,
          `/clients/${authUser.uid}/notifications`
        );

        q = query(notificationssCollection);
      }
      if (authUser.role === "provider" || authUser.role === undefined) {
        const notificationssCollection = collection(
          db,
          `/providers/${authUser.uid}/notifications`
        );

        q = query(notificationssCollection);
      }

      const unsubscribe = onSnapshot(q, {}, (querySnapshot) => {
        const notifications = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data["id"] = doc.id;
          notifications.push(data);
        });

        setNotifications(notifications);
        setNotificationsLoading(false);
      });

      return () => unsubscribe();
    }
  }, [loading, authUser]);

  return (
    <div>
      <Menu as="div" className="relative text-left">
        <div>
          <Menu.Button className=" px-2 py-2 relative  bg-blue-100  hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 rounded-full">
            <IoIosNotificationsOutline className="text-2xl text-blue" />
            <span className="absolute left-6 top-7 bg-red-600 px-1 text-white rounded-full text-xs">
              {notifications.filter(
                (notification) => notification.hasRead === false
              ).length > 0 &&
                notifications.filter(
                  (notification) => notification.hasRead === false
                ).length}
            </span>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 w-96 z-50 mt-2 origin-top-right  divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="flex flex-col px-4 py-4 bg-gray-50">
                {!notificationsLoading &&
                  notifications.map((notification) => (
                    <SingleNotification notification={notification} />
                  ))}
              </div>
            </Menu.Items>
          </Transition>
        </div>
      </Menu>
    </div>
  );
}

export default NotificationDropdown;
