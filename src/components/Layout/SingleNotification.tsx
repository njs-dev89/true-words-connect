import { Menu } from "@headlessui/react";
import * as React from "react";
import Image from "next/image";
import { useFirebaseAuth } from "../../context/authContext";
import { db } from "../../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

function SingleNotification({ notification }) {
  const { authUser } = useFirebaseAuth();
  React.useEffect(() => {
    if (authUser.role === "client") {
      setDoc(
        doc(db, `/clients/${authUser.uid}/notifications/${notification.id}`),
        { hasRead: true },
        { merge: true }
      );
    } else {
      setDoc(
        doc(db, `/providers/${authUser.uid}/notifications/${notification.id}`),
        { hasRead: true },
        { merge: true }
      );
    }
  }, [authUser]);
  return (
    <Menu.Item key={notification.id}>
      <div className="flex border-b py-3 align-items-center justify-between gap-3 hover:bg-gray-100">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          {" "}
          <Image
            src={notification.user.profile_pic || "/profile-placeholder.png"}
            layout="fill"
            alt=""
          />
        </div>
        <div className="flex-grow">
          <h3 className="font-medium text-lg">
            {notification.title} from {notification.user.username}
          </h3>
          <p>{notification.message}</p>
        </div>
      </div>
    </Menu.Item>
  );
}

export default SingleNotification;
