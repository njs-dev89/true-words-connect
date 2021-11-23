import "../styles/globals.css";
import { AuthUserProvider } from "../context/authContext";
import Layout from "../components/Layout/Layout";
import { AgoraProviderWithNoSSR } from "../context/agoraContextNoSsr";
import React, { useEffect } from "react";
import AgoraLoginWrapper from "../components/AgoraLoginWrapper";

function MyApp({ Component, pageProps }) {
  return (
    <AuthUserProvider>
      <AgoraProviderWithNoSSR>
        <AgoraLoginWrapper>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AgoraLoginWrapper>
      </AgoraProviderWithNoSSR>
    </AuthUserProvider>
  );
}

export default MyApp;
