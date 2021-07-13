import React from "react";
import selectInputStyles from "./SelectInput.module.css";

const SelectInput = (props) => {
  const { fieldName, formHook, labelKey, optionVals } = props;
  return (
    <>
      <label htmlFor={fieldName} className={selectInputStyles["input-label"]}>
        {labelKey}
      </label>
      <br />
      <select
        className={selectInputStyles["select"]}
        id={fieldName}
        onChange={formHook.handleChange}
        value={formHook.values[fieldName]}
      >
        {optionVals.map((optn, index) => (
          <option key={`${labelKey}${index}`} value={optn}>
            {optn}
          </option>
        ))}
      </select>
      <br />
      {formHook.touched[fieldName] && formHook.errors[fieldName] && (
        <div className={selectInputStyles["error-message"]}>
          {formHook.errors[fieldName]}
        </div>
      )}
    </>
  );
};

export default SelectInput;

