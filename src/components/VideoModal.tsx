import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { storage } from "../config/firebaseConfig";
import { useFirebaseAuth } from "../context/authContext";

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

export default function VideoModal({ setShowModal, setVideoLink }) {
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
        // Handle unsuccessful uploads
      },
      () => {
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
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl font-semibold">Modal Title</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                  x
                </span>
              </button>
            </div>
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
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
