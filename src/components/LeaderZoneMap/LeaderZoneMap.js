import * as React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import mapPin from "../../assets/pin.png";

// const mapStyle = 'mapbox://styles/diegoherrera262/ckpossqqj09fy17npwfhqkadq'

const SuperVeciMap = (props) => {
  const { markerCoords, setCoords } = props;
  const changeCoords = (event) => {
    setCoords({
      latitude: event.latLng.lat(),
      longitude: event.latLng.lng(),
    });
  };
  return (
    <GoogleMap
      defaultZoom={11}
      defaultCenter={{ lat: 4.637764262457622, lng: -74.14443 }}
    >
      <Marker
        draggable
        position={{ lat: markerCoords.latitude, lng: markerCoords.longitude }}
        onDragEnd={changeCoords}
        icon={{
          url: mapPin,
          scaledSize: {
            width: 35,
            height: 35,
          },
        }}
      />
    </GoogleMap>
  );
};

const Map = withScriptjs(withGoogleMap(SuperVeciMap));

export default Map;
