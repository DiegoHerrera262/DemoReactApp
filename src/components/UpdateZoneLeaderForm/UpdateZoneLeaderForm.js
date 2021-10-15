import React, { useState, useEffect, useRef } from "react";

import { putLeader } from "../../endpoint/zoneLeaders.methods";
import { putSeller } from "../../endpoint/sellers.methods";

import { useFormik } from "formik";
import Modal from "react-modal";
import * as Yup from "yup";

import FieldInput from "../FieldInput";
import AddressInput from "../AddressInput";
import SelectInput from "../SelectInput";
import FileInput from "../FileInput";
import ProfileImageInput from "../ProfileImageInput";
import LeaderZoneMap from "../LeaderZoneMap";

import blankProfile from "../ProfileImageInput/assets/blankProfilePicture.png";
import errorImage from "../../assets/errorImage.png";
import confirmationImage from "../../assets/confirmationImage.png";

import zoneLeaderStyles from "./UpdateZoneLeaderForm.module.css";
import { useLoadScript } from "@react-google-maps/api";

// DO NOT DELETE THIS
Modal.setAppElement("body");

const GoogleMapsToken = process.env.REACT_APP_GOOGLE_MAPS_TOKEN;
const libraries = ["places"];
// const GoogleMapsAPI = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_MAPS_TOKEN}`;
const MAX_SIZE = 7 * 1024 * 1024;

