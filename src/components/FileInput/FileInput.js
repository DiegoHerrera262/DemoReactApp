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
        <div
            className={fileInputStyles['file-input-card']}
        >
            <div 
                className={fileInputStyles['icon-container']}
            >
                <img 
                    src={iconSrc} 
                    alt={fieldName}
                    className={fileInputStyles['file-icon']}
                />
            </div>
            <div
                className={fileInputStyles['info-container']}
            >
                <div className={fileInputStyles['file-input-label']}>
                    {labelKey}
                </div>
                <label 
                    htmlFor={fieldName}
                    className={fileInputStyles['edit-button']}
                >
                    Cargue archivo
                </label>
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
        </div>
    );
}

export default FileInput;