import { LoadScript } from "@react-google-maps/api";
import * as React from "react";
import { Autocomplete } from "@react-google-maps/api";
import Map from "./Map";
import Geocode from "react-geocode";
import { useSearch } from "../../context/searchAndFilterContext";
import ModalContainer from "../ModalContainer";
import { FaMapMarkerAlt } from "react-icons/fa";

Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

const libraries: (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[] = ["places"];

function SearchBar({ query, currentPosition, setCurrentPosition }) {
  const { location, setLocation } = useSearch();

  const [showModal, setShowModal] = React.useState(false);
  const [autocomplete, setAutocomplete] = React.useState(null);
  const [place, setPlace] = React.useState("");
  const placeRef = React.useRef(null);
  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      setPlace(placeRef.current.value);
      setCurrentPosition({
        lat: autocomplete.getPlace().geometry.location.lat(),
        lng: autocomplete.getPlace().geometry.location.lng(),
      });
    } else {
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <div className="pt-32 flex justify-center">
        <form
          className="flex flex-col sm:flex-row"
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
                  className="rounded-full w-96 py-3 border-2 border-gray-300"
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
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="btn-rounded px-6 py-3 border-2 border-gray-300 mx-4 bg-white"
            >
              <span className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-600" />
                Location Search
              </span>
            </button>
            <button className="btn btn-yellow btn-rounded">Search</button>
          </div>
        </form>

        {showModal && (
          <ModalContainer title="Select location" setShowModal={setShowModal}>
            {/*body*/}
            <Map
              currentPosition={currentPosition}
              setLocation={setCurrentPosition}
            />
          </ModalContainer>
        )}
      </div>
    </LoadScript>
  );
}

export default SearchBar;
