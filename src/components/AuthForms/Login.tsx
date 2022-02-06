import { useRouter } from "next/router";
import Link from "next/link";
import * as React from "react";
import { useFirebaseAuth } from "../../context/authContext";
import Input from "../FormElements/Input";
import LeftImagePanel from "./LeftImagePanel";
import Image from "next/image";
import validator from "validator";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const { signInUser } = useFirebaseAuth();
  const router = useRouter();
  const { authUser } = useFirebaseAuth();

  const onSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    if (validator.isEmpty(email)) {
      setLoading(false);
      return setError("Email field is empty");
    }
    if (!validator.isEmail(email)) {
      setLoading(false);
      return setError("Invalid email address");
    }
    if (!validator.isLength(password, { min: 6, max: undefined })) {
      setLoading(false);
      return setError("Password must be atleast 6 characters long");
    }
    setError(null);
    signInUser(email, password)
      .then(() => {
        setLoading(false);
        return router.push("/providers");
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  };
  return (
    <LeftImagePanel imgSrc="/client-signup.svg">
      <div>
        <h3 className="text-3xl text-yellow-300 font-bold mb-6">Login</h3>
        <form className="" onSubmit={onSubmit}>
          {error && <div className="text-red-600 text-sm">*{error}</div>}
          <Input
            type="email"
            label="Email"
            id="signUpEmail"
            name="email"
            className="mb-4"
            placeholder="Email"
            value={email}
            handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value);
            }}
          />
          <Input
            type="password"
            label="Password"
            id="signUpPassword"
            name="password"
            className="mb-6"
            placeholder="Password"
            value={password}
            handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
          />
          <div>
            <button
              className={`btn  w-full flex justify-center ${
                loading ? "bg-yellow-dark" : "btn-yellow"
              }`}
            >
              {loading ? (
                <div className="relative w-6 h-6">
                  <Image src="/loading.gif" layout="fill" />
                </div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
        <div className="flex justify-between">
          <div className="text-blue-900 font-bold mt-6">
            don&apos;t have an account?{" "}
            <Link href="/signup">
              <a className="text-red-400">Sign Up</a>
            </Link>
          </div>
          <div className="text-blue-900 font-bold mt-6">
            <Link href="/forgot-password">
              <a className="">forgot password?</a>
            </Link>
          </div>
        </div>
      </div>
    </LeftImagePanel>
  );
}

export default Login;
