import { useRouter } from "next/router";
import React, { useEffect } from "react";
import ClientProfile from "../../components/ClientProfile";
import TranslatorProfile from "../../components/TranslatorProfile";
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
  if (authUser && authUser.role === "translator") {
    return <TranslatorProfile userId={authUser.uid} />;
  }
  return <div>Nothing</div>;
}

export default ProfilePage;
