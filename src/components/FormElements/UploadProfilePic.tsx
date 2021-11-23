import React, { useState } from "react";
import ProgressRing from "../ProgressRing";
import Image from "next/image";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { storage } from "../../config/firebaseConfig";
import { useFirebaseAuth } from "../../context/authContext";

function ProfilePicUpload({ setPicLink }) {
  const { authUser } = useFirebaseAuth();
  const [upload, setUpload] = useState(false);
  const [picProgress, setPicProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);
  const uploadProfilePic = (e) => {
    console.log(e.target.files[0]);
    setUpload(true);
    const storageRef = ref(storage, `profile/${authUser.uid}`);
    const uploadPic = uploadBytesResumable(storageRef, e.target.files[0]);
    uploadPic.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPicProgress(progress);
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
        getDownloadURL(uploadPic.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setPicLink(downloadURL);
        });
      }
    );
  };
  return (
    <div className=" mt-2">
      <label className="w-full flex items-center justify-center px-4 py-3 bg-white rounded-md shadow-md tracking-wide cursor-pointer ease-linear transition-all duration-150">
        <div className="relative h-4 w-4 rounded-full px-2 py-2 bg-purple-100">
          <Image src="/cloud.svg" alt="" layout="fill" className="" />
        </div>
        <div className="text-sm font-medium ml-2">Upload Profile Pic</div>
        {upload && (
          <ProgressRing radius={12} stroke={2} progress={picProgress} />
        )}
        {!upload && uploadSuccess && "success"}
        {!upload && uploadFailed && "failed"}

        <input
          type="file"
          name="pic"
          id="pic"
          className="hidden"
          onChange={uploadProfilePic}
        />
      </label>
    </div>
  );
}

export default ProfilePicUpload;
