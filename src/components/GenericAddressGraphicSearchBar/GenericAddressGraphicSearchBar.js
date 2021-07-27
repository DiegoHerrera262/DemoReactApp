import React /*, { useState }*/ from "react";
import axios from "axios";
import errorImage from "../../assets/errorImage.png";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

import getAddress from "../../utils/getAddress";

import usePlacesAutocomplete /*getGeocode,*/ from /*getLatLng,*/
"use-places-autocomplete";

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  /*ComboboxOptionText,*/
} from "@reach/combobox";
import "@reach/combobox/styles.css";

/*
const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
*/

// import mapPin from "../../assets/pin.png";
const GoogleMapsToken = process.env.REACT_APP_GOOGLE_MAPS_TOKEN;
const libraries = ["places"];

const AddressInput = (props) => {
  const {
    fieldName,
    value,
    labelKey,
    setAddress,
    setCoords,
    className,
    mapPin,
    nearBy,
  } = props;

  const {
    ready,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => nearBy.latitude, lng: () => nearBy.longitude },
      radius: 10 * 1000,
    },
  });

  // const [temporaryAddress, setTemporaryAddress] = useState(value);
  //const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event) => {
    // setTemporaryAddress(event.target.value);
    setAddress(event.target.value);
    setValue(event.target.value);
  };

  /*
  const handleFocus = (event) => {
    setTemporaryAddress(value);
    setIsFocused(true);
  };
  */

  // console.log(data);

  const handleBlur = async () => {
    console.log("Recalculando localización...");
    /* Here get request to google maps api to
        set coordinates */
    try {
      const streetQuery = value.replace(" ", "+").replace("#", "%23");
      const GoogleGeocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${streetQuery}}&key=${GoogleMapsToken}`;
      const result = await axios.get(GoogleGeocodeURL);
      if (result.data.results.length > 0) {
        const pos = result.data.results[0].geometry.location;
        setCoords({
          latitude: pos.lat,
          longitude: pos.lng,
        });
      }
      // setAddress(value);
      clearSuggestions();
      // setIsFocused(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = async (option) => {
    console.log("Recalculando localización...");
    /* Here get request to google maps api to
        set coordinates */
    try {
      const streetQuery = option.replace(" ", "+").replace("#", "%23");
      const GoogleGeocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${streetQuery}}&key=${GoogleMapsToken}`;
      const result = await axios.get(GoogleGeocodeURL);
      if (result.data.results.length > 0) {
        const pos = result.data.results[0].geometry.location;
        setCoords({
          latitude: pos.lat,
          longitude: pos.lng,
        });
      }
      // setAddress(value);
      clearSuggestions();
      // setIsFocused(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (!ready) {
    return null;
  }

  return (
    <div className={className["address-search-bar"]}>
      <label htmlFor={fieldName} className={className["input-label"]}>
        {labelKey}
      </label>
      <Combobox
        aria-label={fieldName}
        onSelect={(option) => {
          handleSelect(option);
          setAddress(option);
        }}
      >
        <ComboboxInput
          autocomplete="off"
          className={className["input"]}
          id={fieldName}
          name={fieldName}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {data && status === "OK" && (
          <ComboboxPopover>
            <ComboboxList>
              {data.map(({ description }, idx) => {
                return (
                  <ComboboxOption
                    key={`match-address-${idx}`}
                    value={description}
                  >
                    <div className={className["address-search-bar"]}>
                      <img src={mapPin} alt="" width="10px" />{" "}
                      {` ${description}`}
                    </div>
                  </ComboboxOption>
                );
              })}
            </ComboboxList>
          </ComboboxPopover>
        )}
      </Combobox>
    </div>
  );

  /*
  return (
    <>
      <label htmlFor={fieldName} className={className["input-label"]}>
        {labelKey}
      </label>
      {data.map((matchAddress, idx) => (
        <ul key={`match-address-${idx}`}>{matchAddress.description}</ul>
      ))}
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
  */
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
    isLoaded,
    loadError,
  } = props;

  const changeCoords = async (event) => {
    const coords = {
      latitude: event.latLng.lat(),
      longitude: event.latLng.lng(),
    };
    setAddress(await getAddress(coords));
    setCoords(coords);
  };

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

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GoogleMapsToken,
    libraries: libraries,
  });

  if (!isLoaded) {
    return <div className={className["loading-div"]} />;
  }

  if (loadError) {
    return (
      <p align="center">
        <img src={errorImage} alt="" width="40px" height="40px" />
        <br />
        Error al cargar el mapa.
      </p>
    );
  }

  return (
    <>
      <AddressInput
        fieldName={fieldName}
        labelKey={labelKey}
        value={value}
        mapPin={mapPin}
        nearBy={markerCoords}
        setAddress={setAddress}
        setCoords={setCoords}
        className={className}
      />
      <div className={className["map-container"]}>
        <ClientMap
          isLoaded={isLoaded}
          loadError={loadError}
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
