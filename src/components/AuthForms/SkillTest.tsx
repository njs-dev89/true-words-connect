import React, { useEffect, useState } from "react";
import Modal from "../Modal";
// import { IoMdVideocam } from "react-icons/io";

function SkillTest({ setVideoLink }) {
  const [showModal, setShowModal] = React.useState(false);

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
        Record your video
      </button>
      <p className="mt-3">
        Crete a video while reading this text and upload for review process
      </p>
      {showModal && (
        <Modal setShowModal={setShowModal} setVideoLink={setVideoLink} />
      )}
    </div>
  );
}

export default SkillTest;
