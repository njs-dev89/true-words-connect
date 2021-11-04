import React, { useEffect, useState } from "react";

function LanguageProficiency({ langs, setLanguages, languages }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const tranformedLangs = langs.map((lang) => {
      return { language: lang.name, proficiency: "native" };
    });
    setLanguages(tranformedLangs);
  }, []);
  useEffect(() => {
    if (languages.length > 0 && loading === true) {
      setLoading(false);
    }
  }, [languages, loading]);

  {
    if (loading) {
      return <p>Loading...</p>;
    } else {
      return (
        <div>
          <h3 className="font-bold text-lg mb-4">
            Select your proficiency in each Language
          </h3>
          {langs.map((lang) => (
            <div key={lang.id} className="flex items-center gap-8 mb-2">
              <label
                htmlFor={lang.name}
                className="block text-sm font-medium text-gray-700 mb-2 mr-2"
              >
                {lang.name}
              </label>
              <select
                name={lang.name}
                className="form-input border-gray-200 h-10 rounded text-sm flex-grow"
                value={
                  languages.find((language) => language.language === lang.name)
                    .proficiency
                }
                onChange={(e) => {
                  setLanguages((prevLanguages) => {
                    const filtLanguages = prevLanguages.filter(
                      (language) => language.language !== lang.name
                    );
                    const newLanguages = [
                      ...filtLanguages,
                      { language: lang.name, proficiency: e.target.value },
                    ];
                    console.log(newLanguages);
                    return newLanguages;
                  });
                }}
              >
                <option value="professional">Professional</option>
                <option value="fluent">Fluent</option>
                <option value="native">Native</option>
              </select>
            </div>
          ))}
        </div>
      );
    }
  }
}

export default LanguageProficiency;
