/*
IMPUT FIELD COMPONENT
Description: This component is to be used for creating
             an input component, with its corresponding
             label and handle data submition with
             formik. 
             
             The formik object of the form
             is to be passed as a prop

     Author: Diego Alejandro Herrera Rojas
       Date: 01/06/21 
*/

import React from 'react';
import fieldInputStyles from './FieldInput.module.css';

const FieldInput = (props) => {
    const {fieldName, formHook, labelKey, typeKey} = props;
    return (
        <>
            <label 
                htmlFor={fieldName}
                className={fieldInputStyles['input-label']}
            >
                {labelKey}
            </label>
            <br />
            <input
                id={fieldName}
                name={fieldName}
                type={typeKey}
                onChange={formHook.handleChange}
                onBlur={formHook.handleBlur}
                value={formHook.values[fieldName]}
            />
            <br />
            { formHook.touched[fieldName] && formHook.errors[fieldName] && (
                <div 
                    className={fieldInputStyles['error-message']}
                >
                    {formHook.errors[fieldName]}
                </div>
            )}
        </>
    );
}

export default FieldInput;