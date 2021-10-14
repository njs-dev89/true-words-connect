import React, { useEffect, useState } from "react";
import { useFirebaseAuth } from "../context/authContext";
import UploadProfilePic from "./FormElements/UploadProfilePic";
import Image from "next/image";
import { db } from "../config/firebaseConfig";
import { doc, setDoc } from "@firebase/firestore";
import { useRouter } from "next/router";

function EditUser({ setShowModal, translator }) {
  const router = useRouter();
  const { authUser } = useFirebaseAuth();
  const [username, setUsername] = useState(translator.username);
  const [fullname, setFullname] = useState("");
  const [hourlyPrice, setHourlyPrice] = useState(null);
  const [about, setAbout] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [picLink, setPicLink] = useState("");

  useEffect(() => {
    if (translator.address) {
      setCity(translator.address.city);
      setState(translator.address.state);
      setCountry(translator.address.country);
    }
    if (translator.fullname) {
      setFullname(translator.fullname);
    }

    if (translator.about) {
      setAbout(translator.about);
    }
    if (translator.hourly_rate) {
      setHourlyPrice(translator.hourly_rate);
    }
    if (translator.profile_pic) {
      setPicLink(translator.profile_pic);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userDoc = doc(db, `/translators/${authUser.uid}`);
    const newUser = await setDoc(
      userDoc,
      {
        username,
        fullname,
        hourly_rate: hourlyPrice,
        address: {
          city,
          state,
          country,
        },
        profile_pic: picLink,
        about,
      },
      { merge: true }
    );
    router.reload();
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-hidden py-4 fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-screen">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl font-semibold">Edit Profile</h3>
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
            <form
              className="w-96 px-8 py-8 overflow-y-auto h-3/4 flex flex-col gap-4"
              onSubmit={handleSubmit}
              style={{ width: "500px" }}
            >
              <div className="flex flex-col justify-between items-center mb-6">
                {picLink === "" ? (
                  ""
                ) : (
                  <div className="w-36 h-36 relative rounded-full overflow-hidden">
                    <Image src={picLink} alt="" layout="fill" />
                  </div>
                )}

                <UploadProfilePic setPicLink={setPicLink} />
              </div>
              <div className="flex flex-col">
                <label htmlFor="username" className="text-sm mb-4 font-bold">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input border-gray-200 h-10 rounded text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="username" className="text-sm mb-4 font-bold">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="form-input border-gray-200 h-10 rounded text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="hourly_price"
                  className="text-sm mb-4 font-bold"
                >
                  Hourly Price
                </label>
                <input
                  type="number"
                  name="hourly_price"
                  value={hourlyPrice}
                  onChange={(e) => setHourlyPrice(e.target.value)}
                  className="form-input border-gray-200 h-10 rounded text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="about" className="text-sm mb-4 font-bold">
                  About
                </label>
                <input
                  type="text"
                  name="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="form-input border-gray-200 h-10 rounded text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="city" className="text-sm mb-4 font-bold">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-input border-gray-200 h-10 rounded text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="state" className="text-sm mb-4 font-bold">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="form-input border-gray-200 h-10 rounded text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="about" className="text-sm mb-4 font-bold">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="form-input border-gray-200 h-10 rounded text-sm"
                />
              </div>

              <button className="btn btn-green mt-4">Submit</button>
            </form>
            {/* Body End */}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default EditUser;
