import React, { useEffect, useState } from "react";
import MultiRangeSlider from "../FormElements/MultiRangeSlider";
import SingleRangeSlider from "../FormElements/SingleRangeSlider";
import { useSearch } from "../../context/searchAndFilterContext";
import LanguageTags from "../FormElements/LanguageTags";

function FilterSidebar({ query }) {
  const {
    language,
    distance,
    hourlyPrice,
    avgRating,
    setLanguage,
    setAvgRating,
    setDistance,
    setHourlyPrice,
  } = useSearch();

  useEffect(() => {
    if (query.language) {
      const langArray = query.language.split(",").map((lang, idx) => {
        return { id: idx + 1, name: lang };
      });
      setLanguage(langArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="col-span-4 sm:col-span-1">
      <div className="shadow bg-white p-4 rounded-md">
        <div className="mt-8 mb-4">
          <h3 className="font-bold text-sm mb-2">Filter by Language skills</h3>
          <LanguageTags
            langs={language ? language : []}
            setLangs={setLanguage}
          />

          {/* <div className="flex flex-row-reverse items-center ">
            <input
              type="radio"
              name="language"
              checked={language === "akan"}
              value="akan"
              onChange={(e) => {
                setLanguage(e.target.value);
              }}
              className="h-4 w-4 text-gray-600 appearance-none"
            />
            <label className="flex justify-between items-center flex-grow">
              Akan
            </label>
          </div>
          <div className="flex flex-row-reverse items-center">
            <input
              type="radio"
              name="language"
              checked={language === "ewe"}
              value="ewe"
              onChange={(e) => {
                setLanguage(e.target.value);
              }}
              className="h-4 w-4 text-gray-600"
            />
            <label className="flex justify-between items-center mt-3 flex-grow">
              Ewe
            </label>
          </div> */}
        </div>
        <h3 className="font-bold text-sm mb-2">Filter by hourly rate</h3>
        <MultiRangeSlider
          min={0}
          max={500}
          minValue={hourlyPrice.minPrice}
          maxValue={hourlyPrice.maxPrice}
          onChange={({ min, max }: { min: number; max: number }) => {
            console.log(min);
            setHourlyPrice({ minPrice: min, maxPrice: max });
          }}
        />
        <h3 className="font-bold text-sm mb-4 mt-4">Filter by distance</h3>
        {/* <MultiRangeSlider
          min={0}
          max={50}
          minValue={Number(query.min_distance)}
          maxValue={Number(query.max_distance)}
          onChange={({ min, max }: { min: number; max: number }) => {
            setDistance({ min, max });
          }}
        /> */}
        <SingleRangeSlider
          min={0}
          max={100}
          value={distance}
          onChange={(value) => {
            setDistance(value);
          }}
        />
        <div className="">
          <h3 className="font-bold text-sm mb-2 mt-4">Filter by avg. rating</h3>
          <div className="flex flex-row-reverse items-center ">
            <input
              type="radio"
              name="rating"
              value={5}
              checked={avgRating === 5}
              onChange={(e) => {
                setAvgRating(Number(e.target.value));
              }}
              className="h-4 w-4 text-gray-600 appearance-none"
            />
            <label className="flex justify-between items-center flex-grow">
              5 Star
            </label>
          </div>
          <div className="flex flex-row-reverse items-center">
            <input
              type="radio"
              name="rating"
              value={4}
              checked={avgRating === 4}
              onChange={(e) => {
                setAvgRating(Number(e.target.value));
              }}
              className="h-4 w-4 text-gray-600"
            />
            <label className="flex justify-between items-center mt-3 flex-grow">
              4 Star
            </label>
          </div>

          <div className="flex flex-row-reverse items-center">
            <input
              type="radio"
              name="rating"
              value={3}
              checked={avgRating === 3}
              onChange={(e) => {
                setAvgRating(Number(e.target.value));
              }}
              className="h-4 w-4 text-gray-600"
            />
            <label className="flex justify-between items-center mt-3 flex-grow">
              3 Star
            </label>
          </div>

          <div className="flex flex-row-reverse items-center">
            <input
              type="radio"
              name="rating"
              value={2}
              checked={avgRating === 2}
              onChange={(e) => {
                setAvgRating(Number(e.target.value));
              }}
              className="h-4 w-4 text-gray-600"
            />
            <label className="flex justify-between items-center mt-3 flex-grow">
              2 Star
            </label>
          </div>

          <div className="flex flex-row-reverse items-center">
            <input
              type="radio"
              name="rating"
              value={1}
              checked={avgRating === 1}
              onChange={(e) => {
                setAvgRating(Number(e.target.value));
              }}
              className="h-4 w-4 text-gray-600"
            />
            <label className="flex justify-between items-center mt-3 flex-grow">
              1 Star
            </label>
          </div>

          <div className="flex flex-row-reverse items-center">
            <input
              type="radio"
              name="rating"
              value={0}
              checked={avgRating === 0}
              onChange={(e) => {
                setAvgRating(Number(e.target.value));
              }}
              className="h-4 w-4 text-gray-600"
            />
            <label className="flex justify-between items-center mt-3 flex-grow">
              Not rated yet
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterSidebar;
