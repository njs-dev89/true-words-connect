import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/firebaseConfig";
import { useFirebaseAuth } from "../context/authContext";

export function useNotification() {
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const { loading, authUser } = useFirebaseAuth();
  const [notifications, setNotifications] = useState([]);
  const hasNotified = (id) => {
    if (authUser.role === "client") {
      setDoc(
        doc(db, `/clients/${authUser.uid}/notifications/${id}`),
        { hasNotified: true },
        {
          merge: true,
        }
      );
    } else {
      setDoc(
        doc(db, `/providers/${authUser.uid}/notifications/${id}`),
        { hasNotified: true },
        {
          merge: true,
        }
      );
    }
  };
  useEffect(() => {
    if (!loading && authUser) {
      let q;
      if (authUser.role === "client") {
        const notificationssCollection = collection(
          db,
          `/clients/${authUser.uid}/notifications`
        );

        q = query(notificationssCollection, where("hasNotified", "==", false));
      }
      if (authUser.role === "provider" || authUser.role === undefined) {
        const notificationssCollection = collection(
          db,
          `/providers/${authUser.uid}/notifications`
        );

        q = query(notificationssCollection, where("hasNotified", "==", false));
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

  return { notificationsLoading, notifications, hasNotified };
}
