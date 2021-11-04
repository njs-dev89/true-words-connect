import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useFirebaseAuth } from "../context/authContext";

export default function ProtectedPage() {
  const { authUser, loading } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authUser) router.push("/login");
  }, [authUser, loading, router]);
  if (loading) {
    return <h1>Loading...</h1>;
  }
  console.log(authUser);
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="home-banner">
          <div className="container">
            <div className="grid grid-cols-11">
              <div className="col-span-6">
                <h1 className="headline">
                  You&apos;r login email is {authUser?.email}
                </h1>
                <p className="mb-12">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Debitis quisquam cupiditate nihil corporis commodi animi sint
                  doloremque numquam aliquid itaque.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
