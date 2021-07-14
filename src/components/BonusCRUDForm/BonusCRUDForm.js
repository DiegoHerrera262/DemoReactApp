import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";
// import updateStyles from "./ViewBonusUpdate.module.css";

import { getLevels } from "../../endpoint/clients.methods";
// import { putBonus, getBonusById } from "../../endpoint/bonus.methods";

import InputField from "../GenericFieldInput/GenericFieldInput";
import SelectField from "../GenericSelectInput/GenericSelectInput";

import errorImage from "../../assets/errorImage.png";
import confirmationImage from "../../assets/confirmationImage.png";

const BonusCRUDForm = (props) => {
  const { className, defaultInitialValues, create, httpMethod, httpParams } =
    props;
  const [levelOptions, setLevelOptions] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showCreateMessage, setShowCreateMessage] = useState(false);
  const [createMessage, setCreateMessage] = useState("");
  const [modalImage, setModalImage] = useState(errorImage);

  useEffect(() => {
    const fetchLevels = async () => {
      const rawLevels = await getLevels();
      setLevelOptions(["--Seleccione un nivel--", ...rawLevels]);
    };
    fetchLevels();
  }, []);

  const formik = useFormik({
    initialValues: defaultInitialValues,
    validationSchema: Yup.object({
      bonusName: Yup.string().required("Campo requerido"),
      quantity: Yup.number()
        .integer()
        .min(1, "Ingrese una cantidad mayor que cero")
        .required("Campo requerido"),
      state: Yup.string().required("Campo requerido"),
      bonusType: Yup.string().required("Campo requerido"),
      numOrders: Yup.number()
        .integer()
        .min(1, "Ingrese una cantidad mayor que cero")
        .when("bonusType", {
          is: (val) => val === "Por cantidad de pedidos",
          then: Yup.number()
            .integer()
            .min(1, "Ingrese una cantidad mayor que cero")
            .required("Campo requerido"),
        }),
      bonusDiscount: Yup.string().when("bonusType", {
        is: (val) => val === "Por cantidad de pedidos",
        then: Yup.string().required("Campo requerido"),
      }),
      discountAmount: Yup.number()
        .integer()
        .when(["bonusDiscount", "bonusType"], {
          is: (bonusDiscount, bonusType) =>
            bonusType === "Por cantidad de pedidos" &&
            bonusDiscount === "Por porcentaje",
          then: Yup.number()
            .integer()
            .min(1, "Ingrese un porcentaje mayor a cero")
            .max(100, "Ingrese un porcentaje válido")
            .required("Campo requerido"),
        })
        .when(["bonusDiscount", "bonusType"], {
          is: (bonusDiscount, bonusType) =>
            bonusType === "Por cantidad de pedidos" &&
            bonusDiscount === "Por cantidad",
          then: Yup.number()
            .integer()
            .min(1, "Ingrese una cantidad mayor a cero")
            .required("Campo requerido"),
        }),
      clientLevel: Yup.string().when("bonusType", {
        is: (val) => val === "Por cantidad de pedidos",
        then: Yup.string().matches(/[^-]/).required("Campo requerido"),
      }),
    }),
    onSubmit: (values) => {
      setShowConfirmModal(true);
    },
  });

  const handleSubmitDataFromModal = () => {
    const action = create ? "Creación " : "Actualización ";
    try {
      const data = new FormData();

      if (formik.values["bonusType"] === "Por cantidad de pedidos") {
        for (const property in formik.values) {
          data.append(property.toString(), formik.values[property]);
        }
      }

      data.append("bonusName", formik.values["bonusName"]);
      data.append("quantity", formik.values["quantity"]);
      data.append("bonusType", formik.values["bonusType"]);
      /* HERE CONNECTION WITH BACKEND */

      let httpArg = {
        data: data,
      };
      if (httpParams instanceof Object) {
        httpArg = {
          ...httpArg,
          params: httpParams,
        };
      }

      httpMethod(httpArg);
      setShowConfirmModal(false);

      if (create) {
        formik.resetForm();
        formik.values = defaultInitialValues;
      }

      setCreateMessage(action + "exitosa.");
      setModalImage(confirmationImage);
      setShowCreateMessage(true);
    } catch (error) {
      console.log(error);
      setCreateMessage(action + "fallida. Intente nuevamente.");
      setModalImage(errorImage);
      setShowCreateMessage(true);
    }
  };

  const handleDataValidation = () => {
    const numErrors = Object.keys(formik.errors).length;
    let emptyField = false;
    for (let i = 0; i < Object.keys(defaultInitialValues).length; i++) {
      if (formik.values[Object.keys(defaultInitialValues)[i]] === "") {
        emptyField = true;
        break;
      }
    }
    const formIsNotRight = numErrors > 0 || emptyField;
    setShowErrorModal(formIsNotRight);
    setShowConfirmModal(!formIsNotRight);
  };

  return (
    <div className={className["view-container"]}>
      <h2>{create ? "Nueva" : "Actualizar"} Bonificación</h2>
      <div className={className["form-banner"]}>
        {create ? "Nueva" : "Actualizar"} bonificación
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className={className["col-wrap"]}>
          <div className={className["col2"]}>
            <InputField
              fieldName="bonusName"
              formHook={formik}
              labelKey="Título bonificación"
              fieldType="text"
              className={className}
            />
            <InputField
              fieldName="quantity"
              formHook={formik}
              labelKey="Cantidad"
              fieldType="number"
              className={className}
            />
            <SelectField
              fieldName="state"
              formHook={formik}
              labelKey="Estado"
              optionVals={["Activo", "Inactivo"]}
              className={className}
            />
            <SelectField
              fieldName="bonusType"
              formHook={formik}
              labelKey="Tipo de bono"
              optionVals={[
                "General para todos los usuarios",
                "Por cantidad de pedidos",
              ]}
              className={className}
            />
          </div>
          {formik.values["bonusType"] === "Por cantidad de pedidos" && (
            <div className={className["col2"]}>
              <InputField
                fieldName="numOrders"
                formHook={formik}
                labelKey="Cantidad de órdenes"
                fieldType="number"
                className={className}
              />
              <SelectField
                fieldName="bonusDiscount"
                formHook={formik}
                labelKey="Tipo de descuento"
                optionVals={["Por porcentaje", "Por cantidad"]}
                className={className}
              />
              <InputField
                fieldName="discountAmount"
                formHook={formik}
                labelKey={
                  formik.values["bonusDiscount"] === "Por porcentaje"
                    ? "% Descuento"
                    : "Descuento"
                }
                fieldType="number"
                className={className}
              />
              <SelectField
                fieldName="clientLevel"
                formHook={formik}
                labelKey="Nivel cliente"
                optionVals={levelOptions}
                className={className}
              />
            </div>
          )}
        </div>
        <div style={{ textAlign: "center", paddingTop: "10vh" }}>
          <button
            type="submit"
            onClick={handleDataValidation}
            className={className["submit-button"]}
          >
            {create ? "CREAR BONIFICACIÓN" : "GUARDAR"}
          </button>
        </div>
      </form>
      <Modal
        isOpen={showConfirmModal}
        onRequestClose={() => {
          setShowConfirmModal(false);
        }}
        className={className["Modal"]}
        overlayClassName={className["Overlay"]}
      >
        <p align="center">
          Confirme {create ? "creación" : "actualización"} de cliente
        </p>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleSubmitDataFromModal}
            className={className["confirm-button"]}
          >
            CONFIRMAR
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={showErrorModal}
        onRequestClose={() => {
          setShowErrorModal(false);
        }}
        className={className["Modal"]}
        overlayClassName={className["Overlay"]}
      >
        <p align="center">Hay un error en el formulario. Revise las alertas</p>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => setShowErrorModal(false)}
            className={className["error-button"]}
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
        className={className["Modal"]}
        overlayClassName={className["Overlay"]}
      >
        <p align="center">
          <img src={modalImage} alt="" width="40px" height="40px" />
          <br />
          {createMessage}
        </p>
      </Modal>
    </div>
  );
};

export default BonusCRUDForm;
