import React, { useCallback, useRef, useState } from "react";
import ReactTags from "react-tag-autocomplete";

function LanguageTags({ langs, setLangs }) {
  const [suggestions, setSuggestions] = useState([
    { id: 1, name: "Akan" },
    { id: 2, name: "Ewe" },
  ]);

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

  return (
    <ReactTags
      ref={reactTags}
      tags={langs}
      placeholderText="Add new Language"
      suggestions={suggestions}
      onDelete={onDelete}
      onAddition={onAddition}
    />
  );
}

export default LanguageTags;
