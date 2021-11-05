import React, { useState } from "react";
import { FcHighPriority, FcOk } from "react-icons/fc";
import VideoModal from "../VideoModal";
// import { IoMdVideocam } from "react-icons/io";

function SkillTest({ setVideoLink }) {
  const [showModal, setShowModal] = useState(false);
  const [upload, setUpload] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);

  return (
    <div>
      <p className="mb-8">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro
        blanditiis adipisci veniam provident laboriosam, quibusdam quos sint
        perspiciatis. Fuga voluptatem sapiente consequatur deserunt quo quaerat
        vero, aperiam suscipit praesentium repellat.
      </p>
      <button
        className="w-full flex items-center justify-center px-4 py-3 bg-white rounded-md shadow-sm tracking-wide cursor-pointer ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        {/* <IoMdVideocam /> */}
        <span className="mr-2">Record your video</span>
        {!upload && uploadSuccess && <FcOk className="text-xl" />}
        {!upload && uploadFailed && <FcHighPriority className="text-xl" />}
      </button>
      <p className="mt-3">
        Crete a video while reading this text and upload for review process
      </p>
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