const UpdateZoneLeaderForm = (props) => {
  const { labelKeys, typeKeys, selectValues, zoneKeys, leadersKeys, leaderId } =
    props;
  let { defaultInitialValues } = props;
  const valueKeys = Object.keys(typeKeys);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GoogleMapsToken,
    libraries: libraries,
  });

  /*
  defaultInitialValues = {
    ...defaultInitialValues,
    superCode: "",
    frontID: null,
    rut: null,
    bankData: null,
    contract: null,
    profileImage: null,
  };
  */

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
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    /*set up initial values*/
    initialValues: defaultInitialValues,
    /*set up validation schema with yup*/
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñ\s]{0,40}$/, "Ingrese un nombre válido")
        .required("Campo requerido"),
      lastName: Yup.string()
        .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñ\s]{1,50}$/, "Ingrese un nombre válido")
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
          /^[0-9a-zA-ZÁÉÍÓÚáéíóúñ,.#\s-]{0,40}$/,
          "Ingrese caracteres válidos en español, máx. 40."
        )
        .required("Campo requerido"),
      leaderCode: Yup.string()
        .matches(
          /^[A-Z]{3,4}[0-9]{3}$/,
          "Ingrese tres o cuatro mayúsculas seguidas de tres dígitos"
        )
        .required("Campo requerido"),
      email: Yup.string()
        .email("Ingrese una dirección de email válida")
        .required("Campo requerido"),
      cellphone: Yup.number()
        .lessThan(9999999999, "Ingrese un número de celular válido en Colombia")
        .moreThan(999999999, "Ingrese un número de celular válido en Colombia")
        .required("Campo requerido"),
      zone: Yup.string()
        .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñ\s]{3,15}$/, "Escoja una zona")
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
      isLeader: Yup.boolean().required(),
      superCode: Yup.string().when("isLeader", {
        is: (isLeader) => isLeader === false,
        then: Yup.string()
          .matches(
            /^[A-Z]{3,4}[0-9]{3} - [A-Za-z]{0,10}[\s]{0,1}[A-Za-z]{0,10}$/,
            "Seleccione un líder de zona"
          )
          .required("Campo requerido"),
      }),
    }),
    /*set up submit callback*/
    onSubmit: (values) => {
      setConfirmShowModal(true);
    },
  });

  // console.log(formik.values);
  // console.log(formik.errors);

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
    const redundancyMap = {
      name: "name",
      lastName: "lastName",
      documentType: "documentType",
      documentId: "documentId",
      address: "address",
      leaderCode: "sellerCode",
      superCode: "superCode",
      email: "email",
      cellphone: "cellphone",
      endContractDate: "contractExpires",
      contract: "contractImage",
      frontID: "documentImage",
      rut: "rutImage",
      isLeader: "isLeader",
      profileImage: "imageUrl",
      bankData: "bankCertification",
    };
    for (const key in formik.touched) {
      if (
        formik.initialValues[key] !== formik.values[key] &&
        key !== "zone" &&
        key !== "superCode"
      ) {
        console.log(redundancyMap[key]);
        data.append(redundancyMap[key], formik.values[key]);
      }
    }
    // console.log(formik.touched);
    /*
    data.append("name", formik.values["name"]);
    data.append("lastName", formik.values["lastName"]);
    data.append("documentType", formik.values["documentType"]);
    data.append("documentId", formik.values["documentId"]);
    data.append("address", formik.values["address"]);
    data.append("sellerCode", formik.values["leaderCode"]);
    */
    if (!formik.values["isLeader"]) {
      for (const key in leadersKeys) {
        if (leadersKeys[key] === formik.values["superCode"]) {
          data.append("leaderId", key);
        }
      }
    }
    for (const key in zoneKeys) {
      if (zoneKeys[key] === formik.values["zone"]) {
        data.append("zoneId", key);
      }
    }
    /*
    data.append("contractExpires", formik.values["endContractDate"]);
    data.append("contractImage", formik.values["contract"]);
    data.append("documentImage", formik.values["frontID"]);
    data.append("rutImage", formik.values["rut"]);
    data.append("imageUrl", formik.values["profileImage"]);
    data.append("bankCertification", formik.values["bankData"]);
    */
    setConfirmShowModal(false);
    setIsLoading(true);

    try {
      let message = "";
      let correct = false;

      if (formik.values["isLeader"]) {
        const res = await putLeader({ sellerData: data, id: leaderId });
        message = res.message;
        correct = res.correct;
      }
      if (!formik.values["isLeader"]) {
        const res = await putSeller({ sellerData: data, id: leaderId });
        message = res.message;
        correct = res.correct;
      }
      // let { message, correct } = await postLeader(data);

      console.log(message);
      setServerMessage(message);

      if (correct) {
        /*
        formik.resetForm();
        formik.values = defaultInitialValues;
        */
        setIsLoading(false);
        /*
        profileImageRef.current.value = "";
        frontIdRef.current.value = "";
        rutRef.current.value = "";
        bankDataRef.current.value = "";
        contractRef.current.value = "";
      */
        setModalImage(confirmationImage);
        setShowCreatingLeaderMessage(true);
        return;
      }

      setModalImage(errorImage);
    } catch (error) {
      console.log(error);
      setModalImage(errorImage);
      setServerMessage("Creación fallida. Intente nuevamente.");
    }

    setIsLoading(false);
    setShowCreatingLeaderMessage(true);
  };

  if (isLoading || !isLoaded) {
    return <div className={zoneLeaderStyles["loading-div"]} />;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className={zoneLeaderStyles["col-wrap"]}>
        <div className={zoneLeaderStyles["col-left"]}>
          {/** */}
          <ProfileImageInput
            src={profileImageSource}
            parentRef={profileImageRef}
            labelKey="Foto asesor"
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
            if (typeKeys[field] === "address") {
              return (
                <AddressInput
                  key={field}
                  fieldName={field}
                  formHook={formik}
                  labelKey={labelKeys[field]}
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
                isLoaded={isLoaded}
                loadError={loadError}
                mapContainerStyle={{ height: `100%` }}
                markerCoords={zoneMarkerCoords}
                setCoords={setZoneMarkerCoords}
              />
            </div>
            /**/
          }
        </div>
        <div className={zoneLeaderStyles["col-right"]}>
          {!formik.values["isLeader"] && (
            <SelectInput
              key={"superCode"}
              fieldName={"superCode"}
              formHook={formik}
              labelKey={"Líder asociado"}
              optionVals={[
                "--Seleccione un líder de zona--",
                ...Object.values(leadersKeys),
              ]}
            />
          )}
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
            if (typeKeys[field] === "address") {
              return (
                <AddressInput
                  key={field}
                  fieldName={field}
                  formHook={formik}
                  labelKey={labelKeys[field]}
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

          <FileInput
            fieldName="frontID"
            formHook={formik}
            parentRef={frontIdRef}
            labelKey={
              formik.values["frontID"]
                ? `${formik.values["frontID"].name}`
                : "Ingrese PDF"
            }
            headName="Documento de identidad"
            accept=".pdf"
          />

          <FileInput
            fieldName="rut"
            formHook={formik}
            parentRef={rutRef}
            labelKey={
              formik.values["rut"]
                ? `${formik.values["rut"].name}`
                : "Ingrese PDF"
            }
            headName="RUT"
            accept=".pdf"
          />

          <FileInput
            fieldName="bankData"
            formHook={formik}
            parentRef={bankDataRef}
            labelKey={
              formik.values["bankData"]
                ? `${formik.values["bankData"].name}`
                : "Ingrese PDF"
            }
            headName="Certificación bancaria"
            accept=".pdf"
          />

          <FileInput
            fieldName="contract"
            formHook={formik}
            parentRef={contractRef}
            labelKey={
              formik.values["contract"]
                ? `${formik.values["contract"].name}`
                : "Ingrese PDF"
            }
            headName="Contrato"
            accept=".pdf"
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
          GUARDAR
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
        <p align="center">Confirme actualización de asesor</p>
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

export default UpdateZoneLeaderForm;
