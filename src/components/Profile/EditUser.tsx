import * as React from "react";
import { useFirebaseAuth } from "../../context/authContext";
import UploadProfilePic from "../FormElements/UploadProfilePic";
import Image from "next/image";
import { db } from "../../config/firebaseConfig";
import { doc, setDoc } from "@firebase/firestore";
import { useRouter } from "next/router";
import ModalContainer from "../ModalContainer";
import validator from "validator";

function EditUser({ setShowModal, provider }) {
  const router = useRouter();
  const { authUser } = useFirebaseAuth();
  const [username, setUsername] = React.useState(provider.username);
  const [fullname, setFullname] = React.useState("");
  const [hourlyPrice, setHourlyPrice] = React.useState(null);
  const [tagline, setTagline] = React.useState("");
  const [about, setAbout] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [picLink, setPicLink] = React.useState("");
  const [error, setError] = React.useState(null);
  const [step, setStep] = React.useState(1);

  React.useEffect(() => {
    if (provider.address) {
      setCity(provider.address.city);
      setState(provider.address.state);
      setCountry(provider.address.country);
    }
    if (provider.fullname) {
      setFullname(provider.fullname);
    }

    if (provider.tagline) {
      setTagline(provider.tagline);
    }

    if (provider.about) {
      setAbout(provider.about);
    }
    if (provider.hourly_rate) {
      setHourlyPrice(provider.hourly_rate);
    }
    if (provider.profile_pic) {
      setPicLink(provider.profile_pic);
    }
  }, []);

  const handleNext = (e) => {
    if (!validator.isLength(username, { min: 6, max: undefined })) {
      return setError("Username must be atleast 6 characters long");
    }
    if (!validator.isAlphanumeric(username, "en-US", { ignore: "_" })) {
      return setError("Username must contain letters, numbers or underscore ");
    }
    if (validator.isEmpty(fullname)) {
      return setError("Please set your full name");
    }
    if (validator.isEmpty(tagline)) {
      return setError("Please write your tagline");
    }
    if (validator.isEmpty(String(hourlyPrice))) {
      return setError("Please enter your hourly price");
    }
    if (hourlyPrice === 0) {
      return setError("Please enter your hourly price");
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validator.isLength(about, { min: 30, max: undefined })) {
      return setError("About must be atleast 30 characters long");
    }
    if (validator.isEmpty(city)) {
      return setError("Please Enter your city");
    }
    if (validator.isEmpty(state)) {
      return setError("Please Enter your State");
    }
    if (validator.isEmpty(country)) {
      return setError("Please Enter your country");
    }
    setError(null);
    const userDoc = doc(db, `/providers/${authUser.uid}`);
    const newUser = await setDoc(
      userDoc,
      {
        username: username.trim(),
        fullname: fullname.trim(),
        tagline: tagline.trim(),
        hourly_rate: Number(hourlyPrice),
        isProfileComplete: true,
        address: {
          city: city.trim(),
          state: state.trim(),
          country: country.trim(),
        },
        profile_pic: picLink,
        about: about.trim(),
      },
      { merge: true }
    );
    router.reload();
  };

  return (
    <ModalContainer setShowModal={setShowModal} title="Edit Profile">
      {/*body*/}
      <form
        className="w-96 px-8 py-8 overflow-y-auto h-3/4 flex flex-col"
        onSubmit={handleSubmit}
        style={{ width: "500px" }}
      >
        {step === 1 && (
          <>
            <div className="flex flex-col justify-between items-center mb-4">
              {picLink === "" ? (
                ""
              ) : (
                <div className="w-28 h-28 relative rounded-full overflow-hidden">
                  <Image src={picLink} alt="" layout="fill" />
                </div>
              )}

              <UploadProfilePic setPicLink={setPicLink} />
            </div>
            {error && <div className="text-red-600 text-sm">*{error}</div>}
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
              <label htmlFor="tagline" className="text-sm mb-4 font-bold">
                Short status
              </label>
              <input
                type="text"
                name="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="form-input border-gray-200 h-10 rounded text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="hourly_price" className="text-sm mb-4 font-bold">
                Hourly Price
              </label>

              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  min="0"
                  name="hourly_price"
                  id="price"
                  value={hourlyPrice}
                  onChange={(e) => setHourlyPrice(Number(e.target.value))}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-6 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
            </div>
            <button
              className="btn btn-green mt-4"
              type="button"
              onClick={handleNext}
            >
              Next
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <div className="flex flex-col mb-4">
              <label htmlFor="about" className="text-sm mb-4 font-bold">
                About
              </label>
              <textarea
                // type="text"
                name="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="form-input border-gray-200 h-20 rounded text-sm"
              ></textarea>
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
          </>
        )}
      </form>
      {/* Body End */}
    </ModalContainer>
  );
}

export default EditUser;
