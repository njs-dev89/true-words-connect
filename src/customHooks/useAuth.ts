import { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  onIdTokenChanged,
} from "firebase/auth";
import app, { db, functions } from "../config/firebaseConfig";
import { collection, doc, getDoc, setDoc } from "@firebase/firestore";
import { httpsCallable } from "firebase/functions";

const auth = getAuth(app);
const formatAuthUser = (user) => ({
  uid: user.uid,
  email: user.email,
  role: user.role,
  profile: user.profile,
});

export default function useAuth() {
  const addClientRole = httpsCallable(functions, "addClientRole");
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState) => {
    if (!authState) {
      setAuthUser(null);
      setLoading(false);
      return;
    }

    const token = await authState.getIdTokenResult(true);
    authState.role = token.claims.role;
    if (token.claims.role === "provider") {
      const docRef = doc(db, `/providers/${authState.uid}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        authState.profile = docSnap.data();
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }

    if (token.claims.role === "client") {
      const docRef = doc(db, `/clients/${authState.uid}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        authState.profile = docSnap.data();
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }
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
        profile_pic: "/profile-placeholder.png",
      });
      const roleMessage = await addClientRole({ uid: credential.user.uid });
      console.log(roleMessage);
      authStateChanged(credential.user);
    } catch (e) {
      console.log(e);
    }
  };

  const createProviderApplicant = async (username, email, password) => {
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
  const addProviderApplicant = async (
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

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    authUser,
    loading,
    signInUser,
    createUser,
    createProviderApplicant,
    addProviderApplicant,
    logOut,
  };
}
