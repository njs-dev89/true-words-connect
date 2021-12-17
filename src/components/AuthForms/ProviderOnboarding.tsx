import React, { useState } from "react";
import { useFirebaseAuth } from "../../context/authContext";
import IdCardUpload from "../FormElements/IdCardUpload";
import LanguageProficiency from "../FormElements/LanguageProficiency";
import LanguageTags from "../FormElements/LanguageTags";
import PassportUpload from "../FormElements/PassportUpload";
import ResumeUpload from "../FormElements/ResumeUpload";
import LeftImagePanel from "./LeftImagePanel";
import SkillTest from "./SkillTest";
import { useRouter } from "next/router";

function ProviderOnboarding() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [langs, setLangs] = useState([]);
  const [resumeLink, setResumeLink] = useState(null);
  const [passportLink, setPassportLink] = useState(null);
  const [idCardLink, setIdCardLink] = useState(null);
  const [videoLink, setVideoLink] = useState(null);
  const { authUser, addProviderApplicant } = useFirebaseAuth();
  const router = useRouter();

  const onDetailsSubmit = (event) => {
    event.preventDefault();
    if (langs.length === 0) {
      return setError("Please add atleast one language");
    }
    if (!resumeLink || !passportLink || !idCardLink) {
      return setError("Please upload all the required files");
    }
    setError(null);
    setStep(2);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!videoLink) {
      return setError("Please capture and upload your video");
    }
    try {
      await addProviderApplicant(
        authUser.uid,
        authUser.profile.username,
        authUser.profile.email,
        languages,
        resumeLink,
        passportLink,
        idCardLink,
        videoLink
      );
      setError(null);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LeftImagePanel imgSrc="/applicant.svg">
      {step === 1 && (
        <div>
          <h3 className="text-3xl text-yellow-300 font-bold mb-6">Select languages you are proficient in</h3>
          <form onSubmit={onDetailsSubmit}>
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

      {step === 2 && (
        <div>
          <h3 className="text-3xl text-yellow-300 font-bold mb-6">
            Select languages you are proficient in
          </h3>
          <LanguageProficiency
            langs={langs}
            languages={languages}
            setLanguages={setLanguages}
          />
          <button
            className="btn btn-yellow w-full mt-6"
            onClick={() => setStep(3)}
          >
            Next
          </button>
        </div>
      )}

      {step === 3 && (
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

export default ProviderOnboarding;
