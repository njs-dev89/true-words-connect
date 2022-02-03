import "../styles/globals.css";
import { AuthUserProvider } from "../context/authContext";
import Layout from "../components/Layout/Layout";
import { AgoraProviderWithNoSSR } from "../context/agoraContextNoSsr";
import React, { useEffect } from "react";
import AgoraLoginWrapper from "../components/AgoraLoginWrapper";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (window !== undefined) {
      (function () {
        window["sib"] = { equeue: [], client_key: "9q9jvw4lk579mqued8fb1bug" };
        /* OPTIONAL: email to identify request*/
        // window.sib.email_id = 'example@domain.com';
        /* OPTIONAL: to hide the chat on your script uncomment this line (0 = chat hidden; 1 = display chat) */
        // window.sib.display_chat = 0;
        // window.sib.display_logo = 0;
        /* OPTIONAL: to overwrite the default welcome message uncomment this line*/
        // window.sib.custom_welcome_message = 'Hello, how can we help you?';
        /* OPTIONAL: to overwrite the default offline message uncomment this line*/
        // window.sib.custom_offline_message = 'We are currently offline. In order to answer you, please indicate your email in your messages.';
        window["sendinblue"] = {};
        for (
          var j = ["track", "identify", "trackLink", "page"], i = 0;
          i < j.length;
          i++
        ) {
          (function (k) {
            window["sendinblue"][k] = function () {
              var arg = Array.prototype.slice.call(arguments);
              (
                window["sib"][k] ||
                function () {
                  var t = {};
                  t[k] = arg;
                  window["sib"].equeue.push(t);
                }
              )(arg[0], arg[1], arg[2]);
            };
          })(j[i]);
        }
        var n = document.createElement("script"),
          x = document.getElementsByTagName("script")[0];
        (n.type = "text/javascript"),
          (n.id = "sendinblue-js"),
          (n.async = !0),
          (n.src =
            "https://sibautomation.com/sa.js?key=" + window["sib"].client_key),
          x.parentNode.insertBefore(n, x),
          window["sendinblue"].page();
      })();
    }
  }, []);

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
