import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "@firebase/storage";
import * as React from "react";
import Image from "next/image";
import { storage } from "../../config/firebaseConfig";
import { FaTimes } from "react-icons/fa";

function AttachementUpload({ file, setFiles, files, room, id }) {
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  const [uploadFailed, setUploadFailed] = React.useState(false);
  const [upload, setUpload] = React.useState(false);
  const [error, setError] = React.useState(null);

  const removeFile = (e) => {
    const storageRef = ref(
      storage,
      `attachement/${room.id}/${id}/${file.name}`
    );

    deleteObject(storageRef)
      .then(() => {
        // File deleted successfully
        const filteredFiles = files.filter((f) => f.name !== file.name);
        setFiles(filteredFiles);
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
  };

  React.useEffect(() => {
    if (file.uploadComplete) {
      setUploadProgress(100);
      setUploadSuccess(true);
    } else {
      setUpload(true);
      const storageRef = ref(
        storage,
        `attachement/${room.id}/${id}/${file.name}`
      );
      const uploadAttachement = uploadBytesResumable(storageRef, file);
      uploadAttachement.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);

          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
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
          getDownloadURL(uploadAttachement.snapshot.ref).then((downloadURL) => {
            file.uploadComplete = true;
            file.downloadURL = downloadURL;

            const filteredFiles = files.filter((f) => f.name !== file.name);
            setFiles([...filteredFiles, file]);
          });
        }
      );
    }
  }, []);

  return (
    <div
      className={`mr-2 bg-blue-50 text-gray-500 font-medium text-sm px-2 py-1 rounded flex items-center gap-1  ${
        uploadSuccess && "text-green"
      }`}
    >
      {file.name}
      {upload && (
        <div className="relative h-4 w-4">
          <Image src="/loading.gif" layout="fill" />
        </div>
      )}
      {uploadSuccess && (
        <button onClick={removeFile}>
          <FaTimes />
        </button>
      )}
    </div>
  );
}

export default AttachementUpload;
