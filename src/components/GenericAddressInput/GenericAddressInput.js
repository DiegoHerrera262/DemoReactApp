import React from "react";
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete /*getGeocode,*/ /*getLatLng,*/ from "use-places-autocomplete";

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
  const { fieldName, formHook, labelKey, fieldType, className, mapPin } = props;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GoogleMapsToken,
    libraries: libraries,
  });
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

  if (!isLoaded) {
    return <div className={className["loading-div"]} />;
  }

  const handleChange = (event) => {
    formHook.handleChange(event);
    setValue(event.target.value);
  };

  const handleBlur = (event) => {
    formHook.handleBlur(event);
    clearSuggestions();
  };

  return (
    <div className={className["address-search-bar"]}>
      <label htmlFor={fieldName} className={className["input-label"]}>
        {labelKey}
      </label>
      <br />
      <Combobox
        aria-label={fieldName}
        onSelect={(option) => {
          formHook.values[fieldName] = option;
        }}
      >
        <ComboboxInput
          autocomplete="off"
          id={fieldName}
          name={fieldName}
          type={fieldType}
          onChange={handleChange}
          onBlur={handleBlur}
          value={formHook.values[fieldName]}
          className={className["input"]}
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
      <br />
      {formHook.touched[fieldName] && formHook.errors[fieldName] && (
        <div className={className["error-message"]}>
          {formHook.errors[fieldName]}
        </div>
      )}
    </div>
  );
};

export default AddressField;
