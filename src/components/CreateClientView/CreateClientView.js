import React, { useState, useEffect } from 'react';
import createClientStyles from './CreateClientView.module.css';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import Modal from 'react-modal';
import errorImage from '../assets/errorImage.png';
import confirmationImage from '../assets/confirmationImage.png'

import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import mapPin from '../assets/pin.png';
const GoogleMapsAPI = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_MAPS_TOKEN}`;

// DO NOT DELETE THIS
Modal.setAppElement('body');

const InputField = (props) => {
    const { fieldName, formHook, labelKey, fieldType } = props;
    return (
        <>
            <label
                htmlFor={fieldName}
                className={createClientStyles['input-label']}
            >
                { labelKey }
            </label>
            <br />
            <input 
                id={fieldName}
                name={fieldName}
                type={fieldType}
                onChange={formHook.handleChange}
                onBlur={formHook.handleBlur}
                value={formHook.values[fieldName]}
                className={createClientStyles['input']}
            />
            <br />
            {
                formHook.touched[fieldName] && formHook.errors[fieldName] && (
                    <div className={createClientStyles['error-message']}>
                        { formHook.errors[fieldName] }
                    </div>
                )
            }
        </>
    );
}

const SelectField = (props) => {
    const {fieldName, formHook, labelKey, optionVals} = props;
    return (
        <>
            <label 
                htmlFor={fieldName}
                className={createClientStyles['input-label']}
            >
                {labelKey}
            </label>
            <br />
            <select
                id={fieldName}
                onChange={formHook.handleChange}
                value={formHook.values[fieldName]}
                className={createClientStyles['select']}
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
            <br />
            { formHook.touched[fieldName] && formHook.errors[fieldName] && (
                <div
                    className={createClientStyles['error-message']}
                >
                    {formHook.errors[fieldName]}
                </div>
            )}
        </>
    );
}

const StoreMap = (props) => {
    const { markerCoords, setCoords } = props;
    const changeCoords = (event) => {
        setCoords({
            latitude : event.latLng.lat(),
            longitude : event.latLng.lng(),
        });
    }
    return (
        <GoogleMap
            defaultZoom={10}
            defaultCenter={{ lat: 4.637764262457622, lng: -74.14443 }}
        >
            <Marker 
                draggable 
                position={{ lat: markerCoords.latitude, lng: markerCoords.longitude }} 
                onDragEnd={changeCoords}
                icon={{
                    url : mapPin,
                    scaledSize : {
                        width : 35,
                        height : 35
                    }
                }}
            />
        </GoogleMap>
    );
}

const AddressMap = withScriptjs(withGoogleMap(StoreMap));

const assessorsAPICall = () => [
    '--Seleccione un asesor--',
    'Asesor 1',
    'Asesor 2',
    'Asesor 3'
];

const zonesAPICall = () => [
    '--Seleccione una zona--',
    'Norte',
    'Sur'
]

const CreateClientView = (props) => {
    const [ assessors, setAssessors ] = useState([]);
    const [ zones, setZones ] = useState([]);
    const [ isLoading, setIsLoading] = useState(true);
    const [ modalImage, setModalImage ] = useState(errorImage);

    const [ addressCoords, setAddressCoords ] = useState({
        latitude : 4.68357,
        longitude : -74.14443
    }); 

    const [ showCreateMessage, setShowCreateMessage ] = useState(false);
    const [ createMessage, setCreateMessage ] = useState('');;

    const [ showConfirmModal, setShowConfirmModal ] = useState(false);
    const [ showErrorModal, setShowErrorModal ] = useState(false);

    /* Here data should be fetched from the Assessors API */
    useEffect(() => {
        const fetchData = async () => {
            setAssessors(await assessorsAPICall());
            setZones(await zonesAPICall());
            setIsLoading(false);
        }
        fetchData();  
    }, []);

    /* Here Google Geolocation services should 
    be used to get store address */
    useEffect(() => {
        console.log(addressCoords);
    }, [addressCoords]);

    const defaultInitialValues = {
        name : '',
        documentType : '',
        documentId : '',
        cellphone : '',
        email : '',
        assessor : '',
        storeName: '',
        locality: '',
        neighborhood: '',
        zone: '',
        landline: '',
        storeAddress: '',
        location: ''
    }

    const formik = useFormik({
        initialValues : defaultInitialValues,
        validationSchema : Yup.object({
            name : Yup.string()
                .matches(/^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,10}$/, 
                    'Ingrese un nombre válido')
                .required('Campo requerido'),
            documentType : Yup.string()
                .matches(/^[^-]*$/, 
                    'Seleccione un tipo de documento')
                .required('Campo requerido'),
            documentId : Yup.number()
                .positive()
                .integer()
                .lessThan(9999999999, 'Ingrese número de identificación válido en Colombia')
                .moreThan(9999999, 'Ingrese número de identificación válido en Colombia')
                .required('Campo requerido'),
            cellphone : Yup.number()
                .lessThan(9999999999, 'Ingrese un número de celular válido en Colombia')
                .moreThan(999999999, 'Ingrese un número de celular válido en Colombia')
                .required('Campo requerido'),
            email : Yup.string()
                .email('Ingrese una dirección de email válida')
                .required('Campo requerido'),
            assessor : Yup.string()
                .matches(/^[^-]*$/, 
                        'Seleccione un asesor')
                .required('Campo requerido'),
            storeName : Yup.string()
                .matches(/^[a-zA-Z]{1,10}[0-9]{0,10}[\s]{0,1}[a-zA-Z]{0,10}[0-9]{0,10}$/, 
                    'Ingrese un nombre válido')
                .required('Campo requerido'),
            locality : Yup.string()
                .matches(/^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,10}$/, 
                    'Ingrese una localidad válida')
                .required('Campo requerido'),
            neighborhood : Yup.string()
                .matches(/^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,10}$/, 
                    'Ingrese un barrio válido')
                .required('Campo requerido'),
            zone : Yup.string()
                .matches(/^[a-zA-Z]{3,15}$/, 'Escoja una zona')
                .required('Campo requerido'),
            landline : Yup.number()
                .positive()
                .integer()
                .lessThan(9999999, 'Ingrese número fijo válido en Bogotá')
                .moreThan(999999, 'Ingrese número fijo válido en Bogotá')
                .required('Campo requerido'),
            storeAddress : Yup.string()
                .matches(/^[a-zA-Z]{2,4}[\s]{0,1}[a-zA-Z]{0,20}[\s]{0,1}[0-9]{0,3}[\s]{0,1}#[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}[\s]{0,1}-[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}$/,
                    'Ingrese una diercción válida')
                .required('Campo requerido'),
            location : Yup.string()
                .matches(/^[a-zA-Z]{2,4}[\s]{0,1}[a-zA-Z]{0,20}[\s]{0,1}[0-9]{0,3}[\s]{0,1}#[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}[\s]{0,1}-[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}$/,
                    'Ingrese una diercción válida')
                .required('Campo requerido')
            }),
        onSubmit : (values) => {
            setShowConfirmModal(true);
        }
    });

    const handleSubmitDataFromModal = () => {
        try {
            /* HERE CONNECTION WITH BACKEND */

            console.log(formik.values);
            setShowConfirmModal(false);
            formik.resetForm();
            formik.values = defaultInitialValues;

            setCreateMessage('Creacción exitosa.');
            setModalImage(confirmationImage);
            setShowCreateMessage(true);
        } catch (error) {
            console.log(error);
            setCreateMessage('Creacción fallida. Intente nuevamente.');
            setModalImage(errorImage);
            setShowCreateMessage(true);
        }
    }

    const handleDataValidation = () => {
        const numErrors = Object.keys(formik.errors).length;
        let emptyField = false;
        for(let i = 0; i < Object.keys(defaultInitialValues).length; i++){
            if(formik.values[Object.keys(defaultInitialValues)[i]] === ''){
                emptyField = true;
                break;
            }
        }
        const formIsNotRight =numErrors > 0 || emptyField 
        setShowErrorModal(formIsNotRight);
        setShowConfirmModal(!formIsNotRight);
    }

    return (
        <>
            {
                isLoading && (
                    <div className={createClientStyles['loading-div']} />
                )
            }
            {
                !isLoading && (
                    <div className={createClientStyles['view-container']}>
                        <h1 className={createClientStyles['page-title']}>Crear cliente</h1>
                        <form
                            onSubmit={formik.handleSubmit}
                        >
                            <div className={createClientStyles['col-wrap']}>
                                <div className={createClientStyles['col-client']}>
                                    <div className={createClientStyles['header-box']}>
                                        Información del cliente propietario
                                    </div>
                                    <InputField
                                        fieldName='name'
                                        formHook={formik}
                                        labelKey='Nombre'
                                        fieldType='text'
                                    />
                                    <SelectField
                                        fieldName='documentType'
                                        formHook={formik}
                                        labelKey='Tipo de documento'
                                        optionVals={[
                                            '--Seleccione tipo de documento--',
                                            'Cédula de ciudadanía',
                                            'Cédula de extrangería'
                                        ]}
                                    />
                                    <InputField
                                        fieldName='documentId'
                                        formHook={formik}
                                        labelKey='Documento de Identidad'
                                        fieldType='number'
                                    />
                                    <InputField
                                        fieldName='cellphone'
                                        formHook={formik}
                                        labelKey='Número Celular'
                                        fieldType='number'
                                    />
                                    <InputField
                                        fieldName='email'
                                        formHook={formik}
                                        labelKey='Email'
                                        fieldType='email'
                                    />
                                    <SelectField 
                                        fieldName='assessor'
                                        formHook={formik}
                                        labelKey='Asesor Creador'
                                        optionVals={assessors}
                                    />
                                </div>
                                <div className={createClientStyles['col-store']}>
                                    <div className={createClientStyles['header-box']}>
                                        Información de la tienda
                                    </div>
                                    <InputField
                                        fieldName='storeName'
                                        formHook={formik}
                                        labelKey='Nombre de la tienda'
                                        fieldType='text'
                                    />
                                    <InputField
                                        fieldName='locality'
                                        formHook={formik}
                                        labelKey='Localidad'
                                        fieldType='text'
                                    />
                                    <InputField 
                                        fieldName='neighborhood'
                                        formHook={formik}
                                        labelKey='Barrio'
                                        fieldType='text'
                                    />
                                    <SelectField 
                                        fieldName='zone'
                                        formHook={formik}
                                        labelKey='Zona'
                                        optionVals={zones}
                                    />
                                    <InputField
                                        fieldName='landline'
                                        formHook={formik}
                                        labelKey='Teléfono fijo'
                                        fieldType='number'
                                    />
                                    <InputField 
                                        fieldName='storeAddress'
                                        formHook={formik}
                                        labelKey='Dirección Tienda'
                                        fieldType='text'
                                    />
                                </div>
                            </div>
                            <div className={createClientStyles['header-box']}>
                                Ubicación
                            </div>
                            <InputField 
                                fieldName='location'
                                formHook={formik}
                                labelKey='Dirección'
                                fieldType='text'
                            />
                            <div className={createClientStyles['map-container']}>
                                <AddressMap
                                    googleMapURL={GoogleMapsAPI}
                                    loadingElement={<div style={{ height: `100%` }} />}
                                    containerElement={<div style={{ height: `100%` }} />}
                                    mapElement={<div style={{ height: `100%` }} />}
                                    markerCoords={addressCoords}
                                    setCoords={setAddressCoords}
                                />
                            </div>
                            <button
                                type='submit'
                                onClick={handleDataValidation}
                                className={createClientStyles['submit-button']}    
                            >
                                CREAR CLIENTE
                            </button>
                        </form>
                        <Modal 
                            isOpen={showConfirmModal}
                            onRequestClose={() => {setShowConfirmModal(false)}}
                            className={createClientStyles['Modal']}
                            overlayClassName={createClientStyles['Overlay']}
                        >
                            <p align='center'>
                                Confirme creación de cliente
                            </p>
                            <div
                                style={{textAlign : 'center'}}
                            >
                                <button
                                    onClick={handleSubmitDataFromModal}
                                    className={createClientStyles['confirm-button']}
                                >
                                    CONFIRMAR
                                </button>
                            </div>
                        </Modal>
                        <Modal 
                            isOpen={showErrorModal}
                            onRequestClose={() => {setShowErrorModal(false)}}
                            className={createClientStyles['Modal']}
                            overlayClassName={createClientStyles['Overlay']}
                        >
                            <p align='center'>
                                Hay un error en el formulario. Revise las alertas
                            </p>
                            <div
                                style={{textAlign : 'center'}}
                            >
                                <button
                                    onClick={() => setShowErrorModal(false)}
                                    className={createClientStyles['error-button']}
                                >
                                    CERRAR
                                </button>
                            </div>
                        </Modal>
                        <Modal 
                            isOpen={showCreateMessage}
                            onRequestClose={() => {setShowCreateMessage(false)}}
                            className={createClientStyles['Modal']}
                            overlayClassName={createClientStyles['Overlay']}
                        >
                            <p align='center'>
                                <img 
                                    src={modalImage}
                                    alt=''
                                    width='40px'
                                    height='40px'
                                />
                                <br />
                                {createMessage}
                            </p>
                        </Modal>
                    </div>
                )
            }
        </>
    );
} 

export default CreateClientView;