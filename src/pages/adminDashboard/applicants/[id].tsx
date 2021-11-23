import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { deleteDoc, doc, getDoc, setDoc } from "@firebase/firestore";
import { db, functions } from "../../../config/firebaseConfig";
import { httpsCallable } from "@firebase/functions";
import { useFirebaseAuth } from "../../../context/authContext";

function SingleApplicant() {
  const router = useRouter();
  const { authUser, loading } = useFirebaseAuth();
  const [dataLoading, setDataLoading] = useState(true);
  const [applicant, setApplicant] = useState(null);
  const addProviderRole = httpsCallable(functions, "addProviderRole");
  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/login");
    }
  }, [authUser]);
  useEffect(() => {
    async function loadData() {
      const docRef = doc(db, `/applicants/${router.query.id}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setApplicant(docSnap.data());
        setDataLoading(false);
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
      const userDoc = doc(db, `/providers/${router.query.id}`);
      const newUser = await setDoc(userDoc, {
        email: applicant.email,
        username: applicant.username,
        languages: applicant.languages,
        isProfileComplete: false,
        profile_pic: "/profile-placeholder.png",
      });
      const docRef = doc(db, `/applicants/${router.query.id}`);
      await deleteDoc(docRef);
      const roleMessage = await addProviderRole({ uid: router.query.id });
      router.push("/adminDashboard/applicants");
    } catch (e) {
      console.log(e);
    }
  };
  if (loading) {
    return <p>Loading...</p>;
  } else {
    return (
      <div className="col-span-3 bg-white shadow-md rounded-xl px-8 py-16">
        {dataLoading ? (
          <p>Loading..</p>
        ) : (
          <>
            <div className="flex justify-between mb-16">
              <h3 className="text-2xl  font-bold text-blue">
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
                <button className="btn btn-blue" onClick={acceptApplication}>
                  Accept Application
                </button>
              </div>
            </div>
            <div>
              <h3 className="mb-16 text-xl text-blue font-bold mt-16">
                Passport
              </h3>
              <div
                className="relative mx-auto"
                style={{ width: "500px", height: "500px" }}
              >
                <Image src={applicant.passport_link} alt="" layout="fill" />
              </div>
              <h3 className="mb-16 text-xl text-blue font-bold mt-16">
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
              <h3 className="mb-16 text-xl text-blue font-bold mt-16">
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
}

export default SingleApplicant;
