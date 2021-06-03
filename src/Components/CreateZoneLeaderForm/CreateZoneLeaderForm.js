/*
ZONE LEADER FORM COMPONENT
Description: This component is to be used for creating
             a zone leader via a formik form. The fields
             to be included are on figma file.

     Author: Diego Alejandro Herrera Rojas
       Date: 01/06/21 
*/

import React, {useState, useEffect} from 'react';
import {useFormik} from 'formik';
import Modal from 'react-modal';
import * as Yup from 'yup';
// import blank profile picture
import blankProfile from './blankProfilePicture.png';
import zoneLeaderStyles from './CreateZoneLeaderForm.module.css';

// set up modal element
Modal.setAppElement('body');

// arrow function for generating
// an input object with its label
const FieldInput = (props) => {
    const {fieldName, formHook, labelKeys, typeKeys} = props
    return (
        <div className={zoneLeaderStyles['input-field']}>
            <div className={zoneLeaderStyles['input-label']}>
                <label htmlFor={fieldName}>{labelKeys[fieldName]}</label>
            </div>
            <input
                id={fieldName}
                name={fieldName}
                type={typeKeys[fieldName]}
                onChange={formHook.handleChange}
                onBlur={formHook.handleBlur}
                value={formHook.values[fieldName]}
            />
            { formHook.touched[fieldName] && formHook.errors[fieldName] && (
                <div className={zoneLeaderStyles['input-error-message']}>
                    {formHook.errors[fieldName]}
                </div>
            )}
        </div>
    );
}

