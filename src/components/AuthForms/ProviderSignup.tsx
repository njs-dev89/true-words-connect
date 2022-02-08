import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useFirebaseAuth } from "../../context/authContext";
import LeftImagePanel from "./LeftImagePanel";
import SignupForm from "./SignupForm";
import validator from "validator";
import loginImage from "../../../public/client-signup.svg";

function ProviderSignup() {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();
  const [error, setError] = React.useState(null);

  const { createUser } = useFirebaseAuth();

  const onSubmit = (event) => {
    event.preventDefault();
    if (!validator.isLength(username, { min: 6, max: undefined })) {
      return setError("Username must be atleast 6 characters long");
    }
    if (!validator.isAlphanumeric(username, "en-US", { ignore: "_" })) {
      return setError("Username must contain letters, numbers or underscore ");
    }
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
    createUser(username, email, password)
      .then(() => {
        router.push("/provider-onboarding");
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  return (
    <LeftImagePanel imgSrc={loginImage}>
      <div>
        <h3 className="text-3xl text-yellow-300 font-bold mb-6">Sign up</h3>
        <SignupForm
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          btnText="Sign Up"
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

export default ProviderSignup;
