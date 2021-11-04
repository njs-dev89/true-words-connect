import { useRouter } from "next/router";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFirebaseAuth } from "../context/authContext";
import { doc, collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

function CreateOfferRequest({ setShowModal }) {
  const [service, setService] = useState("teaching");
  const [contractType, setContractType] = useState("hourly");
  const [serviceType, setServiceType] = useState("online");
  const [language, setLanguage] = useState("akan");
  const [hrs, setHrs] = useState(0);
  const [days, setDays] = useState(0);
  const [budget, setBudget] = useState(0.0);
  const [startDate, setStartDate] = useState(null);
  const { query } = useRouter();
  const { authUser } = useFirebaseAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData: any = {
      service,
      contractType,
      serviceType,
      language,
      budget,
      client: {
        id: authUser.uid,
        username: authUser.profile.username,
        profile_pic: authUser.profile.profile_pic,
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
      `/translators/${query.id}/offerRequest`
    );
    const offerReqDocRef = await addDoc(offerRequestCollection, formData);
    setShowModal(false);
  };
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-center justify-between py-3 mx-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-lg text-blue font-semibold">Offer Request</h3>
              <button
                className="ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
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
                  Select Language
                </label>
                <select
                  name="language"
                  id=""
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="form-input border-gray-200 h-10 rounded text-sm"
                >
                  <option value="akan">Akan</option>
                  <option value="ewe">Ewe</option>
                </select>
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
                      min="0"
                      name="hours"
                      id="hours"
                      value={hrs}
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
                        min="0"
                        name="days"
                        id="days"
                        value={days}
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
                    min="0"
                    name="price"
                    id="price"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-6 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <button className="btn btn-green">Create Offer</button>
            </form>
            {/*Endbody*/}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default CreateOfferRequest;
