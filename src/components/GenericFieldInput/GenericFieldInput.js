import React from "react";

const InputField = (props) => {
  const { fieldName, formHook, labelKey, fieldType, className } = props;
  return (
    <>
      <label htmlFor={fieldName} className={className["input-label"]}>
        {labelKey}
      </label>
      <br />
      <input
        id={fieldName}
        name={fieldName}
        type={fieldType}
        onChange={formHook.handleChange}
        onBlur={formHook.handleBlur}
        value={formHook.values[fieldName]}
        className={className["input"]}
      />
      <br />
      {formHook.touched[fieldName] && formHook.errors[fieldName] && (
        <div className={className["error-message"]}>
          {formHook.errors[fieldName]}
        </div>
      )}
    </>
  );
};

export default InputField;
