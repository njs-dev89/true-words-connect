import { doc, getDoc } from "@firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import EditUser from "../../components/EditUser";
import Tab from "../../components/Tabs/Tab";
import TabPane from "../../components/Tabs/TabPane";
import TabsPaneContainer from "../../components/Tabs/TabsPaneContainer";
import UserDetails from "../../components/UserDetails";
import { db } from "../../config/firebaseConfig";
import { useFirebaseAuth } from "../../context/authContext";

function ProfilePage() {
  const [openTab, setOpenTab] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { authUser, loading } = useFirebaseAuth();
  const [userLoading, setUserLoading] = useState(true);
  const [translator, setTranslator] = useState(null);
  const router = useRouter();

  async function loadData(userId) {
    const docRef = doc(db, `/translators/${userId}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setTranslator(docSnap.data());
      setUserLoading(false);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }
  useEffect(() => {
    if (!loading && !authUser) router.push("/login");
  }, [authUser, loading, router]);

  useEffect(() => {
    if (!loading && authUser) {
      loadData(authUser.uid);
    }
  }, [loading, authUser]);
  if (loading || userLoading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="bg-blue-50 pb-16 pt-32 min-h-screen">
      <div className="container">
        {showModal && (
          <EditUser setShowModal={setShowModal} translator={translator} />
        )}
        <div className="grid grid-cols-4 gap-4">
          {/*========= Left Panel ========== */}
          <div className="col-span-1 bg-white py-6 shadow-md rounded-xl">
            {userLoading ? (
              <p>loading...</p>
            ) : (
              <>
                <div className="flex justify-end mr-4 mb-8 text-blue-600">
                  <button onClick={() => setShowModal(true)}>Edit</button>
                </div>
                <UserDetails translator={translator} />
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
                  className="flex justify-between mb-0 list-none flex-wrap pt-3 pb-4 pl-4"
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
                        <div className="mb-4">
                          <h3 className="text-blue-600 font-bold text-xl">
                            Hourly Price
                          </h3>
                          <p className="">
                            {translator.hourly_rate
                              ? `$${translator.hourly_rate}`
                              : "Rate Not set yet"}
                          </p>
                        </div>
                        <div className="">
                          <h3 className="text-blue-600 font-bold text-xl">
                            About
                          </h3>
                          <p className="p-4 mt-4 pb-8 border rounded">
                            {translator.about
                              ? translator.about
                              : "Please add something about yourself to show here"}
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
                    )}{" "}
                  </TabPane>
                  <TabPane openTab={openTab} tabNo={2}>
                    <p>
                      Completely synergize resource taxing relationships via
                      premier niche markets. Professionally cultivate one-to-one
                      customer service with robust ideas.
                      <br />
                      <br />
                      Dynamically innovate resource-leveling customer service
                      for state of the art customer service.
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

export default ProfilePage;
