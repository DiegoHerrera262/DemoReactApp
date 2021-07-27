import * as React from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import mapPin from "../../assets/pin.png";
import errorImage from "../../assets/errorImage.png";

// const mapStyle = 'mapbox://styles/diegoherrera262/ckpossqqj09fy17npwfhqkadq'
const GoogleMapsToken = process.env.REACT_APP_GOOGLE_MAPS_TOKEN;
const libraries = ["places"];

const SuperVeciMap = (props) => {
  const { markerCoords, setCoords, mapContainerStyle, isLoaded, loadError } =
    props;

  /*
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GoogleMapsToken,
    libraries: libraries,
  });
  */

  if (!isLoaded) {
    console.log("cargando...");
    return <div />;
  }

  if (loadError) {
    console.log("Error");
    return (
      <p align="center">
        <img src={errorImage} alt="" width="40px" height="40px" />
        <br />
        Error al cargar el mapa.
      </p>
    );
  }

  const changeCoords = (event) => {
    setCoords({
      latitude: event.latLng.lat(),
      longitude: event.latLng.lng(),
    });
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={11}
      center={{ lat: 4.637764262457622, lng: -74.14443 }}
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

const Map = SuperVeciMap;

export default Map;
