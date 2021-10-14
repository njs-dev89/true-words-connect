import React, { useEffect, useState } from "react";
import router, { useRouter } from "next/router";
import Image from "next/image";
import { deleteDoc, doc, getDoc, setDoc } from "@firebase/firestore";
import { db } from "../../../config/firebaseConfig";

function SingleApplicant() {
  const { query } = useRouter();
  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState(null);
  useEffect(() => {
    async function loadData() {
      const docRef = doc(db, `/applicants/${query.id}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setApplicant(docSnap.data());
        setLoading(false);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptApplication = async (e) => {
    try {
      const userDoc = doc(db, `/translators/${query.id}`);
      const newUser = await setDoc(userDoc, {
        email: applicant.email,
        username: applicant.username,
        languages: applicant.languages,
        profile_pic: "https://picsum.photos/300/219/200/300",
      });
      const docRef = doc(db, `/applicants/${query.id}`);
      await deleteDoc(docRef);
      router.push("/adminDashboard/applicants");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="col-span-3 bg-white shadow-md rounded-xl px-8 py-16">
      {loading ? (
        <p>Loading..</p>
      ) : (
        <>
          <div className="flex justify-between mb-16">
            <h3 className="text-2xl  font-bold text-blue-800">
              {applicant.username} details
            </h3>
            <div className="">
              <a
                href={applicant.resume_link}
                target="_blank"
                rel="noreferrer"
                className="btn btn-yellow mr-3"
              >
                View Resume
              </a>
              <a className="btn btn-blue" onClick={acceptApplication}>
                Accept Application
              </a>
            </div>
          </div>
          <div>
            <h3 className="mb-16 text-xl text-blue-600 font-bold mt-16">
              Passport
            </h3>
            <div
              className="relative mx-auto"
              style={{ width: "500px", height: "500px" }}
            >
              <Image src={applicant.passport_link} alt="" layout="fill" />
            </div>
            <h3 className="mb-16 text-xl text-blue-600 font-bold mt-16">
              Id Card
            </h3>
            <div
              className="relative mx-auto"
              style={{ width: "500px", height: "500px" }}
            >
              <Image src={applicant.id_card_link} alt="" layout="fill" />
            </div>
          </div>
          <div className="">
            <h3 className="mb-16 text-xl text-blue-600 font-bold mt-16">
              Demo Video
            </h3>
            <video
              src={applicant.video_link}
              width={500}
              height={500}
              className="w-2/3 mx-auto h-auto"
              controls
            ></video>
          </div>
        </>
      )}
    </div>
  );
}

export default SingleApplicant;
