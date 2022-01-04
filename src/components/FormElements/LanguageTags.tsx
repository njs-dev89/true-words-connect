import { collection, getDocs, query } from "@firebase/firestore";
import { matchSorter } from "match-sorter";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactTags from "react-tag-autocomplete";
import { db } from "../../config/firebaseConfig";

function LanguageTags({ langs, setLangs, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);

  // { id: 1, name: "Akan" },
  // { id: 2, name: "Ewe" },
  // { id: 3, name: "Baatonum" },
  // { id: 4, name: "Bambara" },
  // { id: 5, name: "Chichewa" },
  // { id: 6, name: "Chokwe" },
  // { id: 7, name: "Ekegusii" },
  // { id: 8, name: "Igbo" },
  // { id: 9, name: "Kituba" },
  // { id: 10, name: "Maninkakan" },

  useEffect(() => {
    let suggst = [];
    const q = query(collection(db, "/languages"));
    getDocs(q).then((snap) => {
      snap.forEach((langSnap) => {
        suggst.push({ id: langSnap.id, name: langSnap.data().language });
      });
      setSuggestions(suggst);
    });
  }, []);

  const reactTags = useRef();

  const onDelete = useCallback(
    (tagIndex) => {
      setLangs(langs.filter((_, i) => i !== tagIndex));
    },
    [langs]
  );

  const onAddition = useCallback(
    (newLang) => {
      setLangs([...langs, newLang]);
    },
    [langs]
  );

  function suggestionsFilter(query, suggestions) {
    return matchSorter(suggestions, query, { keys: ["name"] });
  }

  return (
    <ReactTags
      ref={reactTags}
      tags={langs}
      placeholderText={placeholder}
      suggestions={suggestions}
      suggestionsTransform={suggestionsFilter}
      onDelete={onDelete}
      onAddition={onAddition}
    />
  );
}

export default LanguageTags;
