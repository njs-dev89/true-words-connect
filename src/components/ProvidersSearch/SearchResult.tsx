import * as React from "react";
import ProfileCard from "./ProfileCard";

function SearchResult({ providers, currentPosition }) {
  console.log(providers);
  return (
    <div className="col-span-4 sm:col-span-3 rounded-md bg-white shadow px-8 py-8">
      {providers?.length === 0 ? (
        <p className="text-center font-medium mt-16">No provider found</p>
      ) : (
        providers.map((provider) => (
          <ProfileCard
            key={provider.objectID}
            provider={provider}
            currentPosition={currentPosition}
          />
        ))
      )}
    </div>
  );
}

export default SearchResult;
