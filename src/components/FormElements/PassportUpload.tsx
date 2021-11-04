import React, { useState } from "react";
import ProgressRing from "../ProgressRing";
import Image from "next/image";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { storage } from "../../config/firebaseConfig";
import { useFirebaseAuth } from "../../context/authContext";
import { FcHighPriority, FcOk } from "react-icons/fc";

function PassportUpload({ setPassportLink, setError }) {
  const { authUser } = useFirebaseAuth();
  const [upload, setUpload] = useState(false);
  const [passportProgress, setPassportProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);
  const uploadPassport = (e) => {
    console.log(e.target.files[0]);
    if (e.target.files[0].type.split("/")[0] !== "image") {
      return setError("Passport must be an image format");
    }
    setUpload(true);
    const storageRef = ref(storage, `passports/${authUser.uid}`);
    const uploadPassport = uploadBytesResumable(storageRef, e.target.files[0]);
    uploadPassport.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPassportProgress(progress);
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
        getDownloadURL(uploadPassport.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setPassportLink(downloadURL);
        });
      }
    );
  };
  return (
    <div className="mt-4">
      <label className="w-full flex items-center justify-center px-4 py-3 bg-white rounded-md shadow-md tracking-wide cursor-pointer ease-linear transition-all duration-150">
        <div className="relative h-6 w-6 rounded-full px-2 py-2 bg-purple-100">
          <Image src="/cloud.svg" alt="" layout="fill" className="" />
        </div>
        <div className="text-base ml-2 mr-2">Upload Scanned passport</div>
        {upload && (
          <ProgressRing radius={12} stroke={2} progress={passportProgress} />
        )}
        {!upload && uploadSuccess && <FcOk className="text-xl" />}
        {!upload && uploadFailed && <FcHighPriority className="text-xl" />}

        <input
          type="file"
          name="passport"
          accept="image/*"
          id="passport"
          className="hidden"
          onChange={uploadPassport}
        />
      </label>
    </div>
  );
}

export default PassportUpload;
