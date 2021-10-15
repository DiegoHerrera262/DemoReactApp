import React, { useState } from "react";

import { useFormik } from "formik";
import Modal from "react-modal";
import * as Yup from "yup";

import FieldInput from "../FieldInput";
import AddressInput from "../AddressInput";
import SelectInput from "../SelectInput";

import errorImage from "../../assets/errorImage.png";
import confirmationImage from "../../assets/confirmationImage.png";

import supplierStyles from "./SuppliersCRUDForm.module.css";
import { useLoadScript } from "@react-google-maps/api";

// DO NOT DELETE THIS
Modal.setAppElement("body");

const GoogleMapsToken = process.env.REACT_APP_GOOGLE_MAPS_TOKEN;
const libraries = ["places"];

const SuppliersCRUDForm = (props) => {
  const { defaultInitialValues, httpMethod, httpParams, create } = props;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GoogleMapsToken,
    libraries: libraries,
  });

  if (loadError) {
    console.log(loadError);
  }

  const [showErrorModal, setErrorShowModal] = useState(false);
  const [showConfirmModal, setConfirmShowModal] = useState(false);

  const [showManagingSupplierMessage, setShowManagingSupplierMessage] =
    useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [modalImage, setModalImage] = useState(confirmationImage);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    /*set up initial values*/
    initialValues: defaultInitialValues,
    /*set up validation schema with yup*/
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñ\s]{0,40}$/, "Ingrese un nombre válido")
        .required("Campo requerido"),
      documentType: Yup.string()
        .matches(/^[^-]*$/, "Seleccione un tipo de documento")
        .required("Campo requerido"),
      documentId: Yup.number()
        .positive()
        .integer()
        .lessThan(
          9999999999,
          "Ingrese número de identificación válido en Colombia"
        )
        .moreThan(
          9999999,
          "Ingrese número de identificación válido en Colombia"
        )
        .required("Campo requerido"),
      email: Yup.string()
        .email("Ingrese una dirección de email válida")
        .required("Campo requerido"),
      phone: Yup.number()
        .positive()
        .integer()
        .lessThan(9999999, "Ingrese número fijo válido en Bogotá")
        .moreThan(999999, "Ingrese número fijo válido en Bogotá")
        .required("Campo requerido"),
      cellphone: Yup.number()
        .lessThan(9999999999, "Ingrese un número de celular válido en Colombia")
        .moreThan(999999999, "Ingrese un número de celular válido en Colombia")
        .required("Campo requerido"),
      address: Yup.string()
        .matches(
          /^[0-9a-zA-ZÁÉÍÓÚáéíóúñ,.#\s-]{0,100}$/,
          "Ingrese caracteres válidos en español, máx. 100."
        )
        .required("Campo requerido"),
      addressAdditionalInfo: Yup.string(),
      city: Yup.string()
        .matches(
          /^[a-zA-ZÁÉÍÓÚáéíóúñ\s]{3,25}$/,
          "Utilice caracteres válidos en español, máx. 30"
        )
        .required("Campo requerido"),
      locality: Yup.string()
        .matches(
          /^[a-zA-ZÁÉÍÓÚáéíóúñ\s]{2,40}$/,
          "Utilice caracteres válidos en español, máx. 30"
        )
        .required("Campo requerido"),
      neighborhood: Yup.string()
        .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñ\s]{2,40}$/, "Ingrese un barrio válido")
        .required("Campo requerido"),
      status: Yup.string().matches(/^[^-]*$/, "Seleccione un estado válido"),
    }),
    /*set up submit callback*/
    onSubmit: (values) => {
      setConfirmShowModal(true);
    },
  });

  const handleErrorClick = () => {
    const numErrors = Object.keys(formik.errors).length;
    let emptyField = false;
    for (const key in formik.values) {
      if (formik.values[key] === "") {
        emptyField = true;
        break;
      }
    }
    const formIsNotRight = numErrors > 0 || emptyField;
    setErrorShowModal(formIsNotRight);
    setConfirmShowModal(!formIsNotRight);
  };

  const handleSubmitDataFromModal = async () => {
    const data = new FormData();
    for (const key in formik.values) {
      if (key === "status" && !create) {
        data.append(key, formik.values[key] === "Activo" ? 0 : 1);
      }
      if (key !== "status") {
        data.append(key, formik.values[key]);
      }
    }

    /*******
     * IMPORTANT TO REMOVE THIS ONCE
     * SIIGO IS ON FOOT
     * *** */

    data.append("siigoId", Math.floor(Math.random() * 100000));

    setConfirmShowModal(false);
    setIsLoading(true);

    try {
      const { message, correct } = await httpMethod({
        data: data,
        params: httpParams,
      });

      console.log(message);
      setServerMessage(message);

      if (correct) {
        if (create) {
          formik.resetForm();
          formik.values = defaultInitialValues;
        }
        setIsLoading(false);
        setModalImage(confirmationImage);
        setShowManagingSupplierMessage(true);
        return;
      }

      setModalImage(errorImage);
    } catch (error) {
      console.log(error);
      setModalImage(errorImage);
      setServerMessage("Creación fallida. Intente nuevamente.");
    }

    setIsLoading(false);
    setShowManagingSupplierMessage(true);
  };

  if (isLoading || !isLoaded) {
    return <div className={supplierStyles["loading-div"]} />;
  }

  return (
    <div className={supplierStyles["view-container"]}>
      <h1 className={supplierStyles["page-title"]}>
        {create ? "Crear proveedor" : "Actualizar proveedor"}
      </h1>
      <form onSubmit={formik.handleSubmit}>
        <div className={supplierStyles["col-wrap"]}>
          <div className={supplierStyles["col-left"]}>
            <div className={supplierStyles["header-box"]}>
              <h1>Información general</h1>
            </div>
            <FieldInput
              key={"name"}
              fieldName={"name"}
              formHook={formik}
              labelKey={"Nombre"}
              typeKey="text"
            />
            <SelectInput
              key={"documentType"}
              fieldName={"documentType"}
              formHook={formik}
              labelKey={"Tipo de documento"}
              optionVals={[
                "--Seleccione tipo de documento--",
                "Cédula de ciudadanía",
                "Cédula de extrangería",
                "NIT",
              ]}
            />
            <FieldInput
              key={"documentId"}
              fieldName={"documentId"}
              formHook={formik}
              labelKey={"Identificación"}
              typeKey="number"
            />
            <FieldInput
              fieldName="email"
              formHook={formik}
              labelKey="Email"
              typeKey="email"
            />
            <FieldInput
              fieldName="cellphone"
              formHook={formik}
              labelKey="Número Celular"
              typeKey="number"
            />
            <FieldInput
              fieldName="phone"
              formHook={formik}
              labelKey="Teléfono fijo"
              typeKey="number"
            />
            {!create && (
              <SelectInput
                fieldName="status"
                formHook={formik}
                labelKey="Estado proveedor"
                optionVals={["--Seleccione un estado--", "Activo", "Inactivo"]}
              />
            )}
          </div>
          <div className={supplierStyles["col-right"]}>
            <div className={supplierStyles["header-box"]}>
              <h1>Información geográfica</h1>
            </div>
            <FieldInput
              key={"city"}
              fieldName={"city"}
              formHook={formik}
              labelKey={"Ciudad"}
              typeKey="text"
            />
            <FieldInput
              key={"locality"}
              fieldName={"locality"}
              formHook={formik}
              labelKey={"Localidad"}
              typeKey="text"
            />
            <AddressInput
              key={"address"}
              fieldName={"address"}
              formHook={formik}
              labelKey={"Dirección"}
            />
            <FieldInput
              key={"neighborhood"}
              fieldName={"neighborhood"}
              formHook={formik}
              labelKey={"Barrio"}
              typeKey="text"
            />
            <FieldInput
              key={"addressAdditionalInfo"}
              fieldName={"addressAdditionalInfo"}
              formHook={formik}
              labelKey={"Información adicional"}
              typeKey="text"
            />
          </div>
        </div>
        <br />
        <br />
        <div
          style={{
            textAlign: "center",
          }}
        >
          <button
            type="submit"
            onClick={handleErrorClick}
            className={supplierStyles["submit-button"]}
          >
            CREAR ASESOR
          </button>
        </div>

        <Modal
          isOpen={showConfirmModal}
          onRequestClose={() => {
            setConfirmShowModal(false);
          }}
          className={supplierStyles["Modal"]}
          overlayClassName={supplierStyles["Overlay"]}
        >
          <p align="center">
            {create
              ? "Confirme creación de proveedor"
              : "Confirme actualización proveedor"}
          </p>
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleSubmitDataFromModal}
              className={supplierStyles["confirm-button"]}
            >
              CONFIRMAR
            </button>
          </div>
        </Modal>
        <Modal
          isOpen={showErrorModal}
          onRequestClose={() => setErrorShowModal(false)}
          className={supplierStyles["Modal"]}
          overlayClassName={supplierStyles["Overlay"]}
        >
          <p align="center">
            Hay un error en algunos campos del formulario. Revise las alertas.
          </p>
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => {
                setErrorShowModal(false);
              }}
              className={supplierStyles["error-button"]}
            >
              CERRAR
            </button>
          </div>
        </Modal>
        <Modal
          isOpen={showManagingSupplierMessage}
          onRequestClose={() => {
            setShowManagingSupplierMessage(false);
          }}
          className={supplierStyles["Modal"]}
          overlayClassName={supplierStyles["Overlay"]}
        >
          <p align="center">
            <img src={modalImage} alt="" width="40px" height="40px" />
            <br />
            {serverMessage}
          </p>
        </Modal>
      </form>
    </div>
  );
};

export default SuppliersCRUDForm;
