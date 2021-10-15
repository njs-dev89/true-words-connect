import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import Tab from "../../../components/Tabs/Tab";
import TabPane from "../../../components/Tabs/TabPane";
import TabsPaneContainer from "../../../components/Tabs/TabsPaneContainer";
import UserDetails from "../../../components/UserDetails";

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
              <UserDetails translator={translator} />
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
                  <Tab
                    openTab={openTab}
                    setOpenTab={setOpenTab}
                    tabNo={1}
                    text="Overview"
                  />
                  <Tab
                    openTab={openTab}
                    setOpenTab={setOpenTab}
                    tabNo={2}
                    text="Orders"
                  />

                  <Tab
                    openTab={openTab}
                    setOpenTab={setOpenTab}
                    tabNo={3}
                    text="Messages"
                  />
                  <Tab
                    openTab={openTab}
                    setOpenTab={setOpenTab}
                    tabNo={4}
                    text="Offer Request"
                  />

                  <Tab
                    openTab={openTab}
                    setOpenTab={setOpenTab}
                    tabNo={5}
                    text="Reviews"
                  />
                </ul>
                {/*========Tabs End========== */}

                {/*========Tabs Pane========== */}
                <TabsPaneContainer>
                  <TabPane openTab={openTab} tabNo={1}>
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
                  </TabPane>
                  <TabPane openTab={openTab} tabNo={2}>
                    <p>
                      Efficiently unleash cross-media information without
                      cross-media value. Quickly maximize timely deliverables
                      for real-time schemas.
                      <br />
                      <br /> Dramatically maintain clicks-and-mortar solutions
                      without functional solutions.
                    </p>
                  </TabPane>

                  <TabPane openTab={openTab} tabNo={3}>
                    <p>
                      Efficiently unleash cross-media information without
                      cross-media value. Quickly maximize timely deliverables
                      for real-time schemas.
                      <br />
                      <br /> Dramatically maintain clicks-and-mortar solutions
                      without functional solutions.
                    </p>
                  </TabPane>
                </TabsPaneContainer>

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
