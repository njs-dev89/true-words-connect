import { useRouter } from "next/router";
import { useEffect } from "react";
import { useFirebaseAuth } from "../context/authContext";

export default function ProtectedPage() {
  const { authUser, loading } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authUser) router.push("/signup");
  }, [authUser, loading, router]);
  return <div>This is a protected page</div>;
}
