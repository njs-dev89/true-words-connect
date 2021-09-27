import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useFirebaseAuth } from "../context/authContext";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [passwordOne, setPasswordOne] = useState("");
  const router = useRouter();
  const [error, setError] = useState(null);

  const { createUser, loading, authUser } = useFirebaseAuth();

  const onSubmit = (event) => {
    event.preventDefault();
    setError(null);
    //check if passwords match. If they do, create user in Firebase
    // and redirect to your logged in page.
    createUser(email, passwordOne)
      .then(() => {
        console.log("Success. The user is created in Firebase");
        router.push("/");
      })
      .catch((error) => {
        // An error occurred. Set error message to be displayed to user
        setError(error.message);
      });
  };

  useEffect(() => {
    if (!loading && authUser) router.push("/");
  }, [authUser, loading, router]);

  return (
    <div className="text-center custom-div">
      <div>
        <div>
          <form className="custom-form" onSubmit={onSubmit}>
            {error && <div>{error}</div>}
            <div>
              <label htmlFor="signUpEmail">Email</label>
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  name="email"
                  id="signUpEmail"
                  placeholder="Email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="signUpPassword">Password</label>
              <div>
                <input
                  type="password"
                  name="passwordOne"
                  value={passwordOne}
                  onChange={(event) => setPasswordOne(event.target.value)}
                  id="signUpPassword"
                  placeholder="Password"
                />
              </div>
            </div>
            <div>
              <div>
                <button>Sign Up</button>
              </div>
            </div>
          </form>
          already have an account?{" "}
          <Link href="/login">
            <a>Login</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
