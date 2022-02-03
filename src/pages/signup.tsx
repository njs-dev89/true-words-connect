import { useEffect } from "react";
import { useRouter } from "next/router";
import { useFirebaseAuth } from "../context/authContext";
import Signup from "../components/AuthForms/Signup";
import Head from "next/head";

const SignUpPage = () => {
  const router = useRouter();

  const { loading, authUser } = useFirebaseAuth();

  useEffect(() => {
    if (!loading && authUser) router.push("/providers");
  }, [authUser, loading, router]);

  return (
    <>
      <Head>
        <title>Sign Up | LangWays</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Signup />
    </>
  );
};

export default SignUpPage;
