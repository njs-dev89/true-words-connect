import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "../../../config/firebaseConfig";

function TranslatorProfilePage() {
  const { query } = useRouter();
  const [loading, setLoading] = useState(true);
  const [translator, setTranslator] = useState(null);
  const [openTab, setOpenTab] = useState(1);

  useEffect(() => {
    async function loadData() {
      const docRef = doc(db, `/translators/${query.id}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTranslator(docSnap.data());
        setLoading(false);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-blue-50 pb-16 pt-32 min-h-screen">
      <div className="container">
        <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
          {/*========= Left Panel ========== */}
          <div className="col-span-1 bg-white py-6 shadow-md rounded-xl">
            {loading ? (
              <p>loading...</p>
            ) : (
              <>
                <div className="flex flex-col items-center px-4 pb-4 border-b">
                  <div className="w-24 h-24 relative rounded-full overflow-hidden">
                    <Image src={translator.profile_pic} alt="" layout="fill" />
                  </div>
                  <h3 className="font-bold text-lg mt-4 mb-2">
                    {translator.username}
                  </h3>
                  <p className="text-center text-sm">
                    Tag line Lorem ipsum dolor sit amet consectetur adipisicing
                    elit. Nihil?
                  </p>
                  <p className="text-gray-700 mt-4">Not rated Yet</p>
                </div>
                <div className="px-4 mt-4">
                  <h3 className="text-blue-600 font-bold ">
                    Personal Information
                  </h3>
                  <div className="flex">
                    <div className="mr-4">
                      <p className="my-3">Full Name</p>
                      <p className="my-3">Email</p>
                      <p className="my-3">Location</p>
                    </div>
                    <div className="text-gray-600">
                      <p className="my-3">John Doe</p>
                      <p className="my-3">test@email.com</p>
                      <p className="my-3">Ghana</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {/*========= Left Panel End ========== */}

          {/*==========Right Panel ============= */}
          <div className="col-span-3 rounded-xl bg-white shadow-md">
            <div className="flex flex-wrap">
              <div className="w-full px-8 pt-6">
                {/*========Tabs========== */}
                <ul
                  className="flex md:justify-between justify-start mb-0 list-none pt-3 pb-4"
                  role="tablist"
                >
                  <li className="-mb-px mr-2 last:mr-0 text-center">
                    <a
                      className={
                        " font-bold px-4 py-3 " +
                        (openTab === 1
                          ? "text-yellow-300 border-b-2 border-yellow-300"
                          : "text-black-600 bg-white")
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenTab(1);
                      }}
                      data-toggle="tab"
                      href="#link1"
                      role="tablist"
                    >
                      Overview
                    </a>
                  </li>
                  <li className="-mb-px mr-2 last:mr-0 text-center">
                    <a
                      className={
                        "font-bold px-4 py-3 leading-normal " +
                        (openTab === 2
                          ? "text-yellow-300 border-b-2 border-yellow-300"
                          : "text-black-600 bg-white")
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenTab(2);
                      }}
                      data-toggle="tab"
                      href="#link2"
                      role="tablist"
                    >
                      Orders
                    </a>
                  </li>
                  <li className="-mb-px mr-2 last:mr-0 text-center">
                    <a
                      className={
                        "font-bold px-4 py-3 leading-normal " +
                        (openTab === 3
                          ? "text-yellow-300 border-b-2 border-yellow-300"
                          : "text-black-600 bg-white")
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenTab(3);
                      }}
                      data-toggle="tab"
                      href="#link3"
                      role="tablist"
                    >
                      Messages
                    </a>
                  </li>
                  <li className="-mb-px mr-2 last:mr-0 text-center">
                    <a
                      className={
                        "font-bold px-4 py-3 leading-normal " +
                        (openTab === 4
                          ? "text-yellow-300 border-b-2 border-yellow-300"
                          : "text-black-600 bg-white")
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenTab(4);
                      }}
                      data-toggle="tab"
                      href="#link3"
                      role="tablist"
                    >
                      Offer Request
                    </a>
                  </li>

                  <li className="-mb-px mr-2 last:mr-0 text-center">
                    <a
                      className={
                        "font-bold px-4 py-3 leading-normal " +
                        (openTab === 5
                          ? "text-yellow-300 border-b-2 border-yellow-300"
                          : "text-black-600 bg-white")
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenTab(5);
                      }}
                      data-toggle="tab"
                      href="#link3"
                      role="tablist"
                    >
                      Reviews
                    </a>
                  </li>
                </ul>
                {/*========Tabs End========== */}

                {/*========Tabs Pane========== */}
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6">
                  <div className="px-4 py-5 flex-auto">
                    <div className="tab-content tab-space">
                      <div
                        className={openTab === 1 ? "block" : "hidden"}
                        id="link1"
                      >
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <>
                            {" "}
                            <div className="">
                              <h3 className="text-blue-600 font-bold text-xl">
                                About
                              </h3>
                              <p className="p-4 mt-4 pb-8 border rounded">
                                {translator.about}
                              </p>
                            </div>
                            <div className="mt-6">
                              <h3 className="text-blue-600 font-bold text-xl">
                                Languages
                              </h3>
                              <ul className="list-disc list-inside mt-4">
                                {translator.languages.map((lang, idx) => (
                                  <li key={idx}>{lang}</li>
                                ))}
                              </ul>
                            </div>
                          </>
                        )}
                      </div>
                      <div
                        className={openTab === 2 ? "block" : "hidden"}
                        id="link2"
                      >
                        <p>
                          Completely synergize resource taxing relationships via
                          premier niche markets. Professionally cultivate
                          one-to-one customer service with robust ideas.
                          <br />
                          <br />
                          Dynamically innovate resource-leveling customer
                          service for state of the art customer service.
                        </p>
                      </div>
                      <div
                        className={openTab === 3 ? "block" : "hidden"}
                        id="link3"
                      >
                        <p>
                          Efficiently unleash cross-media information without
                          cross-media value. Quickly maximize timely
                          deliverables for real-time schemas.
                          <br />
                          <br /> Dramatically maintain clicks-and-mortar
                          solutions without functional solutions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/*========Tabs Pane End========== */}
              </div>
            </div>
          </div>
          {/*==========Right Panel End ========= */}
        </div>
      </div>
    </div>
  );
}

export default TranslatorProfilePage;
