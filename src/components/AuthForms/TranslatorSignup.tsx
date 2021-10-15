import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useFirebaseAuth } from "../../context/authContext";
import LeftImagePanel from "./LeftImagePanel";
import SignupForm from "./SignupForm";
import LanguageCheckbox from "../FormElements/LanguageCheckbox";
import ResumeUpload from "../FormElements/ResumeUpload";
import SkillTest from "./SkillTest";
import PassportUpload from "../FormElements/PassportUpload";
import IdCardUpload from "../FormElements/IdCardUpload";

function TranslatorSignup() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [languages, setLanguages] = useState([]);
  const [resumeLink, setResumeLink] = useState(null);
  const [passportLink, setPassportLink] = useState(null);
  const [idCardLink, setIdCardLink] = useState(null);
  const [videoLink, setVideoLink] = useState(null);

  const router = useRouter();
  const [error, setError] = useState(null);

  const { authUser, createTranslatorApplicant, addTranslatorApplicant } =
    useFirebaseAuth();

  const onSignup = (event) => {
    event.preventDefault();
    setError(null);
    createTranslatorApplicant(username, email, password)
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
    setStep(3);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await addTranslatorApplicant(
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
            <LanguageCheckbox
              languages={languages}
              setLanguages={setLanguages}
            />
            <ResumeUpload setResumeLink={setResumeLink} />
            <PassportUpload setPassportLink={setPassportLink} />
            <IdCardUpload setIdCardLink={setIdCardLink} />
            <button className="btn btn-yellow w-full mt-6">Next</button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-3xl text-yellow-300 font-bold mb-6">
            Skill Test
          </h3>
          <form onSubmit={onSubmit}>
            <SkillTest setVideoLink={setVideoLink} />
            <button className="btn btn-yellow w-full mt-6">Submit</button>
          </form>
        </div>
      )}
    </LeftImagePanel>
  );
}

export default TranslatorSignup;
