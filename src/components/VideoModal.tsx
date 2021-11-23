import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { storage } from "../config/firebaseConfig";
import { useFirebaseAuth } from "../context/authContext";
import ModalContainer from "./ModalContainer";

const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  if (!stream) {
    return null;
  }
  return <video ref={videoRef} width={500} height={500} autoPlay controls />;
};

export default function VideoModal({
  setShowModal,
  setVideoLink,
  setUploadSuccess,
  setUpload,
  setUploadFailed,
}) {
  const videoRef = useRef(null);
  const { authUser } = useFirebaseAuth();
  const [showPreview, setShowPreview] = useState(true);
  const [blob, setBlob] = useState(null);
  const { status, startRecording, stopRecording, mediaBlobUrl, previewStream } =
    useReactMediaRecorder({
      video: true,
      onStop: (blobUrl, blob) => {
        setBlob(blob);
      },
    });

  useEffect(() => {
    startRecording();

    return () => {
      stopRecording();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadVideo = () => {
    const storageRef = ref(storage, `skill-test/${authUser.uid}`);
    const uploadVideo = uploadBytesResumable(storageRef, blob);

    uploadVideo.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
      },
      () => {
        setUpload(false);
        setUploadSuccess(true);
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadVideo.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setVideoLink(downloadURL);
          setShowModal(false);
        });
      }
    );
  };
  return (
    <ModalContainer title="Record you video" setShowModal={setShowModal}>
      {/*body*/}
      <div>
        <div className="p-4">
          {showPreview && <VideoPreview stream={previewStream} />}
          {!showPreview && status === "stopped" && (
            <video src={mediaBlobUrl} controls autoPlay loop />
          )}
          {status === "recording" && (
            <button
              onClick={() => {
                setShowPreview(false);
                stopRecording();
              }}
              type="button"
              className="btn btn-blue mt-4 mb-4"
            >
              Stop Recording
            </button>
          )}
          {status === "stopped" && (
            <button
              onClick={() => {
                setShowPreview(true);
                startRecording();
              }}
              type="button"
              className="btn btn-yellow m-4 mr-4"
            >
              Recording again
            </button>
          )}
          {blob && status === "stopped" && (
            <button
              type="button"
              className="btn btn-green"
              onClick={uploadVideo}
            >
              Upload now
            </button>
          )}
        </div>
      </div>
    </ModalContainer>
  );
}
