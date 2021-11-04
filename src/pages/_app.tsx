import "../styles/globals.css";
import { AuthUserProvider } from "../context/authContext";
import Layout from "../components/Layout/Layout";
import { AgoraProviderWithNoSSR } from "../context/agoraContextNoSsr";

function MyApp({ Component, pageProps }) {
  return (
    <AuthUserProvider>
      <AgoraProviderWithNoSSR>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AgoraProviderWithNoSSR>
    </AuthUserProvider>
  );
}

export default MyApp;
