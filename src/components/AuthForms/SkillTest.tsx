import * as React from "react";
import { FcHighPriority, FcOk } from "react-icons/fc";
import VideoModal from "../VideoModal";
// import { IoMdVideocam } from "react-icons/io";

function SkillTest({ setVideoLink, reUpload }) {
  const [showModal, setShowModal] = React.useState(false);
  const [upload, setUpload] = React.useState(false);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  const [uploadFailed, setUploadFailed] = React.useState(false);

  return (
    <div>
      {!reUpload && (
        <p className="mb-8">
          To verify your skills, please record a video of yourself stating the
          language(s) you are using and repeat the text presented to you in the
          language(s) you have selected. Be sure your microphone and video are
          working on your device and that you are speaking clearly. If we find
          we are not able to understand or verify the language, we will contact
          you to perform separate testing.
        </p>
      )}
      <button
        className="w-full flex items-center justify-center px-4 py-3 bg-white rounded-md shadow-sm tracking-wide cursor-pointer ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        {/* <IoMdVideocam /> */}
        <span className="mr-2">
          {reUpload ? "Record Your Video Again" : "Record Your Video"}
        </span>
        {!upload && uploadSuccess && <FcOk className="text-xl" />}
        {!upload && uploadFailed && <FcHighPriority className="text-xl" />}
      </button>
      {!reUpload && (
        <p className="mt-3 text-sm">
          Create a video while reading the text provided and upload for review
          process
        </p>
      )}
      {showModal && (
        <VideoModal
          setShowModal={setShowModal}
          setVideoLink={setVideoLink}
          setUpload={setUpload}
          setUploadSuccess={setUploadSuccess}
          setUploadFailed={setUploadFailed}
        />
      )}
    </div>
  );
}

export default SkillTest;
