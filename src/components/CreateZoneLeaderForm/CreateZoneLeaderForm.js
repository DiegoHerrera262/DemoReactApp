import React, { useState, useEffect, useRef } from "react";

// HTTP connection to backend
import { postLeader } from "../../endpoint/zoneLeaders.methods";

// Third party imports
import { useFormik } from "formik";
import Modal from "react-modal";
import * as Yup from "yup";
// import ReactMapGL, {Marker} from 'react-map-gl';

// Form components
import FieldInput from "../FieldInput";
import SelectInput from "../SelectInput";
import FileInput from "../FileInput";
import ProfileImageInput from "../ProfileImageInput";
import LeaderZoneMap from "../LeaderZoneMap";

import blankProfile from "../ProfileImageInput/assets/blankProfilePicture.png";
// import mapPin from '../assets/pin.png'

import zoneLeaderStyles from "./CreateZoneLeaderForm.module.css";

// DO NOT DELETE THIS
Modal.setAppElement("body");

const GoogleMapsAPI = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_MAPS_TOKEN}`;
const MAX_SIZE = 5 * 1024 * 1024;

// Change map display style here
// const mapStyle = 'mapbox://styles/diegoherrera262/ckpossqqj09fy17npwfhqkadq'

const CreateZoneLeaderForm = (props) => {
  const { labelKeys, typeKeys, selectValues, zoneKeys } = props;
  let { defaultInitialValues } = props;
  const valueKeys = Object.keys(defaultInitialValues);

  // include document properties on the initial values
  defaultInitialValues = {
    ...defaultInitialValues,
    frontID: null,
    rut: null,
    bankData: null,
    contract: null,
    profileImage: null,
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
    console.log(formik.errors);
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
    const data = new FormData();
    data.append("name", formik.values["name"]);
    data.append("last_name", formik.values["lastName"]);
    data.append("documentId", formik.values["documentId"]);
    data.append("address", formik.values["address"]);
    data.append("leader_code", formik.values["leaderCode"]);
    data.append("email", formik.values["email"]);
    data.append("cellphone", formik.values["cellphone"]);
    data.append("zone_id", zoneKeys[formik.values["zone"]]);
    data.append("endContractDate", formik.values["endContractDate"]);
    data.append("contractDocument", formik.values["contract"]);
    data.append("documentPhoto", formik.values["frontID"]);
    data.append("rutDocument", formik.values["rut"]);
    data.append("profileImage", formik.values["profileImage"]);
    data.append("bankCertification", formik.values["bankData"]);

    try {
      const { message, correct } = await postLeader(data);
      console.log(formik.values);
      console.log(message);

      setServerMessage(message);
      setConfirmShowModal(false);

      // reset form and hide modal
      if (correct) {
        formik.resetForm();
        formik.values = defaultInitialValues;
        // Reset file inputs
        profileImageRef.current.value = "";
        frontIdRef.current.value = "";
        rutRef.current.value = "";
        bankDataRef.current.value = "";
        contractRef.current.value = "";

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
    <form onSubmit={formik.handleSubmit}>
      {showCreatingLeaderMessage && (
        <div
          className={serverMessageStyle}
          onClick={() => setShowCreatingLeaderMessage(false)}
        >
          {serverMessage}
        </div>
      )}
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

          <h2
            className={zoneLeaderStyles["h2"]}
            style={{ paddingLeft: "0.8ch" }}
          >
            {" "}
            Documentos{" "}
          </h2>
          {/**/}
          <h3 className={zoneLeaderStyles["h3"]} style={{ paddingLeft: "1ch" }}>
            {" "}
            Documento de identidad{" "}
          </h3>
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

          <h3 className={zoneLeaderStyles["h3"]} style={{ paddingLeft: "1ch" }}>
            {" "}
            RUT{" "}
          </h3>
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

          <h3 className={zoneLeaderStyles["h3"]} style={{ paddingLeft: "1ch" }}>
            {" "}
            Certificación bancaria{" "}
          </h3>
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

          <h3 className={zoneLeaderStyles["h3"]} style={{ paddingLeft: "1ch" }}>
            {" "}
            Contrato{" "}
          </h3>
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

export default CreateZoneLeaderForm;