const CreateZoneLeaderForm = (props) => {
    const {defaultInitialValues, labelKeys, typeKeys} = props;
    const valueKeys = Object.keys(defaultInitialValues);

    // Split fields according to figma
    // view design
    const leftFields = valueKeys.slice(0,Math.floor(valueKeys.length/2));
    const rightFields = valueKeys.slice(Math.floor(valueKeys.length/2));

    // Define state for showing modal
    const [showModal, setShowModal] = useState(false);
    // Define state for profile
    // picture preview input
    const [profileImageInput, setProfileImageInput] = useState(null);
    // Define state for profile
    // picture preview source
    const [profileImageSource, setProfileImageSource] = useState(blankProfile);

    // use Effect hook for 
    // generating profile image
    // source when updating
    // input
    useEffect(() => {
        if (profileImageInput) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImageSource(reader.result);
            };
            reader.readAsDataURL(profileImageInput);
        } else {
            setProfileImageSource(blankProfile);
        }
    }, [profileImageInput])

    // Get current date for validation
    const today = new Date();

    // Instantiate formik hook
    // for data management
    const formik = useFormik({
        /*set up initial values*/
        initialValues : defaultInitialValues,
        /*set up validation schema with yup*/
        validationSchema : Yup.object({
            name : Yup.string()
                .matches(/^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,10}$/, 
                    'Ingrese un nombre válido')
                .required('Campo requerido'),
            lastName : Yup.string()
                .matches(/^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,20}$/, 
                    'Ingrese un nombre válido')
                .required('Campo requerido'),
            documentId : Yup.number()
                .positive()
                .integer()
                .lessThan(9999999999, 'Ingrese número de identificación válido en Colombia')
                .moreThan(9999999, 'Ingrese número de identificación válido en Colombia')
                .required('Campo requerido'),
            address : Yup.string()
                .matches(/^[a-zA-Z]{2,4}[\s]{0,1}[a-zA-Z]{0,20}[\s]{0,1}[0-9]{0,3}[\s]{0,1}#[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}[\s]{0,1}-[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}$/,
                    'Ingrese una diercción válida')
                .required('Campo requerido'),
            leaderCode : Yup.number()
                .lessThan(999, 'Ingrese un código numérico de 3 cifras')
                .moreThan(100, 'Ingrese un código numérico de 3 cifras')
                .required('Campo requerido'),
            email : Yup.string()
                .email('Ingrese una dirección de email válida')
                .required('Campo requerido'),
            cellphone : Yup.number()
                .lessThan(9999999999, 'Ingrese un número de celular válido en Colombia')
                .moreThan(999999999, 'Ingrese un número de celular válido en Colombia')
                .required('Campo requerido'),
            zone : Yup.string()
                .matches(/^[a-zA-Z]{3,15}$/, 'Ingrese máximo 10 letras')
                .required('Campo requerido'),
            endContractDate : Yup.date()
                .min(today, 'Ingrese una fecha en el futuro')
                .required('Campo requerido')
        }),
        /*set up submit callback*/
        onSubmit : (values) => {
            const leaderData = {
                ...values,
                profileImage : profileImageSource
            }
            console.log(leaderData)
        }
    });

    // Click handler for showing
    // alert modal
    const handleClick = () => {
        // See if there are any errors
        const numErrors = Object.keys(formik.errors).length
        // see if the fields are empty
        let emptyField = false;
        for(let i = 0; i < valueKeys.length; i++){
            if(formik.values[valueKeys[i]] === ''){
                emptyField = true;
                break;
            }
        }
        setShowModal(numErrors > 0 || emptyField)
    }

    // Handler for input
    // profile image
    const handleInputProfileImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfileImageInput(file)
        }
    }

    return (
        <form onSubmit = {formik.handleSubmit}>
            <div className={zoneLeaderStyles['column-wrapper']}>
                <div className={zoneLeaderStyles['col2']}>
                    <div>
                        <div className={zoneLeaderStyles['profile-image-card']}>
                            <div className={zoneLeaderStyles['profile-image-label']}>
                                <label
                                    htmlFor='profileImage'
                                >
                                    Foto líder de zona
                                </label>
                            </div>
                            <p align='center'>
                                <img
                                    className={zoneLeaderStyles['profile-image']}
                                    src={profileImageSource} 
                                    alt='Foto líder de zona' 
                                />
                            </p>
                        </div>
                        <div className={zoneLeaderStyles['input-field']}>
                            <input 
                                id='profileImage'
                                name='profileImage'
                                type='file'
                                accept='image/*'
                                onChange={handleInputProfileImage}
                            />
                        </div>
                    </div>
                    <div className={zoneLeaderStyles['form-container']}>
                        {
                            leftFields.map((field) => {
                                    return (
                                        <FieldInput 
                                            key={field} 
                                            fieldName={field} 
                                            formHook={formik}
                                            labelKeys={labelKeys}
                                            typeKeys={typeKeys} 
                                        />
                                    );
                                }
                            )
                        }
                    </div> 
                </div>
                <div className={`${zoneLeaderStyles['col2']} ${zoneLeaderStyles['form-container']}`}>
                    {
                        rightFields.map((field) => {
                                return (
                                    <FieldInput 
                                        key={field} 
                                        fieldName={field} 
                                        formHook={formik}
                                        labelKeys={labelKeys}
                                        typeKeys={typeKeys}
                                    />
                                );
                            }
                        )
                    }
                </div>
                <div className={zoneLeaderStyles['submit-button-div']}>
                    <button 
                        type='submit' 
                        onClick={handleClick}
                        className={zoneLeaderStyles['submit-info-button']}    
                    >
                        Crear líder
                    </button>
                </div>
            </div>
            <Modal 
                isOpen={showModal}
                className={zoneLeaderStyles['Modal']}
                overlayClassName={zoneLeaderStyles['Overlay']}
            >
                <p align='center'>
                    Hay un error en algunos campos del
                    formulario. Revise las alertas.
                </p>
                <div
                    style={{textAlign : 'center'}}
                >
                    <button 
                        onClick={() => {setShowModal(false)}}
                        className={zoneLeaderStyles['modal-close-button']}
                    >
                        Cerrar
                    </button>
                </div>
            </Modal>
        </form>
    );
}

export default CreateZoneLeaderForm;