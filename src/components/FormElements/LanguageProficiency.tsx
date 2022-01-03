import React, { useEffect, useState } from "react";

function LanguageProficiency({ langs, setLanguages, languages }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const tranformedLangs = langs.map((lang) => {
      if (languages.length > 0) {
        const langDoc = languages.find(
          (language) => language.language === lang.name
        );
        if (langDoc) return langDoc;
        else return { language: lang.name, proficiency: "native" };
      } else {
        return { language: lang.name, proficiency: "native" };
      }
    });
    setLanguages(tranformedLangs);
  }, [langs]);
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
          {languages.map((lang) => (
            <div key={lang.id} className="flex items-center gap-8 mb-2">
              <label
                htmlFor={lang.language}
                className="block text-sm font-medium text-gray-700 mb-2 mr-2"
              >
                {lang.language}
              </label>
              <select
                name={lang.language}
                className="form-input border-gray-200 h-10 rounded text-sm flex-grow"
                value={lang.proficiency}
                onChange={(e) => {
                  setLanguages((prevLanguages) => {
                    const filtLanguages = prevLanguages.filter(
                      (language) => language.language !== lang.language
                    );
                    const newLanguages = [
                      ...filtLanguages,
                      { language: lang.language, proficiency: e.target.value },
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
