import * as React from "react";
import { useFirebaseAuth } from "../../context/authContext";
import Input from "../FormElements/Input";
import LeftImagePanel from "./LeftImagePanel";
import validator from "validator";
import Image from "next/image";
import { toast } from "react-toastify";
import { FcHighPriority, FcOk } from "react-icons/fc";

const Msg = ({ email, heading }) => (
  <div>
    <h3 className={`font-bold text-lg mb-2 flex items-center gap-2`}>
      {heading === "Success!" ? <FcOk /> : <FcHighPriority />}
      {heading}
    </h3>

    {heading === "Success!" ? (
      <p>
        An link is sent to <span className="font-bold">{email}</span> for
        password reset.
      </p>
    ) : (
      <p>
        Email address <span className="font-bold">{email}</span> does not exist.
      </p>
    )}
  </div>
);

function ForgetPassword() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { forgotPassword } = useFirebaseAuth();

  const displayMsg = (email, heading) => {
    toast(() => <Msg email={email} heading={heading} />, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (validator.isEmpty(email)) {
      setLoading(false);
      return setError("Email field is empty");
    }
    if (!validator.isEmail(email)) {
      setLoading(false);
      return setError("Invalid email address");
    }
    try {
      await forgotPassword(email);
      displayMsg(email, "Success!");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      displayMsg(email, "Error!");
    }
  };
  return (
    <LeftImagePanel imgSrc="/client-signup.svg">
      <div>
        <h3 className="text-3xl text-yellow-300 font-bold mb-6">
          forgot password?
        </h3>
        <form className="" onSubmit={handleSubmit}>
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
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </LeftImagePanel>
  );
}

export default ForgetPassword;
