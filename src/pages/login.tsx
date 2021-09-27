import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useFirebaseAuth } from "../context/authContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const { signInUser, loading, authUser } = useFirebaseAuth();

  const onSubmit = (event) => {
    event.preventDefault();
    setError(null);
    signInUser(email, password)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  useEffect(() => {
    if (!loading && authUser) router.push("/");
  }, [authUser, loading, router]);
  return (
    <div className="text-center" style={{ padding: "40px 0px" }}>
      <div>
        <div>
          <h2>Login</h2>
        </div>
      </div>
      <div style={{ maxWidth: "400px", margin: "auto" }}>
        <div>
          <form onSubmit={onSubmit}>
            {error && <div color="danger">{error}</div>}
            <div>
              <label htmlFor="loginEmail">Email</label>
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  name="email"
                  id="loginEmail"
                  placeholder="Email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="loginPassword">Password</label>
              <div>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  id="loginPassword"
                  placeholder="Password"
                />
              </div>
            </div>
            <div>
              <div>
                <button>Login</button>
              </div>
            </div>
          </form>
          dont have an account?{" "}
          <Link href="/signup">
            <a>Signup</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
