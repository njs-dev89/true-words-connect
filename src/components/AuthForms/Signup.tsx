import React, { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useFirebaseAuth } from "../../context/authContext";
import Input from "../FormElements/Input";
import LeftImagePanel from "./LeftImagePanel";
import SignupForm from "./SignupForm";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState(null);

  const { createUser } = useFirebaseAuth();

  const onSubmit = (event) => {
    event.preventDefault();
    setError(null);
    createUser(username, email, password)
      .then(() => {
        console.log("Success. The user is created in Firebase");
        router.push("/");
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  return (
    <LeftImagePanel imgSrc="/client-signup.svg">
      <div>
        <h3 className="text-3xl text-yellow-300 font-bold mb-6">Signup</h3>
        <SignupForm
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          btnText="Signup"
          onSubmit={onSubmit}
          error={error}
        />
        <div className="text-blue-900 font-bold mt-6">
          already have an account?{" "}
          <Link href="/login">
            <a className="text-red-400">Login</a>
          </Link>
        </div>
      </div>
    </LeftImagePanel>
  );
}

export default Signup;
