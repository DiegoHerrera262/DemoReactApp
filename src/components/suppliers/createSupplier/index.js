import React, { useState } from "react";
import * as Yup from "yup";
import Modal from "react-modal";
import "../createSupplier/createSupplier.css";
import { useFormik } from "formik";

import { postSupplier } from "../../../endpoint/suppliers.methods";

/*
import errorImage from "../../../assets/errorImage.png";
import confirmationImage from "../../../assets/confirmationImage.png";
import FieldInput from "../../FieldInput";
*/

// DO NOT DELETE THIS
Modal.setAppElement("body");

const CreateSupplier = () => {
  /*
  const [isLoading, setIsLoading] = useState(false);
  const [modalImage, setModalImage] = useState(false);

  const [showCreateMessage, setShowCreateMessage] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  */

  const formik = useFormik({
    initialValues: {
      name: "",
      documentId: "",
      email: "",
      cellphone: "",
      phone: "",
      city: "",
      address: "",
      locality: "",
      neighborhood: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(
          /^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,10}$/,
          "Ingrese un nombre válido"
        )
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
      cellphone: Yup.number()
        .lessThan(9999999999, "Ingrese un número de celular válido en Colombia")
        .moreThan(999999999, "Ingrese un número de celular válido en Colombia")
        .required("Campo requerido"),
      phone: Yup.number()
        .positive()
        .integer()
        .lessThan(9999999, "Ingrese número fijo válido en Bogotá")
        .moreThan(999999, "Ingrese número fijo válido en Bogotá")
        .required("Campo requerido"),
      city: Yup.string()
        .matches(
          /^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,10}$/,
          "Ingrese un nombre válido"
        )
        .required("Campo requerido"),
      address: Yup.string()
        .matches(
          /^[a-zA-Z]{2,4}[\s]{0,1}[a-zA-Z]{0,20}[\s]{0,1}[0-9]{0,3}[\s]{0,1}[a-zA-Z]{0,5}[\s]{0,1}#[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}[\s]{0,1}-[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3},[\s]{0,3}[a-zA-Z]{1,10},[\s]{0,3}[a-zA-Z]{1,10}$/,
          "Ingrese una dirección en formato: dirección, ciudad, país"
        )
        .required("Campo requerido"),
      locality: Yup.string().required("Campo requerido"),
      neighborhood: Yup.string().required("Campo requerido"),
    }),
    onSubmit: (values) => {
      console.log(values);
      const data = new FormData();
      for (const key in values) {
        data.append(key, values[key]);
      }
      data.append("documentType", "Cédula de ciudadanía");
      postSupplier(data);
      // setShowConfirmModal(true);
    },
  });

  console.log(formik.errors);
  /*
  const handleSubmitDataFromModal = () => {
    console.log(formik.values);
  };
  */

  /*
  if (isLoading) {
    return <div className={"loading-div"}>Cargando...</div>;
  }
  */

  return (
    <div className="container--create--supplier">
      <h1 className="title--create--supplier">Crear proveedor</h1>
      <div className="header--create--supplier">
        <h1>Informacion general</h1>
      </div>

      <div className="container--form-suppliers">
        <form className="form--supplier" onSubmit={formik.handleSubmit}>
          {/*
          <FieldInput
            fieldName="name"
            formHook={formik}
            labelKey="*Nombre"
            typeKey="text"
          />

          <FieldInput
            fieldName="email"
            formHook={formik}
            labelKey="*Correo Electrónico"
            typeKey="email"
          />

          <FieldInput
            fieldName="cellular"
            formHook={formik}
            labelKey="*Celular"
            typeKey="number"
          />

          <FieldInput
            fieldName={"city"}
            formHook={formik}
            labelKey={"*Ciudad"}
            typeKey="text"
          />

          <FieldInput
            fieldName={"address"}
            formHook={formik}
            labelKey={"*Dirección"}
            typeKey="text"
          />
            */}

          <h2 className="title--inputs--products">*Nombre</h2>
          <input
            className="style--inputs--products"
            name="name"
            type="text"
            onChange={formik.handleChange}
          />

          <h2 className="title--inputs--products">*Identificación</h2>
          <input
            className="style--inputs--products"
            name="documentId"
            type="number"
            onChange={formik.handleChange}
          />

          <h2 className="title--inputs--products">*Correo electronico</h2>
          <input
            className="style--inputs--products"
            name="email"
            type="text"
            onChange={formik.handleChange}
          />

          <h2 className="title--inputs--products">*Celular</h2>
          <input
            className="style--inputs--products"
            name="cellphone"
            type="text"
            onChange={formik.handleChange}
          />

          <h2 className="title--inputs--products">*Teléfono fijo</h2>
          <input
            className="style--inputs--products"
            name="phone"
            type="text"
            onChange={formik.handleChange}
          />

          <h2 className="title--inputs--products">*Ciudad</h2>
          <input
            className="style--inputs--products"
            name="city"
            type="text"
            onChange={formik.handleChange}
          />

          <h2 className="title--inputs--products">*Direccion</h2>
          <input
            className="style--inputs--products"
            name="address"
            type="text"
            onChange={formik.handleChange}
          />

          <h2 className="title--inputs--products">*Localidad</h2>
          <input
            className="style--inputs--products"
            name="locality"
            type="text"
            onChange={formik.handleChange}
          />

          <h2 className="title--inputs--products">*Barrio</h2>
          <input
            className="style--inputs--products"
            name="neighborhood"
            type="text"
            onChange={formik.handleChange}
          />

          <br />

          <button className="button--supplier" type="submit">
            {" "}
            CREAR PROVEEDOR
          </button>

          {/*
          <Modal
            isOpen={showConfirmModal}
            onRequestClose={() => {
              setShowConfirmModal(false);
            }}
            className={"Modal"}
            overlayClassName={"Overlay"}
          >
            <p align="center">Confirme creación de asesor</p>
            <div style={{ textAlign: "center" }}>
              <button
                onClick={handleSubmitDataFromModal}
                className={"confirm-button"}
              >
                CONFIRMAR
              </button>
            </div>
          </Modal>
          <Modal
            isOpen={showErrorModal}
            onRequestClose={() => setShowErrorModal(false)}
            className={"Modal"}
            overlayClassName={"Overlay"}
          >
            <p align="center">
              Hay un error en algunos campos del formulario. Revise las alertas.
            </p>
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => {
                  setShowErrorModal(false);
                }}
                className={"error-button"}
              >
                CERRAR
              </button>
            </div>
          </Modal>
          <Modal
            isOpen={showCreateMessage}
            onRequestClose={() => {
              setShowCreateMessage(false);
            }}
            className={"Modal"}
            overlayClassName={"Overlay"}
          >
            <p align="center">
              <img src={modalImage} alt="" width="40px" height="40px" />
              <br />
              {serverMessage}
            </p>
          </Modal>
        */}
        </form>
      </div>
    </div>
  );
};

export default CreateSupplier;
