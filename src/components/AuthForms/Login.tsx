import { useRouter } from "next/router";
import Link from "next/link";
import React, { ChangeEvent, useState } from "react";
import { useFirebaseAuth } from "../../context/authContext";
import Input from "../FormElements/Input";
import LeftImagePanel from "./LeftImagePanel";
import validator from "validator";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { signInUser } = useFirebaseAuth();
  const router = useRouter();
  const { authUser } = useFirebaseAuth();

  const onSubmit = (event) => {
    event.preventDefault();
    if (validator.isEmpty(email)) {
      return setError("Email field is empty");
    }
    if (!validator.isEmail(email)) {
      return setError("Invalid email address");
    }
    if (!validator.isLength(password, { min: 6, max: undefined })) {
      return setError("Password must be atleast 6 characters long");
    }
    setError(null);
    signInUser(email, password)
      .then(() => {
        return router.push("/providers");
      })
      .catch((error) => {
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
            handleChange={(event: ChangeEvent<HTMLInputElement>) => {
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
            handleChange={(event: ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
          />
          <div>
            <button className="btn btn-yellow w-full">Login</button>
          </div>
        </form>
        <div className="text-blue-900 font-bold mt-6">
          don&apos;t have an account?{" "}
          <Link href="/signup">
            <a className="text-red-400">Signup</a>
          </Link>
        </div>
      </div>
    </LeftImagePanel>
  );
}

export default Login;
