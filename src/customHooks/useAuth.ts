import { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import app from "../config/firebaseConfig";

const auth = getAuth(app);
const formatAuthUser = (user) => ({
  uid: user.uid,
  email: user.email,
});

export default function useAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState) => {
    if (!authState) {
      setAuthUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    var formattedUser = formatAuthUser(authState);
    setAuthUser(formattedUser);
    setLoading(false);
  };

  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const signInUser = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const createUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const logOut = () => signOut(auth).then(clear);

  // listen for Firebase state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signInUser,
    createUser,
    logOut,
  };
}
