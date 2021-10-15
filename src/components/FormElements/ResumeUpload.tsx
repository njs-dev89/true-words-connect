import React, { useState } from "react";
import ProgressRing from "../ProgressRing";
import Image from "next/image";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { storage } from "../../config/firebaseConfig";
import { useFirebaseAuth } from "../../context/authContext";
import { FcHighPriority, FcOk } from "react-icons/fc";

function ResumeUpload({ setResumeLink }) {
  const { authUser } = useFirebaseAuth();
  const [upload, setUpload] = useState(false);
  const [resumeProgress, setResumeProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);
  const uploadResume = (e) => {
    console.log(e.target.files[0]);
    setUpload(true);
    const storageRef = ref(storage, `resumes/${authUser.uid}`);
    const uploadResume = uploadBytesResumable(storageRef, e.target.files[0]);
    uploadResume.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setResumeProgress(progress);
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        setUpload(false);
        setUploadFailed(true);
        // Handle unsuccessful uploads
      },
      () => {
        setUpload(false);
        setUploadSuccess(true);
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadResume.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setResumeLink(downloadURL);
        });
      }
    );
  };
  return (
    <div className="">
      <label className="w-full flex items-center justify-center px-4 py-3 bg-white rounded-md shadow-md tracking-wide cursor-pointer ease-linear transition-all duration-150">
        <div className="relative h-6 w-6 rounded-full px-2 py-2 bg-purple-100">
          <Image src="/cloud.svg" alt="" layout="fill" className="" />
        </div>
        <div className="text-base ml-2 mr-2">Upload Resume</div>
        {upload && (
          <ProgressRing radius={12} stroke={2} progress={resumeProgress} />
        )}
        {!upload && uploadSuccess && <FcOk className="text-xl" />}
        {!upload && uploadFailed && <FcHighPriority className="text-xl" />}

        <input
          type="file"
          name="resume"
          id="resume"
          className="hidden"
          onChange={uploadResume}
        />
      </label>
    </div>
  );
}

export default ResumeUpload;
