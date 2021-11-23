import React, { useEffect, useState } from "react";
import { useFirebaseAuth } from "../../context/authContext";
import UploadProfilePic from "../FormElements/UploadProfilePic";
import Image from "next/image";
import { db } from "../../config/firebaseConfig";
import { doc, setDoc } from "@firebase/firestore";
import { useRouter } from "next/router";
import ModalContainer from "../ModalContainer";

function EditUser({ setShowModal, client }) {
  const router = useRouter();
  const { authUser } = useFirebaseAuth();
  const [username, setUsername] = useState(client.username);
  const [fullname, setFullname] = useState("");

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [picLink, setPicLink] = useState("");

  useEffect(() => {
    if (client.address) {
      setCity(client.address.city);
      setState(client.address.state);
      setCountry(client.address.country);
    }
    if (client.fullname) {
      setFullname(client.fullname);
    }

    if (client.profile_pic) {
      setPicLink(client.profile_pic);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userDoc = doc(db, `/clients/${authUser.uid}`);
    const newUser = await setDoc(
      userDoc,
      {
        username,
        fullname,

        address: {
          city,
          state,
          country,
        },
        profile_pic: picLink,
      },
      { merge: true }
    );
    router.reload();
  };

  return (
    <ModalContainer title="Edit profile" setShowModal={setShowModal}>
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
          <label htmlFor="fullname" className="text-sm mb-4 font-bold">
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
    </ModalContainer>
  );
}

export default EditUser;
