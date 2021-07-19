import React from "react";
import fieldInputStyles from "./FieldInput.module.css";

const FieldInput = (props) => {
  const { fieldName, formHook, labelKey, typeKey } = props;
  return (
    <>
      <label htmlFor={fieldName} className={fieldInputStyles["input-label"]}>
        {labelKey}
      </label>
      <br />
      <input
        className={fieldInputStyles["input"]}
        id={fieldName}
        name={fieldName}
        type={typeKey}
        onChange={formHook.handleChange}
        onBlur={formHook.handleBlur}
        value={formHook.values[fieldName]}
      />
      <br />
      {formHook.touched[fieldName] && formHook.errors[fieldName] && (
        <div className={fieldInputStyles["error-message"]}>
          {formHook.errors[fieldName]}
        </div>
      )}
    </>
  );
};

export default FieldInput;
