import React from "react";
import ProfileCard from "./ProfileCard";

function SearchResult({ translators }) {
  console.log(translators);
  return (
    <div className="col-span-4 sm:col-span-3 rounded-md bg-white shadow px-8 py-8">
      {translators.map((translator) => (
        <ProfileCard key={translator.objectID} translator={translator} />
      ))}
    </div>
  );
}

export default SearchResult;
