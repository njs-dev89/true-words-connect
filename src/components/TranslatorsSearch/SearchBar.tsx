import { LoadScript } from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import Map from "./Map";
import Geocode from "react-geocode";
import { useRouter } from "next/router";
import { useSearch } from "../../context/searchAndFilterContext";

Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

const libraries: (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[] = ["places"];

function SearchBar({ query }) {
  const { location, setLocation } = useSearch();
  const [currentPosition, setCurrentPosition] = useState({
    lat: Number(query.lat),
    lng: Number(query.lng),
  });
  const [showModal, setShowModal] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [place, setPlace] = useState("");
  const placeRef = useRef(null);
  const onLoad = (autocomplete) => {
    console.log("autocomplete: ", autocomplete);

    setAutocomplete(autocomplete);
  };

  useEffect(() => {
    if (!!query.lng) {
      console.log(location);
      setCurrentPosition({
        lat: Number(query.lat),
        lng: Number(query.lng),
      });
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("I ran");
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {}
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      console.log(placeRef.current.value);
      setPlace(placeRef.current.value);
      setCurrentPosition({
        lat: autocomplete.getPlace().geometry.location.lat(),
        lng: autocomplete.getPlace().geometry.location.lng(),
      });
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  // useEffect(() => {
  //   Geocode.fromLatLng(currentPosition.lat, currentPosition.lng).then(
  //     (response) => {
  //       const address = response.results[0].formatted_address;
  //       setPlace(
  //         response.results[0].formatted_address.split(" ").slice(1).join(" ")
  //       );
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentPosition]);

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <div className="pt-32 flex justify-center">
        <form
          className=" flex"
          onSubmit={(e) => {
            e.preventDefault();
            setLocation({ lat: currentPosition.lat, lng: currentPosition.lng });
          }}
        >
          <div className="relative">
            <label htmlFor="location" className="hidden">
              Location
            </label>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <>
                <input
                  value={place}
                  ref={placeRef}
                  onChange={(e) => setPlace(e.target.value)}
                  type="text"
                  className="form-input rounded-full w-96 py-3"
                  placeholder="Enter Location"
                />
                {place !== "" && (
                  <span
                    className="absolute cursor-pointer right-4 top-3 bg-white"
                    onClick={() => {
                      setPlace("");
                    }}
                  >
                    x
                  </span>
                )}
              </>
            </Autocomplete>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="btn btn-rounded px-3 py-3 mx-4 bg-white"
          >
            Search on the map
          </button>
          <button className="btn btn-yellow btn-rounded">Search</button>
        </form>

        {showModal && (
          <>
            {" "}
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      Select a location
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                        x
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <Map
                    currentPosition={currentPosition}
                    setLocation={setCurrentPosition}
                  />
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        )}
      </div>
    </LoadScript>
  );
}

export default SearchBar;
