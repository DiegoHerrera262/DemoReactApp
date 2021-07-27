import React, { useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete /*getGeocode,*/ /*getLatLng,*/ from "use-places-autocomplete";

import addressStyles from "./AddressInput.module.css";

import mapPin from "../../assets/pin.png";

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  /*ComboboxOptionText,*/
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const GoogleMapsToken = process.env.REACT_APP_GOOGLE_MAPS_TOKEN;
const libraries = ["places"];
const centerCoords = [4.6836388444628625, -74.14453885228298];

const AddressField = (props) => {
  const { fieldName, formHook, labelKey } = props;
  // const [address, setAddress] = useState(formHook.values[fieldName]);

  /*
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GoogleMapsToken,
    libraries: libraries,
  });
  */

  const {
    ready,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: {
        lat: () => centerCoords[0],
        lng: () => centerCoords[1],
      },
      radius: 10 * 1000,
    },
  });

  console.log(formHook.values);
  // console.log(formHook.touched);
  console.log(formHook.errors);

  /*
  if (!isLoaded || !ready) {
    return <div className={addressStyles["loading-div"]} />;
  }
  */

  const handleChange = (event) => {
    setValue(event.target.value);
    formHook.handleChange(event);
    // setAddress(event.target.value);
    // formHook.values[fieldName] = event.target.value;
  };

  const handleBlur = (event) => {
    if (event.relatedTarget) {
      if (event.relatedTarget.attributes["data-reach-combobox-option"]) {
        alert("Clicked on possible option");
        formHook.values[fieldName] =
          event.relatedTarget.childNodes[0].childNodes[2].data;
        // console.log(event.relatedTarget.childNodes[0].childNodes[2].data);
      }
    }
    clearSuggestions();
    formHook.handleBlur(event);
    // formHook.values[fieldName] = address;
  };

  return (
    <div className={addressStyles["address-search-bar"]}>
      <label htmlFor={fieldName} className={addressStyles["input-label"]}>
        {labelKey}
      </label>
      <br />
      <Combobox
        aria-label={fieldName}
        onSelect={(option) => {
          // console.log(option);
          // setAddress(option);
          formHook.values[fieldName] = option;
        }}
      >
        <ComboboxInput
          autocomplete="off"
          id={fieldName}
          name={fieldName}
          type="text"
          onChange={handleChange}
          onBlur={handleBlur}
          value={formHook.values[fieldName]}
          className={addressStyles["input"]}
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
                    <div className={addressStyles["address-search-bar"]}>
                      <img src={mapPin} alt="" width="10px" />{" "}
                      {`${description}`}
                    </div>
                  </ComboboxOption>
                );
              })}
            </ComboboxList>
          </ComboboxPopover>
        )}
      </Combobox>
      <br />
      {formHook.touched[fieldName] && formHook.errors[fieldName] && (
        <div className={addressStyles["error-message"]}>
          {formHook.errors[fieldName]}
        </div>
      )}
    </div>
  );
};

export default AddressField;
