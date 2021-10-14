import { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import app, { db } from "../config/firebaseConfig";
import { collection, doc, setDoc } from "@firebase/firestore";

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

  const createUser = async (username, email, password) => {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const clients = collection(db, "clients");
      const userDoc = doc(clients, credential.user.uid);
      const newUser = await setDoc(userDoc, {
        email: credential.user.email,
        username,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const createTranslatorApplicant = async (username, email, password) => {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (e) {
      console.log(e);
    }
  };
  const addTranslatorApplicant = async (
    userId,
    username,
    email,
    languages,
    resumeLink,
    passportLink,
    idCardLink,
    videoLink
  ) => {
    try {
      const applicants = collection(db, "applicants");
      const userDoc = doc(applicants, userId);
      const newUser = await setDoc(userDoc, {
        email,
        username,
        languages,
        resume_link: resumeLink,
        passport_link: passportLink,
        id_card_link: idCardLink,
        video_link: videoLink,
      });
    } catch (e) {
      console.log(e);
    }
  };

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
    createTranslatorApplicant,
    addTranslatorApplicant,
    logOut,
  };
}
