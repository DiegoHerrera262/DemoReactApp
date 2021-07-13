import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-modal';
import createStyles from './CreateBonusView.module.css';

import { getLevels } from '../../endpoint/clients.methods';
import { postBonus } from '../../endpoint/bonus.methods';

import errorImage from '../assets/errorImage.png';
import confirmationImage from '../assets/confirmationImage.png';

// DO NOT DELETE THIS
Modal.setAppElement('body');

const InputField = (props) => {
    const { fieldName, formHook, labelKey, fieldType, className } = props;
    return (
        <>
            <label
                htmlFor={fieldName}
                className={className['input-label']}
            >
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
                className={className['input']}
            />
            <br />
            {
                formHook.touched[fieldName] && formHook.errors[fieldName] && (
                    <div className={className['error-message']}>
                        {formHook.errors[fieldName]}
                    </div>
                )
            }
        </>
    );
}

const SelectField = (props) => {
    const { fieldName, formHook, labelKey, optionVals, className } = props;
    return (
        <>
            <label
                htmlFor={fieldName}
                className={className['input-label']}
            >
                {labelKey}
            </label>
            <br />
            <select
                id={fieldName}
                onChange={formHook.handleChange}
                value={formHook.values[fieldName]}
                className={className['select']}
            >
                {
                    optionVals.map((optn, index) => (
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
            {formHook.touched[fieldName] && formHook.errors[fieldName] && (
                <div
                    className={className['error-message']}
                >
                    {formHook.errors[fieldName]}
                </div>
            )}
        </>
    );
}

const CreateBonusView = (props) => {
    const [levelOptions, setLevelOptions] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showCreateMessage, setShowCreateMessage] = useState(false);
    const [createMessage, setCreateMessage] = useState('');
    const [modalImage, setModalImage] = useState(errorImage);

    useEffect(() => {
        const fetchLevels = async () => {
            setLevelOptions(await getLevels());
        }
        fetchLevels();
    }, [])

    const defaultInitialValues = {
        bonusName: '',
        quantity: '',
        state: '',
        bonusType: 'General para todos los usuarios',
        numOrders: '',
        bonusDiscount: 'Por porcentaje',
        discountAmount: '',
        clientLevel: ''
    }
    const formik = useFormik({
        initialValues: {
            bonusName: '',
            quantity: '',
            state: '',
            bonusType: 'Por cantidad de pedidos',
            numOrders: '',
            bonusDiscount: 'Por porcentaje',
            discountAmount: '',
            clientLevel: ''
        },
        validationSchema: Yup.object({
            bonusName: Yup.string()
                .required('Campo requerido'),
            quantity: Yup.number()
                .integer()
                .min(1, 'Ingrese una cantidad mayor que cero')
                .required('Campo requerido'),
            state: Yup.string()
                .required('Campo requerido'),
            bonusType: Yup.string()
                .required('Campo requerido'),
            numOrders: Yup.number()
                .integer()
                .min(1, 'Ingrese una cantidad mayor que cero')
                .when('bonusType', {
                    is: val => val === 'Por cantidad de pedidos',
                    then: Yup.number()
                        .integer()
                        .min(1, 'Ingrese una cantidad mayor que cero')
                        .required('Campo requerido')
                }),
            bonusDiscount: Yup.string()
                .when('bonusType', {
                    is: val => val === 'Por cantidad de pedidos',
                    then: Yup.string()
                        .required('Campo requerido')
                }),
            discountAmount: Yup.number().integer()
                .when(['bonusDiscount', 'bonusType'], {
                    is: (bonusDiscount, bonusType) =>
                        bonusType === 'Por cantidad de pedidos'
                        && bonusDiscount === 'Por porcentaje',
                    then: Yup.number()
                        .integer()
                        .min(1, 'Ingrese un porcentaje mayor a cero')
                        .max(100, 'Ingrese un porcentaje válido')
                        .required('Campo requerido')
                })
                .when(['bonusDiscount', 'bonusType'], {
                    is: (bonusDiscount, bonusType) =>
                        bonusType === 'Por cantidad de pedidos'
                        && bonusDiscount === 'Por cantidad',
                    then: Yup.number()
                        .integer()
                        .min(1, 'Ingrese una cantidad mayor a cero')
                        .required('Campo requerido')
                }),
            clientLevel: Yup.string()
                .when('bonusType', {
                    is: val => val === 'Por cantidad de pedidos',
                    then: Yup.string()
                        .required('Campo requerido')
                })
        }),
        onSubmit: (values) => { setShowConfirmModal(true) }
    });

    const handleSubmitDataFromModal = () => {
        try {
            const data = new FormData();

            if (formik.values['bonusType'] === 'Por cantidad de pedidos') {
                for (const property in formik.values) {
                    data.append(property.toString(), formik.values[property]);
                }
            }

            data.append('bonusName', formik.values['bonusName']);
            data.append('quantity', formik.values['quantity']);
            data.append('bonusType', formik.values['bonusType']);
            /* HERE CONNECTION WITH BACKEND */

            postBonus(data);
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
        for (let i = 0; i < Object.keys(defaultInitialValues).length; i++) {
            if (formik.values[Object.keys(defaultInitialValues)[i]] === '' && formik.getFieldMeta(Object.keys(defaultInitialValues)[i]).initialTouched) {
                emptyField = true;
                break;
            }
        }
        const formIsNotRight = numErrors > 0 || emptyField
        setShowErrorModal(formIsNotRight);
        setShowConfirmModal(!formIsNotRight);
    }

    return (
        <div className={createStyles['view-container']}>
            <h2>Nueva Bonificación</h2>
            <div className={createStyles['form-banner']}>
                Nueva bonificación
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className={createStyles['col-wrap']}>
                    <div className={createStyles['col2']}>

                        <InputField
                            fieldName='bonusName'
                            formHook={formik}
                            labelKey='Título bonificación'
                            fieldType='text'
                            className={createStyles}
                        />
                        <InputField
                            fieldName='quantity'
                            formHook={formik}
                            labelKey='Cantidad'
                            fieldType='number'
                            className={createStyles}
                        />
                        <SelectField
                            fieldName='state'
                            formHook={formik}
                            labelKey='Estado'
                            optionVals={[
                                'Activo',
                                'Inactivo'
                            ]}
                            className={createStyles}
                        />
                        <SelectField
                            fieldName='bonusType'
                            formHook={formik}
                            labelKey='Tipo de bono'
                            optionVals={[
                                'General para todos los usuarios',
                                'Por cantidad de pedidos'
                            ]}
                            className={createStyles}
                        />
                    </div>
                    {
                        formik.values['bonusType'] === 'Por cantidad de pedidos' && (
                            <div className={createStyles['col2']}>
                                <InputField
                                    fieldName='numOrders'
                                    formHook={formik}
                                    labelKey='Cantidad de órdenes'
                                    fieldType='number'
                                    className={createStyles}
                                />
                                <SelectField
                                    fieldName='bonusDiscount'
                                    formHook={formik}
                                    labelKey='Tipo de descuento'
                                    optionVals={[
                                        'Por porcentaje',
                                        'Por cantidad'
                                    ]}
                                    className={createStyles}
                                />
                                <InputField
                                    fieldName='discountAmount'
                                    formHook={formik}
                                    labelKey={
                                        formik.values['bonusDiscount'] === 'Por porcentaje' ?
                                            '% Descuento' :
                                            'Descuento'
                                    }
                                    fieldType='number'
                                    className={createStyles}
                                />
                                <SelectField
                                    fieldName='clientLevel'
                                    formHook={formik}
                                    labelKey='Nivel cliente'
                                    optionVals={levelOptions}
                                    className={createStyles}
                                />
                            </div>
                        )
                    }
                </div>
                <div style={{ textAlign: 'center', paddingTop: '10vh' }}>
                    <button
                        type='submit'
                        onClick={handleDataValidation}
                        className={createStyles['submit-button']}
                    >
                        CREAR
                    </button>
                </div>
            </form>
            <Modal
                isOpen={showConfirmModal}
                onRequestClose={() => { setShowConfirmModal(false) }}
                className={createStyles['Modal']}
                overlayClassName={createStyles['Overlay']}
            >
                <p align='center'>
                    Confirme creación de cliente
                </p>
                <div
                    style={{ textAlign: 'center' }}
                >
                    <button
                        onClick={handleSubmitDataFromModal}
                        className={createStyles['confirm-button']}
                    >
                        CONFIRMAR
                    </button>
                </div>
            </Modal>
            <Modal
                isOpen={showErrorModal}
                onRequestClose={() => { setShowErrorModal(false) }}
                className={createStyles['Modal']}
                overlayClassName={createStyles['Overlay']}
            >
                <p align='center'>
                    Hay un error en el formulario. Revise las alertas
                </p>
                <div
                    style={{ textAlign: 'center' }}
                >
                    <button
                        onClick={() => setShowErrorModal(false)}
                        className={createStyles['error-button']}
                    >
                        CERRAR
                    </button>
                </div>
            </Modal>
            <Modal
                isOpen={showCreateMessage}
                onRequestClose={() => { setShowCreateMessage(false) }}
                className={createStyles['Modal']}
                overlayClassName={createStyles['Overlay']}
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
    );
}

export default CreateBonusView;