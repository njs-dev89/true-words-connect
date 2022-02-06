import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import Tab from "../../../components/Tabs/Tab";
import TabPane from "../../../components/Tabs/TabPane";
import TabsPaneContainer from "../../../components/Tabs/TabsPaneContainer";
import UserDetails from "../../../components/Profile/UserDetails";
import Reviews from "../../../components/ProvidersSearch/Reviews";
import { useFirebaseAuth } from "../../../context/authContext";
import ProviderOverview from "../../../components/Profile/ProviderOverview";

function ProviderProfilePage() {
  const { query } = useRouter();
  const { authUser } = useFirebaseAuth();
  const [loading, setLoading] = React.useState(true);
  const [provider, setProvider] = React.useState(null);
  const [openTab, setOpenTab] = React.useState(1);

  React.useEffect(() => {
    async function loadData() {
      const docRef = doc(db, `/providers/${query.id}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const provider = docSnap.data();
        provider.id = docSnap.id;
        setProvider(provider);
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
    <div className="bg-light-blue pb-16 pt-32 min-h-screen">
      {!loading ? (
        <Head>
          <title>{provider.username} profile | TWC</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/langways-globe.png" />
        </Head>
      ) : (
        ""
      )}
      <div className="container">
        <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
          {/*========= Left Panel ========== */}
          <div className="col-span-4 sm:col-span-1 bg-white py-6 shadow-md rounded-xl">
            {loading ? (
              <p>loading...</p>
            ) : (
              <UserDetails provider={provider} self={false} />
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
                      <ProviderOverview provider={provider} />
                    )}
                  </TabPane>
                  <TabPane openTab={openTab} tabNo={2}>
                    <Reviews />
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

export default ProviderProfilePage;
