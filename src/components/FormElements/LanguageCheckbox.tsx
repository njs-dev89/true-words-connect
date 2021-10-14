import React from "react";

function LanguageCheckbox({ languages, setLanguages }) {
  return (
    <>
      <h3 className="font-bold text-lg mb-4">
        Select languages you are proficient in
      </h3>
      <div className="flex mb-8">
        <div className="flex items-center mr-16">
          <input
            type="checkbox"
            id="akan"
            name="akan"
            className=""
            value="akan"
            checked={languages.includes("akan")}
            onChange={() => {
              if (languages.includes("akan")) {
                setLanguages(
                  languages.filter((language) => language !== "akan")
                );
              } else {
                setLanguages([...languages, "akan"]);
              }
            }}
          />{" "}
          <div className="ml-4">Akan</div>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="ewe"
            name="ewe"
            className=""
            value="ewe"
            checked={languages.includes("ewe")}
            onChange={() => {
              if (languages.includes("ewe")) {
                setLanguages(
                  languages.filter((language) => language !== "ewe")
                );
              } else {
                setLanguages([...languages, "ewe"]);
              }
            }}
          />{" "}
          <div className="ml-4">Ewe</div>
        </div>
      </div>
    </>
  );
}

export default LanguageCheckbox;
