import React, { useEffect } from "react";
import { useRouter } from "next/router";
import ResetPassword from "../components/AuthForms/ResetPassword";
import { useFirebaseAuth } from "../context/authContext";

function ResetPasswordPage() {
  const router = useRouter();
  const { loading, authUser } = useFirebaseAuth();

  useEffect(() => {
    if (!loading && authUser) router.push("/providers");
  }, [authUser, loading, router]);
  useEffect(() => {
    if (!router.query.oobCode) router.push("/providers");
  }, []);
  return (
    <div>
      <ResetPassword />
    </div>
  );
}

export default ResetPasswordPage;
