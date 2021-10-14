import "../styles/globals.css";
import { AuthUserProvider } from "../context/authContext";
import Layout from "../components/Layout/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <AuthUserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthUserProvider>
  );
}

export default MyApp;
