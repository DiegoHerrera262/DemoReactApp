import React, { useState, useEffect, useRef } from "react";

// HTTP connection to backend
import { updateLeader } from "../../endpoint/zoneLeaders.methods";

// Third party imports
import { useFormik } from "formik";
import Modal from "react-modal";
import * as Yup from "yup";
// import axios from 'axios';

// Form components
import FieldInput from "../FieldInput";
import SelectInput from "../SelectInput";
import FileInput from "../FileInput";
import ProfileImageInput from "../ProfileImageInput";
import LeaderZoneMap from "../LeaderZoneMap";

import blankProfile from "../ProfileImageInput/assets/blankProfilePicture.png";

import zoneLeaderStyles from "./UpdateZoneLeaderForm.module.css";

// DO NOT DELETE THIS
Modal.setAppElement("body");

// Change map display style here
const GoogleMapsAPI = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_MAPS_TOKEN}`;

const UpdateZoneLeaderForm = (props) => {
  const { labelKeys, typeKeys, selectValues, zoneKeys } = props;
  let { defaultInitialValues } = props;

  const valueKeys = Object.keys(defaultInitialValues);

  // include document properties on the initial values
  defaultInitialValues = {
    frontID: {},
    rut: {},
    bankData: {},
    contract: {},
    profileImage: null,
    ...defaultInitialValues,
  };

  // Split fields according to figma view design
  const leftFields = valueKeys.slice(0, Math.floor(valueKeys.length / 2));
  const rightFields = valueKeys.slice(Math.floor(valueKeys.length / 2));

  // Get current date for validation
  const today = new Date();

  // Ref for resetting profile image
  const profileImageRef = useRef();
  // Ref for resetting files
  const frontIdRef = useRef();
  const rutRef = useRef();
  const bankDataRef = useRef();
  const contractRef = useRef();

  // Define state for showing error modal
  const [showErrorModal, setErrorShowModal] = useState(false);
  // Define state for showing confirmation modal
  const [showConfirmModal, setConfirmShowModal] = useState(false);
  // Define state for profile picture preview source
  const [profileImageSource, setProfileImageSource] = useState(blankProfile);
  // Define state for map zone identification
  const [zoneMarkerCoords, setZoneMarkerCoords] = useState({
    latitude: 4.68357,
    longitude: -74.14443,
  });
  // confirmation message after submit
  const [showCreatingLeaderMessage, setShowCreatingLeaderMessage] =
    useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [serverMessageStyle, setServerMessageStyle] = useState({});

  // Instantiate formik hook
  // for data management
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
    }),
    /*set up submit callback*/
    onSubmit: (values) => {
      setConfirmShowModal(true);
    },
  });

  // use Effect hook for generating profile image
  // source when updating input
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

  // Click handler for showing
  // alert modal
  const handleErrorClick = () => {
    // See if there are any errors
    const numErrors = Object.keys(formik.errors).length;
    // see if the fields are empty
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

  /*
    HERE IS WHERE THE SUBMIT
    ACTION IT TO BE HANDLED WITH
    THE BACKEND
    */
  const handleSubmitDataFromModal = async () => {
    const postData = {
      name: formik.values["name"],
      last_name: formik.values["lastName"],
      documentId: formik.values["documentId"],
      address: formik.values["address"],
      leader_code: formik.values["leaderCode"],
      email: formik.values["email"],
      cellphone: formik.values["cellphone"],
      zone_id: zoneKeys[formik.values["zone"]],
      endContractDate: formik.values["endContractDate"],
      documentPhoto: "https://AmazonWEB.com/Some/Random/url",
      rutDocument: "https://AmazonWEB.com/Some/Random/url",
      contractDocument: "https://AmazonWEB.com/Some/Random/url",
      profileImage: "https://AmazonWEB.com/Some/Random/url",
      bankCertification: "https://AmazonWEB.com/Some/Random/url",
    };

    console.log(postData);

    try {
      const { message, correct } = await updateLeader(
        parseInt(props.leaderId),
        postData
      );
      console.log(formik.values);
      console.log(message);

      setServerMessage(message);
      setConfirmShowModal(false);

      // reset form and hide modal
      if (correct) {
        setShowCreatingLeaderMessage(true);
        return setServerMessageStyle(zoneLeaderStyles["confirm-div"]);
      }

      setShowCreatingLeaderMessage(true);
      setServerMessageStyle(zoneLeaderStyles["error-div"]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className={zoneLeaderStyles["form"]}>
      {showCreatingLeaderMessage && (
        <div className={serverMessageStyle}>{serverMessage}</div>
      )}
      <div className={zoneLeaderStyles["column-wrapper"]}>
        <div className={zoneLeaderStyles["col2"]}>
          <ProfileImageInput
            edit
            src={profileImageSource}
            parentRef={profileImageRef}
            labelKey="Foto líder de zona"
            formHook={formik}
          />
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
        </div>
        <div className={zoneLeaderStyles["col2"]}>
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

          <h2
            className={zoneLeaderStyles["h2"]}
            style={{ paddingLeft: "0.8ch" }}
          >
            {" "}
            Documentos{" "}
          </h2>

          <h3 className={zoneLeaderStyles["h3"]} style={{ paddingLeft: "1ch" }}>
            {" "}
            Documento de identidad{" "}
          </h3>
          <FileInput
            edit
            fieldName="frontID"
            formHook={formik}
            parentRef={frontIdRef}
            labelKey="Ingrese PDF"
            accept=".pdf, image/*"
          />

          <h3 className={zoneLeaderStyles["h3"]} style={{ paddingLeft: "1ch" }}>
            {" "}
            RUT{" "}
          </h3>
          <FileInput
            edit
            fieldName="rut"
            formHook={formik}
            parentRef={rutRef}
            labelKey="Ingrese PDF o Word"
            accept=".pdf, .doc, .docx"
          />

          <h3 className={zoneLeaderStyles["h3"]} style={{ paddingLeft: "1ch" }}>
            {" "}
            Certificación bancaria{" "}
          </h3>
          <FileInput
            edit
            fieldName="bankData"
            formHook={formik}
            parentRef={bankDataRef}
            labelKey="Ingrese PDF o Word"
            accept=".pdf, .doc, .docx"
          />

          <h3 className={zoneLeaderStyles["h3"]} style={{ paddingLeft: "1ch" }}>
            {" "}
            Contrato{" "}
          </h3>
          <FileInput
            edit
            fieldName="contract"
            formHook={formik}
            parentRef={contractRef}
            labelKey="Ingrese PDF o Word"
            accept=".pdf, .doc, .docx"
          />
        </div>
      </div>
      <div
        style={{
          width: "100%",
          textAlign: "center",
        }}
      >
        <button
          type="submit"
          onClick={handleErrorClick}
          className={zoneLeaderStyles["submit-button"]}
        >
          Actualizar líder
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
        <p align="center">Confirme actualización de líder</p>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleSubmitDataFromModal}
            className={zoneLeaderStyles["submit-button"]}
          >
            Confirmar
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
            Cerrar
          </button>
        </div>
      </Modal>
    </form>
  );
};

export default UpdateZoneLeaderForm;
