import { useEffect } from "react";
import { useRouter } from "next/router";
import { useFirebaseAuth } from "../context/authContext";
import Login from "../components/AuthForms/Login";

export default function LoginPage() {
  const router = useRouter();
  const { loading, authUser } = useFirebaseAuth();

  useEffect(() => {
    if (!loading && authUser) router.push("/translators");
  }, [authUser, loading, router]);
  return <Login />;
}
