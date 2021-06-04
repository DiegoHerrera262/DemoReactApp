import React from 'react';
import selectInputStyles from './SelectInput.module.css';

const SelectInput = (props) => {
    const {fieldName, formHook, labelKey, optionVals} = props;
    return (
        <div className={selectInputStyles['input-field']}>
            <label 
                htmlFor={fieldName}
                className={selectInputStyles['input-label']}
            >
                {labelKey}
            </label>
            <select
                id={fieldName}
                onChange={formHook.handleChange}
                value={formHook.values[fieldName]}
            >
                {
                    optionVals.map((optn,index) => (
                        <option
                            key={`${labelKey}${index}`}
                            value={optn}
                        >
                            {optn}
                        </option>
                    ))
                }
            </select>
            { formHook.touched[fieldName] && formHook.errors[fieldName] && (
                <div className={selectInputStyles['input-error-message']}>
                    {formHook.errors[fieldName]}
                </div>
            )}
        </div>
    );
}

export default SelectInput;