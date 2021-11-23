import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { useRouter } from "next/router";
import AdminSidebar from "./AdminSidebar";
import { useFirebaseAuth } from "../../context/authContext";
import { db } from "../../config/firebaseConfig";
import { doc, setDoc } from "@firebase/firestore";

function Layout({ children }) {
  const router = useRouter();
  const { authUser } = useFirebaseAuth();

  const setGeoLocation = async (uid) => {
    const userDoc = doc(db, `/providers/${uid}`);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
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
