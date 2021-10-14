import { useEffect, useState } from "react";
import { collection, query, doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export default function useApplicants() {
  const [applicants, setApplicants] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const q = query(collection(db, "applicants"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const applicants = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data["id"] = doc.id;
        applicants.push(data);
      });
      setLoading(true);

      setApplicants(applicants);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { loading, applicants };
}
