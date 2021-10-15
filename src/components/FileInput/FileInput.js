import React from "react";
import * as FileSaver from "file-saver";
import fileInputStyles from "./FileInput.module.css";

import emptyFileLogo from "./assets/emptyFileLogo.png";
import isPdfFile from "./assets/isPdfFile.png";
import isWordDoc from "./assets/isWordDoc.png";

const FileInput = (props) => {
  const { fieldName, formHook, labelKey, accept, parentRef, headName } = props;
  let iconSrc = emptyFileLogo;
  if (formHook.values[fieldName]) {
    iconSrc =
      formHook.values[fieldName].type === "application/pdf"
        ? isPdfFile
        : formHook.values[fieldName].type === "application/msword"
        ? isWordDoc
        : emptyFileLogo;
  }
  const formButtonStyle = props.edit
    ? fileInputStyles["edit-button-edit"]
    : fileInputStyles["edit-button"];

  const handleDownload = () => {
    FileSaver.saveAs(
      formHook.values[fieldName],
      formHook.values[fieldName].name
    );
  };
  // console.log(formHook.values);
  return (
    <div className={fileInputStyles["wrapper"]}>
      <h3 className={fileInputStyles["h3"]}>{headName}</h3>
      <div className={fileInputStyles["file-input-card"]}>
        <div className={fileInputStyles["icon-container"]}>
          <img
            src={iconSrc}
            alt={fieldName}
            className={fileInputStyles["file-icon"]}
            onClick={handleDownload}
          />
        </div>
        <div className={fileInputStyles["info-container"]}>
          <div className={fileInputStyles["file-input-label"]}>
            {labelKey.length < 19
              ? labelKey
              : `${labelKey.substring(0, 8)}...${labelKey.substring(
                  labelKey.length - 8,
                  labelKey.length
                )}`}
          </div>
          <label htmlFor={fieldName} className={formButtonStyle}>
            Cargue archivo
          </label>
          <input
            id={fieldName}
            name={fieldName}
            type="file"
            accept={accept}
            ref={parentRef}
            onChange={(event) => {
              formHook.setFieldValue(fieldName, event.currentTarget.files[0]);
            }}
            className={fileInputStyles["file"]}
          />
        </div>
      </div>
      {formHook.errors[fieldName] && (
        <div className={fileInputStyles["error-message"]}>
          {formHook.errors[fieldName]}
        </div>
      )}
    </div>
  );
};

export default FileInput;
