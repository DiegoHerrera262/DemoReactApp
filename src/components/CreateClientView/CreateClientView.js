import React, { useState, useEffect } from 'react';
import createClientStyles from './CreateClientView.module.css';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { postClient } from '../../endpoint/clients.methods';

import Modal from 'react-modal';
import errorImage from '../assets/errorImage.png';
import confirmationImage from '../assets/confirmationImage.png'

import { GoogleMap, useLoadScript, Marker, useJsApiLoader } from '@react-google-maps/api';
import mapPin from '../assets/pin.png';
const GoogleMapsToken = process.env.REACT_APP_GOOGLE_MAPS_TOKEN;
const GoogleMapsAPI = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${GoogleMapsToken}`;

// DO NOT DELETE THIS
Modal.setAppElement('body');

// get address from coordinates
const getAddress = async (addressCoords) => {
    try {
        const { latitude, longitude } = addressCoords
        const GoogleGeocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GoogleMapsToken}`
        const result = await axios.get(GoogleGeocodeURL);
        if (result.data.results.length > 0){
            return result.data.results[0].formatted_address.toString().trim();
        }
    } catch (error) {
        console.log(error);
        return '';
    }
}

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

const AddressInput = (props) => {
    const { fieldName, value, labelKey, setAddress, setCoords } = props;
    const [ temporaryAddress, setTemporaryAddress ] = useState(value);
    const [ isFocused, setIsFocused ] = useState(false);

    const handleChange = (event) => {
        const newAddress = event.target.value.trim();
        setTemporaryAddress(newAddress);
    }

    const handleFocus = (event) => {
        setTemporaryAddress(value);
        setIsFocused(true);
    }

    const handleBlur = async () => {
        console.log('Recalculando localización...');
        /* Here get request to google maps api to
        set coordinates */
        try {
            const streetQuery = temporaryAddress.replace(' ','+')
                                    .replace('#','%23')
            const GoogleGeocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${streetQuery}}&key=${GoogleMapsToken}`;
            const result = await axios.get(GoogleGeocodeURL);
            if (result.data.results.length > 0) {
                const pos = result.data.results[0].geometry.location;
                setCoords({
                    latitude: pos.lat,
                    longitude: pos.lng
                })
            }
            setAddress(temporaryAddress);
            setIsFocused(false);
        } catch(error) {
            console.log(error);
        }
        
    }
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
                type='text'
                value={!isFocused ? value : temporaryAddress}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onChange={handleChange}
                className={createClientStyles['input']}
            />
            <br />
        </>
    );
}

const ClientMap = (props) => {
    const { mapContainerStyle, zoom, center, markerCoords, setCoords, setAddress } = props;

    const changeCoords = async (event) => {
        const coords = {
            latitude : event.latLng.lat(),
            longitude : event.latLng.lng(),
        }
        setAddress(await getAddress(coords));
        setCoords(coords);
    }

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey : GoogleMapsToken
    });

    if (loadError) {
        return (
            <p align='center'>
                <img 
                    src={errorImage}
                    alt=''
                    width='40px'
                    height='40px'
                />
                <br />
                Error al cargar el mapa.
            </p>  
        );
    }

    if (!isLoaded) {
        return (
            <div className={createClientStyles['loading-div']} />
        );
    }
    
    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={zoom}
            center={center}
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
    const [ formattedAddress, setFormattedAddress ] = useState('Cll 22i #10344');
    useEffect(() => {
        const setUpLocation = async () =>{
            const { geolocation } = navigator;
            if (geolocation) {
                geolocation.getCurrentPosition(async (position) => {
                    console.log('Ubicando navegador...');
                    setAddressCoords({
                        latitude : position.coords.latitude,
                        longitude : position.coords.longitude
                    })
                    setFormattedAddress(await getAddress({
                        latitude : position.coords.latitude,
                        longitude : position.coords.longitude
                    }))
                },
                () => {
                    console.log('Ubicación imposible.')
                });
            }
        }
        setUpLocation();
    }, []);

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
        storeAddress: ''
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
                .required('Campo requerido')
            }),
        onSubmit : (values) => {
            setShowConfirmModal(true);
        }
    });

    const handleSubmitDataFromModal = () => {
        try {
            const data = new FormData();
            data.append('name', formik.values['name']);
            data.append('grocer_name', formik.values['storeName']);
            data.append('owner_name', formik.values['name']);
            data.append('document_type', formik.values['documentType']);
            data.append('document_id', formik.values['documentId']);
            data.append('cellphone', formik.values['cellphone']);
            data.append('phone', formik.values['landline']);
            data.append('email', formik.values['email']);
            data.append('address', formik.values['storeAddress']);
            data.append('address_additional_info', formik.values['locality']);
            data.append('neighborhood', formik.values['neighborhood']);
            data.append('latitude', addressCoords.latitude);
            data.append('longitude', addressCoords.longitude);
            /* HERE CONNECTION WITH BACKEND */

            postClient(data);
            setShowConfirmModal(false);

            formik.resetForm();
            formik.values = defaultInitialValues;
            const setUpLocation = async () =>{
                const { geolocation } = navigator;
                if (geolocation) {
                    geolocation.getCurrentPosition(async (position) => {
                        console.log('Reubicando navegador...');
                        setAddressCoords({
                            latitude : position.coords.latitude,
                            longitude : position.coords.longitude
                        })
                        setFormattedAddress(await getAddress({
                            latitude : position.coords.latitude,
                            longitude : position.coords.longitude
                        }))
                    },
                    () => {
                        console.log('Reubicación imposible.')
                    });
                }
            }
            setUpLocation();

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
                            <AddressInput 
                                fieldName='location'
                                labelKey='Dirección'
                                value={formattedAddress}
                                setAddress={setFormattedAddress}
                                setCoords={setAddressCoords}
                            />
                            <div className={createClientStyles['map-container']}>
                                <ClientMap
                                    googleMapURL={GoogleMapsAPI}
                                    mapContainerStyle={{
                                        width: '100%',
                                        height: '100%'
                                    }}
                                    zoom={11}
                                    center={{ 
                                        lat: addressCoords.latitude, 
                                        lng: addressCoords.longitude 
                                    }}
                                    markerCoords={addressCoords}
                                    setCoords={setAddressCoords}
                                    setAddress={setFormattedAddress}
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