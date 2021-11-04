import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import Tab from "../../../components/Tabs/Tab";
import TabPane from "../../../components/Tabs/TabPane";
import TabsPaneContainer from "../../../components/Tabs/TabsPaneContainer";
import UserDetails from "../../../components/UserDetails";
import UserReviews from "../../../components/UserReviews";
import { useFirebaseAuth } from "../../../context/authContext";
import TranslatorOverview from "../../../components/TranslatorOverview";

function TranslatorProfilePage() {
  const { query } = useRouter();
  const { authUser } = useFirebaseAuth();
  const [loading, setLoading] = useState(true);
  const [translator, setTranslator] = useState(null);
  const [openTab, setOpenTab] = useState(1);

  useEffect(() => {
    async function loadData() {
      const docRef = doc(db, `/translators/${query.id}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const translator = docSnap.data();
        translator.id = docSnap.id;
        setTranslator(translator);
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
          <div className="col-span-4 sm:col-span-1 bg-white py-6 shadow-md rounded-xl">
            {loading ? (
              <p>loading...</p>
            ) : (
              <UserDetails translator={translator} />
            )}
          </div>
          {/*========= Left Panel End ========== */}

          {/*==========Right Panel ============= */}
          <div className="col-span-4 sm:col-span-3 rounded-xl bg-white shadow-md">
            <div className="flex flex-wrap">
              <div className="w-full px-8 pt-6">
                {/*========Tabs========== */}
                <ul
                  className="flex sm:justify-start justify-start list-none pt-3 pb-4 border-b"
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
                      <TranslatorOverview translator={translator} />
                    )}
                  </TabPane>
                  <TabPane openTab={openTab} tabNo={2}>
                    <UserReviews />
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
