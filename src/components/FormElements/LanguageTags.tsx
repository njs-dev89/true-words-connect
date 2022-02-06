import { collection, getDocs, query } from "@firebase/firestore";
import { matchSorter } from "match-sorter";
import * as React from "react";
import ReactTags from "react-tag-autocomplete";
import { db } from "../../config/firebaseConfig";

function LanguageTags({ langs, setLangs, placeholder }) {
  const [suggestions, setSuggestions] = React.useState([]);

  React.useEffect(() => {
    let suggst = [];
    const q = query(collection(db, "/languages"));
    getDocs(q).then((snap) => {
      snap.forEach((langSnap) => {
        suggst.push({ id: langSnap.id, name: langSnap.data().language });
      });
      setSuggestions(suggst);
    });
  }, []);

  const reactTags = React.useRef();

  const onDelete = React.useCallback(
    (tagIndex) => {
      setLangs(langs.filter((_, i) => i !== tagIndex));
    },
    [langs]
  );

  const onAddition = React.useCallback(
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
