import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useFirebaseAuth } from "../../context/authContext";
import LeftImagePanel from "./LeftImagePanel";
import SignupForm from "./SignupForm";
import ResumeUpload from "../FormElements/ResumeUpload";
import SkillTest from "./SkillTest";
import PassportUpload from "../FormElements/PassportUpload";
import IdCardUpload from "../FormElements/IdCardUpload";
import validator from "validator";
import LanguageTags from "../FormElements/LanguageTags";
import LanguageProficiency from "../FormElements/LanguageProficiency";

function ProviderSignup() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [languages, setLanguages] = useState([]);
  const [langs, setLangs] = useState([]);
  const [resumeLink, setResumeLink] = useState(null);
  const [passportLink, setPassportLink] = useState(null);
  const [idCardLink, setIdCardLink] = useState(null);
  const [videoLink, setVideoLink] = useState(null);

  const router = useRouter();
  const [error, setError] = useState(null);

  const { authUser, createProviderApplicant, addProviderApplicant } =
    useFirebaseAuth();

  const onSignup = (event) => {
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
    createProviderApplicant(username, email, password)
      .then(() => {
        console.log("Success. The user is created in Firebase");
        setStep(2);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const onDetailsSubmit = (event) => {
    event.preventDefault();
    if (langs.length === 0) {
      return setError("Please add atleast one language");
    }
    if (!resumeLink || !passportLink || !idCardLink) {
      return setError("Please upload all the required files");
    }
    setStep(3);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!videoLink) {
      return setError("Please capture and upload your video");
    }
    try {
      await addProviderApplicant(
        authUser.uid,
        username,
        email,
        languages,
        resumeLink,
        passportLink,
        idCardLink,
        videoLink
      );
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (authUser && authUser.role !== undefined) {
      router.push("/providers");
    }
    if (authUser && step === 1) {
      setStep(2);
    }
  }, [authUser, step]);
  return (
    <LeftImagePanel imgSrc="/applicant.svg">
      {step === 1 && (
        <div>
          <h3 className="text-3xl text-yellow-300 font-bold mb-6">Signup</h3>

          <SignupForm
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            btnText="Next"
            onSubmit={onSignup}
            error={error}
          />
          <div className="text-blue-900 font-bold mt-6">
            already have an account?{" "}
            <Link href="/login">
              <a className="text-red-400">Login</a>
            </Link>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-3xl text-yellow-300 font-bold mb-6">Step 2</h3>
          <form onSubmit={onDetailsSubmit}>
            <h3 className="font-bold text-lg mb-4">
              Select languages you are proficient in
            </h3>
            <LanguageTags langs={langs} setLangs={setLangs} />
            {/* <LanguageCheckbox
              languages={languages}
              setLanguages={setLanguages}
            /> */}
            <ResumeUpload setResumeLink={setResumeLink} setError={setError} />
            <PassportUpload
              setPassportLink={setPassportLink}
              setError={setError}
            />
            <IdCardUpload setIdCardLink={setIdCardLink} setError={setError} />
            {error && <div className="text-red-600 text-sm">*{error}</div>}
            <button className="btn btn-yellow w-full mt-6">Next</button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-3xl text-yellow-300 font-bold mb-6">
            Select your languages proficiency
          </h3>
          <LanguageProficiency
            langs={langs}
            languages={languages}
            setLanguages={setLanguages}
          />
          <button
            className="btn btn-yellow w-full mt-6"
            onClick={() => setStep(4)}
          >
            Next
          </button>
        </div>
      )}

      {step === 4 && (
        <div>
          <h3 className="text-3xl text-yellow-300 font-bold mb-6">
            Skill Test
          </h3>
          <form onSubmit={onSubmit}>
            <SkillTest setVideoLink={setVideoLink} />
            {error && <div className="text-red-600 text-sm">*{error}</div>}
            <button className="btn btn-yellow w-full mt-6">Submit</button>
          </form>
        </div>
      )}
    </LeftImagePanel>
  );
}

export default ProviderSignup;
