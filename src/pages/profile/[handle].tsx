import { useRouter } from "next/router";
import React, { useEffect } from "react";
import ClientProfile from "../../components/Profile/ClientProfile";
import ProviderProfile from "../../components/Profile/ProviderProfile";
import { useFirebaseAuth } from "../../context/authContext";

function ProfilePage() {
  const { authUser, loading } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authUser) router.push("/login");
  }, [authUser, loading, router]);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (authUser && authUser.role === "client") {
    return <ClientProfile userId={authUser.uid} />;
  }
  if (authUser && authUser.role === "provider") {
    return <ProviderProfile userId={authUser.uid} />;
  }
  if (authUser && authUser.role === undefined) {
    return (
      <div className="bg-blue-50 pb-16 pt-32 min-h-screen">
        <div className="container">
          <p className="text-center">
            You&apos; Application is still pending. You can not view your
            profile.
          </p>
        </div>
      </div>
    );
  }
  return <div>Nothing</div>;
}

export default ProfilePage;
