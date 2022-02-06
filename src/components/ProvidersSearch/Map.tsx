import * as React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

function Map({ currentPosition, setLocation }) {
  const onMarkerDragEnd = (e) => {
    setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  return (
    <GoogleMap
      center={currentPosition}
      zoom={8}
      // mapContainerClassName="w-96 h-96"
      mapContainerStyle={{ width: "700px", height: "500px" }}
    >
      <Marker
        draggable={true}
        onDragEnd={onMarkerDragEnd}
        position={currentPosition}
      />
    </GoogleMap>
  );
}

export default Map;
