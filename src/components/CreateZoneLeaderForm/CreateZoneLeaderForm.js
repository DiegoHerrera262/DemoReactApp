import React, { useState, useEffect, useRef } from "react";

import { postLeader } from "../../endpoint/zoneLeaders.methods";

import { useFormik } from "formik";
import Modal from "react-modal";
import * as Yup from "yup";

import FieldInput from "../FieldInput";
import SelectInput from "../SelectInput";
import FileInput from "../FileInput";
import ProfileImageInput from "../ProfileImageInput";
import LeaderZoneMap from "../LeaderZoneMap";

import blankProfile from "../ProfileImageInput/assets/blankProfilePicture.png";
import errorImage from "../../assets/errorImage.png";
import confirmationImage from "../../assets/confirmationImage.png";

import zoneLeaderStyles from "./CreateZoneLeaderForm.module.css";

// DO NOT DELETE THIS
Modal.setAppElement("body");

const GoogleMapsAPI = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_MAPS_TOKEN}`;
const MAX_SIZE = 7 * 1024 * 1024;

const CreateZoneLeaderForm = (props) => {
  const { labelKeys, typeKeys, selectValues, zoneKeys } = props;
  let { defaultInitialValues } = props;
  const valueKeys = Object.keys(defaultInitialValues);

  defaultInitialValues = {
    ...defaultInitialValues,
    frontID: null,
    rut: null,
    bankData: null,
    contract: null,
    profileImage: null,
  };

  const leftFields = valueKeys.slice(0, Math.floor(valueKeys.length / 2));
  const rightFields = valueKeys.slice(Math.floor(valueKeys.length / 2));

  const today = new Date();

  const profileImageRef = useRef();
  const frontIdRef = useRef();
  const rutRef = useRef();
  const bankDataRef = useRef();
  const contractRef = useRef();

  const [showErrorModal, setErrorShowModal] = useState(false);
  const [showConfirmModal, setConfirmShowModal] = useState(false);
  const [profileImageSource, setProfileImageSource] = useState(blankProfile);
  const [zoneMarkerCoords, setZoneMarkerCoords] = useState({
    latitude: 4.68357,
    longitude: -74.14443,
  });

  const [showCreatingLeaderMessage, setShowCreatingLeaderMessage] =
    useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [modalImage, setModalImage] = useState(confirmationImage);

  const formik = useFormik({
    /*set up initial values*/
    initialValues: defaultInitialValues,
    /*set up validation schema with yup*/
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(
          /^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,10}$/,
          "Ingrese un nombre válido"
        )
        .required("Campo requerido"),
      lastName: Yup.string()
        .matches(
          /^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,20}$/,
          "Ingrese un nombre válido"
        )
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
      address: Yup.string()
        .matches(
          /^[a-zA-Z]{2,4}[\s]{0,1}[a-zA-Z]{0,20}[\s]{0,1}[0-9]{0,3}[\s]{0,1}#[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}[\s]{0,1}-[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}$/,
          "Ingrese una diercción válida"
        )
        .required("Campo requerido"),
      leaderCode: Yup.number()
        .lessThan(999, "Ingrese un código numérico de 3 cifras")
        .moreThan(100, "Ingrese un código numérico de 3 cifras")
        .required("Campo requerido"),
      email: Yup.string()
        .email("Ingrese una dirección de email válida")
        .required("Campo requerido"),
      cellphone: Yup.number()
        .lessThan(9999999999, "Ingrese un número de celular válido en Colombia")
        .moreThan(999999999, "Ingrese un número de celular válido en Colombia")
        .required("Campo requerido"),
      zone: Yup.string()
        .matches(/^[a-zA-Z]{3,15}$/, "Escoja una zona")
        .required("Campo requerido"),
      endContractDate: Yup.date()
        .min(today, "Ingrese una fecha en el futuro")
        .required("Campo requerido"),
      profileImage: Yup.mixed().test(
        "fileSize",
        "Ingrese archivo de máx. 5MB",
        (value) => {
          if (value) {
            if (value.size) {
              return value.size < MAX_SIZE;
            }
          }
          return false;
        }
      ),
      frontID: Yup.mixed().test(
        "fileSize",
        "Ingrese archivo de máx. 5MB",
        (value) => {
          if (value) {
            if (value.size) {
              return value.size < MAX_SIZE;
            }
          }
          return false;
        }
      ),
      rut: Yup.mixed().test(
        "fileSize",
        "Ingrese archivo de máx. 5MB",
        (value) => {
          if (value) {
            if (value.size) {
              return value.size < MAX_SIZE;
            }
          }
          return false;
        }
      ),
      bankData: Yup.mixed().test(
        "fileSize",
        "Ingrese archivo de máx. 5MB",
        (value) => {
          if (value) {
            if (value.size) {
              return value.size < MAX_SIZE;
            }
          }
          return false;
        }
      ),
      contract: Yup.mixed().test(
        "fileSize",
        "Ingrese archivo de máx. 5MB",
        (value) => {
          if (value) {
            if (value.size) {
              return value.size < MAX_SIZE;
            }
          }
          return false;
        }
      ),
    }),
    /*set up submit callback*/
    onSubmit: (values) => {
      setConfirmShowModal(true);
    },
  });

  useEffect(() => {
    if (formik.values["profileImage"]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageSource(reader.result);
      };
      reader.readAsDataURL(formik.values["profileImage"]);
    } else {
      setProfileImageSource(blankProfile);
    }
  }, [formik]);

  const handleErrorClick = () => {
    const numErrors = Object.keys(formik.errors).length;
    let emptyField = false;
    for (let i = 0; i < valueKeys.length; i++) {
      if (formik.values[valueKeys[i]] === "") {
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
    data.append("name", formik.values["name"]);
    data.append("lastName", formik.values["lastName"]);
    data.append("documentType", formik.values["documentType"]);
    data.append("documentId", formik.values["documentId"]);
    data.append("address", formik.values["address"]);
    data.append("sellerCode", formik.values["leaderCode"]);
    data.append("email", formik.values["email"]);
    data.append("cellphone", formik.values["cellphone"]);
    data.append("zoneId", zoneKeys[formik.values["zone"]]);
    data.append("contractExpires", formik.values["endContractDate"]);
    data.append("contractImage", formik.values["contract"]);
    data.append("documentImage", formik.values["frontID"]);
    data.append("rutImage", formik.values["rut"]);
    data.append("imageUrl", formik.values["profileImage"]);
    data.append("bankCertification", formik.values["bankData"]);

    try {
      const { message, correct } = await postLeader(data);
      console.log(message);

      setServerMessage(message);
      setConfirmShowModal(false);
      setShowCreatingLeaderMessage(true);

      if (correct) {
        formik.resetForm();
        formik.values = defaultInitialValues;
        profileImageRef.current.value = "";
        frontIdRef.current.value = "";
        rutRef.current.value = "";
        bankDataRef.current.value = "";
        contractRef.current.value = "";
        setModalImage(confirmationImage);
        return;
      }

      setModalImage(errorImage);
    } catch (error) {
      console.log(error);
      setConfirmShowModal(false);
      setShowCreatingLeaderMessage(true);
      setServerMessage("Creación fallida. Intente nuevamente.");
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className={zoneLeaderStyles["col-wrap"]}>
        <div className={zoneLeaderStyles["col-left"]}>
          {/** */}
          <ProfileImageInput
            src={profileImageSource}
            parentRef={profileImageRef}
            labelKey="Foto líder de zona"
            formHook={formik}
          />
          {/**/}
          <br />
          {leftFields.map((field) => {
            if (typeKeys[field] === "select") {
              return (
                <SelectInput
                  key={field}
                  fieldName={field}
                  formHook={formik}
                  labelKey={labelKeys[field]}
                  optionVals={selectValues[field]}
                />
              );
            }
            return (
              <FieldInput
                key={field}
                fieldName={field}
                formHook={formik}
                labelKey={labelKeys[field]}
                typeKey={typeKeys[field]}
              />
            );
          })}
          {
            /**/
            <div className={zoneLeaderStyles["map-container"]}>
              <LeaderZoneMap
                googleMapURL={GoogleMapsAPI}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100%` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                markerCoords={zoneMarkerCoords}
                setCoords={setZoneMarkerCoords}
              />
            </div>
            /**/
          }
        </div>
        <div className={zoneLeaderStyles["col-right"]}>
          {rightFields.map((field) => {
            if (typeKeys[field] === "select") {
              return (
                <SelectInput
                  key={field}
                  fieldName={field}
                  formHook={formik}
                  labelKey={labelKeys[field]}
                  optionVals={selectValues[field]}
                />
              );
            }
            return (
              <FieldInput
                key={field}
                fieldName={field}
                formHook={formik}
                labelKey={labelKeys[field]}
                typeKey={typeKeys[field]}
              />
            );
          })}

          <h2 className={zoneLeaderStyles["h2"]}> Documentos </h2>
          {/**/}
          <h3 className={zoneLeaderStyles["h3"]}> Documento de identidad </h3>
          <FileInput
            fieldName="frontID"
            formHook={formik}
            parentRef={frontIdRef}
            labelKey={
              formik.values["frontID"]
                ? `${formik.values["frontID"].name}`
                : "Ingrese PDF"
            }
            accept=".pdf, image/*"
          />

          <h3 className={zoneLeaderStyles["h3"]}> RUT </h3>
          <FileInput
            fieldName="rut"
            formHook={formik}
            parentRef={rutRef}
            labelKey={
              formik.values["rut"]
                ? `${formik.values["rut"].name}`
                : "Ingrese PDF o Word"
            }
            accept=".pdf, .doc, .docx"
          />

          <h3 className={zoneLeaderStyles["h3"]}> Certificación bancaria </h3>
          <FileInput
            fieldName="bankData"
            formHook={formik}
            parentRef={bankDataRef}
            labelKey={
              formik.values["bankData"]
                ? `${formik.values["bankData"].name}`
                : "Ingrese PDF o Word"
            }
            accept=".pdf, .doc, .docx"
          />

          <h3 className={zoneLeaderStyles["h3"]}> Contrato </h3>
          <FileInput
            fieldName="contract"
            formHook={formik}
            parentRef={contractRef}
            labelKey={
              formik.values["contract"]
                ? `${formik.values["contract"].name}`
                : "Ingrese PDF o Word"
            }
            accept=".pdf, .doc, .docx"
          />
          {/**/}
        </div>
      </div>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <button
          type="submit"
          onClick={handleErrorClick}
          className={zoneLeaderStyles["submit-button"]}
        >
          CREAR LÍDER
        </button>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onRequestClose={() => {
          setConfirmShowModal(false);
        }}
        className={zoneLeaderStyles["Modal"]}
        overlayClassName={zoneLeaderStyles["Overlay"]}
      >
        <p align="center">Confirme creación de líder</p>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleSubmitDataFromModal}
            className={zoneLeaderStyles["confirm-button"]}
          >
            CONFIRMAR
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={showErrorModal}
        onRequestClose={() => setErrorShowModal(false)}
        className={zoneLeaderStyles["Modal"]}
        overlayClassName={zoneLeaderStyles["Overlay"]}
      >
        <p align="center">
          Hay un error en algunos campos del formulario. Revise las alertas.
        </p>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => {
              setErrorShowModal(false);
            }}
            className={zoneLeaderStyles["error-button"]}
          >
            CERRAR
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={showCreatingLeaderMessage}
        onRequestClose={() => {
          setShowCreatingLeaderMessage(false);
        }}
        className={zoneLeaderStyles["Modal"]}
        overlayClassName={zoneLeaderStyles["Overlay"]}
      >
        <p align="center">
          <img src={modalImage} alt="" width="40px" height="40px" />
          <br />
          {serverMessage}
        </p>
      </Modal>
    </form>
  );
};

export default CreateZoneLeaderForm;
