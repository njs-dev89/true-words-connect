import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFirebaseAuth } from "../../context/authContext";
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import ModalContainer from "../ModalContainer";

function CreateOfferRequest({ setShowModal }) {
  const [service, setService] = useState("teaching");
  const [contractType, setContractType] = useState("hourly");
  const [serviceType, setServiceType] = useState("online");
  const [language, setLanguage] = useState("");
  const [hrs, setHrs] = useState(0);
  const [days, setDays] = useState(0);
  const [budget, setBudget] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [langOptions, setLangOptions] = useState([]);
  const router = useRouter();
  const { authUser } = useFirebaseAuth();

  useEffect(() => {
    let suggst = [];
    const q = query(collection(db, "/languages"));
    getDocs(q).then((snap) => {
      snap.forEach((langSnap) => {
        suggst.push(langSnap.data().language);
      });
      setLangOptions(suggst);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData: any = {
      service,
      contractType,
      serviceType,
      language,
      status: "active",
      budget,
      client: {
        id: authUser.uid,
        username: authUser.profile.username,
        profile_pic: authUser.profile.profile_pic,
        email: authUser.profile.email,
      },
    };
    if (contractType === "hourly") {
      formData.hours = hrs;
    } else if (contractType === "fullDay") {
      formData.days = days;
      formData.startDate = startDate;
    }

    const offerRequestCollection = collection(
      db,
      `/providers/${router.query.id}/offerRequest`
    );
    const offerReqDocRef = await addDoc(offerRequestCollection, formData);

    setShowModal(false);
  };
  return (
    <ModalContainer title="Offer Request" setShowModal={setShowModal}>
      {/*body*/}
      <form
        className="w-96 px-8 py-8 overflow-y-auto h-3/4 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label
            htmlFor="service"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Service
          </label>
          <select
            name="service"
            id=""
            className="form-input border-gray-200 h-10 rounded text-sm"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="teaching">Teaching</option>
            <option value="translation">Translation</option>
            <option value="interpretation">Interpretation</option>
            <option value="subtitling">Subtitling</option>
            <option value="proofreading">Proofreading</option>
            <option value="dubbing">Dubbing</option>
            <option value="localization">Localization</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="contractType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Contract Type
          </label>
          <select
            name="contractType"
            id=""
            value={contractType}
            onChange={(e) => setContractType(e.target.value)}
            className="form-input border-gray-200 h-10 rounded text-sm"
          >
            <option value="hourly">Hourly</option>
            <option value="fullDay">Full Day</option>
            <option value="longTerm">Long term</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="serviceType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Service Type
          </label>
          <select
            name="serviceType"
            id=""
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="form-input border-gray-200 h-10 rounded text-sm"
          >
            <option value="online">Online</option>
            <option value="inPerson">In person</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Set Language
          </label>
          <input
            name="language"
            id="language"
            list="languages"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="form-input border focus:border-blue-500 px-4 border-gray-200 h-10 rounded text-sm"
          />
          <datalist id="languages">
            {langOptions.map((opt, idx) => (
              <option value={opt} key={idx + 5} />
            ))}
          </datalist>
        </div>

        {contractType === "hourly" && (
          <div>
            <label
              htmlFor="hours"
              className="block text-sm font-medium text-gray-700"
            >
              Enter No of hrs
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-2/3 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">hrs</span>
              </div>
              <input
                type="number"
                min={0}
                name="hours"
                id="hours"
                value={hrs === 0 ? "" : hrs}
                onChange={(e) => setHrs(Number(e.target.value))}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-6 sm:text-sm border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
          </div>
        )}

        {contractType === "fullDay" && (
          <div className="flex items-center gap-2">
            <div>
              <label
                htmlFor="days"
                className="block text-sm font-medium text-gray-700"
              >
                Enter No of days
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-1/3 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">days</span>
                </div>
                <input
                  type="number"
                  min={0}
                  name="days"
                  id="days"
                  value={days === 0 ? "" : days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-6 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Select Start Date
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                minDate={new Date()}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-6 sm:text-sm border-gray-300 rounded-md"
                placeholderText="Start date"
              />
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Enter your Budget
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              min={0}
              name="price"
              id="price"
              value={budget === 0 ? "" : budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-6 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
        </div>

        <button className="btn btn-green">Create Request</button>
      </form>
      {/*Endbody*/}
    </ModalContainer>
  );
}

export default CreateOfferRequest;
