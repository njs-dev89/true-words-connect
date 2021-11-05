import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { useRouter } from "next/router";
import AdminSidebar from "./AdminSidebar";
import { useFirebaseAuth } from "../../context/authContext";
import { useAgora } from "../../context/agoraContextNoSsr";
import { httpsCallable } from "@firebase/functions";
import { db, functions } from "../../config/firebaseConfig";
import { doc, setDoc } from "@firebase/firestore";

const genRtmToken = httpsCallable(functions, "genRtmToken");
function Layout({ children }) {
  const router = useRouter();
  const { authUser } = useFirebaseAuth();
  const { loginToAgoraRtm } = useAgora();
  const agoraLogin = async (uid) => {
    const token = await genRtmToken({ uid });
    console.log(token.data);
    await loginToAgoraRtm(uid, token.data);
  };

  const setGeoLocation = async (uid) => {
    const userDoc = doc(db, `/providers/${uid}`);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log("I ran");
        const newUser = await setDoc(
          userDoc,
          {
            _geoloc: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          },
          { merge: true }
        );
      },
      (error) => {}
    );
  };
  useEffect(() => {
    if (authUser) {
      agoraLogin(authUser.uid);
    }
    if (authUser && authUser.role === "provider") {
      setGeoLocation(authUser.uid);
    }
  }, [authUser]);
  return (
    <div>
      <Navbar />
      {router.pathname.includes("adminDashboard") ? (
        <>
          <div className="bg-blue-50 pb-16 pt-32 min-h-screen">
            <div className="container">
              <div className="grid grid-cols-4 gap-4">
                <AdminSidebar />
                {children}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}

export default Layout;
