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

const Button = ({ setRecordingStarted }) => (
  <button className="btn btn-blue" onClick={() => setRecordingStarted(true)}>
    {" "}
    Start Recording
  </button>
);

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
  const [recordingStarted, setRecordingStarted] = useState(false);
  const { status, startRecording, stopRecording, mediaBlobUrl, previewStream } =
    useReactMediaRecorder({
      video: true,
      onStop: (blobUrl, blob) => {
        setBlob(blob);
      },
    });

  useEffect(() => {
    if (recordingStarted) {
      startRecording();
    }

    return () => {
      stopRecording();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordingStarted]);

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
      {recordingStarted ? (
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
                Record Again
              </button>
            )}
            {blob && status === "stopped" && (
              <button
                type="button"
                className="btn btn-green"
                onClick={uploadVideo}
              >
                Upload Now
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="px-4 py-6">
          <h3 className="text-xl font-bold mb-6">
            Translate given sentences in the languages you selected and repeat
            while recording.
          </h3>
          <ol className="list-decimal ml-8 mb-4 leading-8">
            <li>
              Please make sure that you collect all your belongings and take
              them with you.
            </li>
            <li>
              This year, you will not need a textbook because all required
              readings will be posted in the student portal.
            </li>
            <li>
              When my sister bought five apples from the supermarket, she let my
              niece and nephew ate three of them.
            </li>
            <li>
              Today I have been able to clean my whole house in under an hour
              while still being able to finish my assignment by 5 pm.
            </li>
            <li>What were you doing today?</li>
          </ol>
          <div className="text-right">
            <Button setRecordingStarted={setRecordingStarted} />
          </div>
        </div>
      )}
    </ModalContainer>
  );
}
