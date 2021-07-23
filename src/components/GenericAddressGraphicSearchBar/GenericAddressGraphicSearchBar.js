import React, { useState } from "react";
import axios from "axios";
import errorImage from "../../assets/errorImage.png";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

import getAddress from "../../utils/getAddress";

// import mapPin from "../../assets/pin.png";
const GoogleMapsToken = process.env.REACT_APP_GOOGLE_MAPS_TOKEN;

const AddressInput = (props) => {
  const { fieldName, value, labelKey, setAddress, setCoords, className } =
    props;
  const [temporaryAddress, setTemporaryAddress] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event) => {
    const newAddress = event.target.value; /*.trim()*/
    setTemporaryAddress(newAddress);
  };

  const handleFocus = (event) => {
    setTemporaryAddress(value);
    setIsFocused(true);
  };

  const handleBlur = async () => {
    console.log("Recalculando localización...");
    /* Here get request to google maps api to
        set coordinates */
    try {
      const streetQuery = temporaryAddress
        .replace(" ", "+")
        .replace("#", "%23");
      const GoogleGeocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${streetQuery}}&key=${GoogleMapsToken}`;
      const result = await axios.get(GoogleGeocodeURL);
      if (result.data.results.length > 0) {
        const pos = result.data.results[0].geometry.location;
        setCoords({
          latitude: pos.lat,
          longitude: pos.lng,
        });
      }
      setAddress(temporaryAddress);
      setIsFocused(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <label htmlFor={fieldName} className={className["input-label"]}>
        {labelKey}
      </label>
      <br />
      <input
        id={fieldName}
        name={fieldName}
        type="text"
        value={!isFocused ? value : temporaryAddress}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={handleChange}
        className={className["input"]}
      />
      <br />
    </>
  );
};

const ClientMap = (props) => {
  const {
    mapContainerStyle,
    zoom,
    center,
    markerCoords,
    setCoords,
    setAddress,
    className,
    mapPin,
  } = props;

  const changeCoords = async (event) => {
    const coords = {
      latitude: event.latLng.lat(),
      longitude: event.latLng.lng(),
    };
    setAddress(await getAddress(coords));
    setCoords(coords);
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GoogleMapsToken,
  });

  if (loadError) {
    return (
      <p align="center">
        <img src={errorImage} alt="" width="40px" height="40px" />
        <br />
        Error al cargar el mapa.
      </p>
    );
  }

  if (!isLoaded) {
    return <div className={className["loading-div"]} />;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={zoom}
      center={center}
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

const AddressGraphicSearchBar = (props) => {
  const {
    fieldName,
    value,
    labelKey,
    setAddress,
    setCoords,
    className,
    mapContainerStyle,
    zoom,
    center,
    markerCoords,
    mapPin,
  } = props;

  return (
    <>
      <AddressInput
        fieldName={fieldName}
        labelKey={labelKey}
        value={value}
        setAddress={setAddress}
        setCoords={setCoords}
        className={className}
      />
      <div className={className["map-container"]}>
        <ClientMap
          mapContainerStyle={mapContainerStyle}
          zoom={zoom}
          center={center}
          markerCoords={markerCoords}
          setCoords={setCoords}
          setAddress={setAddress}
          className={className}
          mapPin={mapPin}
        />
      </div>
    </>
  );
};

export default AddressGraphicSearchBar;
