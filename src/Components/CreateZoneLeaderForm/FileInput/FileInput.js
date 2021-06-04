import React from 'react';
import fileInputStyles from './FileInput.module.css';

import emptyFileLogo from './assets/emptyFileLogo.png';
import isPdfFile from './assets/isPdfFile.png';
import isWordDoc from './assets/isWordDoc.png';

const FileInput = (props) => {
    const {fieldName, formHook, labelKey, accept, parentRef} = props;
    let iconSrc = emptyFileLogo;
    if (formHook.values[fieldName] !== undefined){
        iconSrc = formHook.values[fieldName].type === 'application/pdf' ? 
            isPdfFile : formHook.values[fieldName].type === 'application/msword' ?
            isWordDoc : emptyFileLogo;
    }   
    return (
        <div className={fileInputStyles['input-field']}>
            <p align='center'>
                <img 
                    src={iconSrc} 
                    alt={fieldName} 
                    className={fileInputStyles['doc-thumbnail']}
                />
            </p>
            <p align='center'>
                <label 
                    htmlFor={fieldName}
                    className={fileInputStyles['input-label']}
                >
                    {labelKey}
                </label>
            </p>
            <input 
                id={fieldName}
                name={fieldName}
                type='file'
                accept={accept}
                ref={parentRef}
                onChange={(event) => {
                    formHook.setFieldValue(
                        fieldName,
                        event.currentTarget.files[0]
                    )
                }}
            />
        </div>
    );
}

export default FileInput;