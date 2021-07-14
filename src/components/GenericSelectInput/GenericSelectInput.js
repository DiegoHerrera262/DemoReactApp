import React from "react";

const SelectField = (props) => {
  const { fieldName, formHook, labelKey, optionVals, className } = props;
  return (
    <>
      <label htmlFor={fieldName} className={className["input-label"]}>
        {labelKey}
      </label>
      <br />
      <select
        id={fieldName}
        onChange={formHook.handleChange}
        value={formHook.values[fieldName]}
        className={className["select"]}
      >
        {optionVals.map((optn, index) => (
          <option key={`${labelKey}${index}`} value={optn}>
            {optn}
          </option>
        ))}
      </select>
      <br />
      {formHook.touched[fieldName] && formHook.errors[fieldName] && (
        <div className={className["error-message"]}>
          {formHook.errors[fieldName]}
        </div>
      )}
    </>
  );
};

export default SelectField;
