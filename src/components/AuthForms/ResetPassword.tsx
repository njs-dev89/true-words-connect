import * as React from "react";
import { useFirebaseAuth } from "../../context/authContext";
import Input from "../FormElements/Input";
import LeftImagePanel from "./LeftImagePanel";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Image from "next/image";
import validator from "validator";
import { FcHighPriority, FcOk } from "react-icons/fc";
import loginImage from "../../../public/client-signup.svg";
import loadingGif from "../../../public/loading.gif";

const Msg = ({ msg, heading }) => (
  <div>
    <h3 className={`font-bold text-lg mb-2 flex items-center gap-2`}>
      {heading === "Success!" ? <FcOk /> : <FcHighPriority />}
      {heading}
    </h3>

    <p>{msg}</p>
  </div>
);

function ResetPassword() {
  const [newPassword, setNewPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { resetPassword } = useFirebaseAuth();
  const router = useRouter();

  const displayMsg = (msg, heading) => {
    toast(() => <Msg msg={msg} heading={heading} />, {
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
    if (!validator.isLength(newPassword, { min: 6, max: undefined })) {
      setLoading(false);
      return setError("Password must be atleast 6 characters long");
    }
    try {
      await resetPassword(router.query.oobCode, newPassword);
      displayMsg("Password has been changed, you can login now.", "Success!");
      setLoading(false);

      router.push("/login");
    } catch (error) {
      displayMsg(error.message, "Error!");
      setLoading(false);
    }
  };
  return (
    <LeftImagePanel imgSrc={loginImage}>
      <div>
        <h3 className="text-3xl text-yellow-300 font-bold mb-6">
          Reset password
        </h3>
        <form className="" onSubmit={handleSubmit}>
          {error && <div className="text-red-600 text-sm">*{error}</div>}
          <Input
            type="password"
            label="New Password"
            id="newPassword"
            name="password"
            className="mb-4"
            placeholder="Password"
            value={newPassword}
            handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNewPassword(event.target.value);
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
                  <Image src={loadingGif} layout="fill" />
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </LeftImagePanel>
  );
}

export default ResetPassword;
