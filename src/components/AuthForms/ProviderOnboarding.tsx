import React, { useEffect, useState } from "react";
import { useFirebaseAuth } from "../../context/authContext";
import LanguageProficiency from "../FormElements/LanguageProficiency";
import LanguageTags from "../FormElements/LanguageTags";
import PassportUpload from "../FormElements/PassportUpload";
import ResumeUpload from "../FormElements/ResumeUpload";
import LeftImagePanel from "./LeftImagePanel";
import SkillTest from "./SkillTest";
import { useRouter } from "next/router";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import InfoPopover from "./InfoPopover";

function ProviderOnboarding() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [langs, setLangs] = useState([]);
  const [resumeLink, setResumeLink] = useState(null);
  const [passportLink, setPassportLink] = useState(null);
  const [videoLink, setVideoLink] = useState(null);
  const { authUser, addProviderApplicant } = useFirebaseAuth();
  const router = useRouter();

  const onDetailsSubmit = (event) => {
    event.preventDefault();
    if (langs.length === 0) {
      return setError("Please add atleast one language");
    }
    if (!resumeLink || !passportLink) {
      return setError("Please upload all the required files");
    }
    setError(null);
    setStep(2);
  };

  const onSubmit = async () => {
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
        // idCardLink,
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
          <h3 className="text-3xl text-yellow-300 font-bold mb-6">
            Select languages you specialize in
          </h3>
          <InfoPopover />
          <form onSubmit={onDetailsSubmit}>
            <LanguageTags
              langs={langs}
              setLangs={setLangs}
              placeholder="Add a Language"
            />

            <ResumeUpload
              setResumeLink={setResumeLink}
              setError={setError}
              title="Upload Resume (PDF)"
            />
            <PassportUpload
              setPassportLink={setPassportLink}
              setError={setError}
              title="Upload Verified Photo ID"
            />
            {/* <IdCardUpload setIdCardLink={setIdCardLink} setError={setError} /> */}
            {error && <div className="text-red-600 text-sm">*{error}</div>}
            <button className="btn btn-yellow w-full mt-6">Next</button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div>
          <button
            onClick={() => setStep(1)}
            className="text-sm font-medium text-blue flex items-center gap-1 mb-2"
          >
            <FaArrowLeft />
            Back
          </button>
          <h3 className="text-3xl text-yellow-300 font-bold mb-6">
            Select your proficiency in each language
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
          <button
            onClick={() => setStep(2)}
            className="text-sm font-medium text-blue flex items-center gap-1 mb-2"
          >
            <FaArrowLeft />
            Back
          </button>
          <h3 className="text-3xl text-yellow-300 font-bold mb-6">
            Verification and Skill Review
          </h3>
          <form onSubmit={() => setStep(4)}>
            <SkillTest setVideoLink={setVideoLink} reUpload={false} />
            {error && <div className="text-red-600 text-sm">*{error}</div>}
            <button className="btn btn-yellow w-full mt-6">
              Review application
            </button>
          </form>
        </div>
      )}
      {step === 4 && (
        <div>
          <button
            onClick={() => setStep(3)}
            className="text-sm font-medium text-blue flex items-center gap-1 mb-2"
          >
            <FaArrowLeft />
            Back
          </button>
          <h3 className="text-3xl text-yellow-300 font-bold mb-6">
            Review Your Application
          </h3>
          <h4 className="text-lg font-bold mb-4">Selected Languages</h4>
          <LanguageTags
            langs={langs}
            setLangs={setLangs}
            placeholder="Add a Language"
          />
          <h4 className="text-lg font-bold my-4">Languages Proficiency</h4>
          <LanguageProficiency
            langs={langs}
            languages={languages}
            setLanguages={setLanguages}
          />
          <h4 className="text-lg font-bold my-4">Documents Uploaded</h4>
          <div className="flex items-baseline justify-between">
            <a
              href={resumeLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-blue"
            >
              Resume <FaCheck className="text-green" />
            </a>

            <ResumeUpload
              setResumeLink={setResumeLink}
              setError={setError}
              title="Reupload Resume (PDF)"
            />
          </div>

          <div className="flex items-baseline justify-between">
            <a
              href={passportLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-blue"
            >
              Verified Photo ID <FaCheck className="text-green" />
            </a>

            <PassportUpload
              setPassportLink={setPassportLink}
              setError={setError}
              title="Reupload Verified Photo ID"
            />
          </div>

          <h4 className="text-lg font-bold my-4">Skill Test</h4>
          <video
            src={videoLink}
            width={500}
            height={500}
            className="w-2/3 mx-auto h-auto mb-4"
            controls
          ></video>
          <SkillTest setVideoLink={setVideoLink} reUpload={true} />
          <button className="btn btn-yellow w-full mt-6" onClick={onSubmit}>
            Submit
          </button>
        </div>
      )}
    </LeftImagePanel>
  );
}

export default ProviderOnboarding;
