import "../styles/globals.css";
import { AuthUserProvider } from "../context/authContext";

function MyApp({ Component, pageProps }) {
  return (
    <AuthUserProvider>
      <Component {...pageProps} />
    </AuthUserProvider>
  );
}

export default MyApp;
