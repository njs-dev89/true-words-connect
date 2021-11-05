import { useEffect } from "react";
import { useRouter } from "next/router";
import { useFirebaseAuth } from "../context/authContext";
import Signup from "../components/AuthForms/Signup";

const SignUpPage = () => {
  const router = useRouter();

  const { loading, authUser } = useFirebaseAuth();

  useEffect(() => {
    if (!loading && authUser) router.push("/providers");
  }, [authUser, loading, router]);

  return <Signup />;
};

export default SignUpPage;
