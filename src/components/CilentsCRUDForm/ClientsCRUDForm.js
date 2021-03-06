import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Modal from "react-modal";

import InputField from "../GenericFieldInput/GenericFieldInput";
import SelectField from "../GenericSelectInput/GenericSelectInput";
import AddressGraphicSearchBar from "../GenericAddressGraphicSearchBar/GenericAddressGraphicSearchBar";

import getAddress from "../../utils/getAddress";
// import { getZones, getAssessors } from "../../endpoint/clients.methods";

import errorImage from "../../assets/errorImage.png";
import confirmationImage from "../../assets/confirmationImage.png";

import mapPin from "../../assets/pin.png";
const GoogleMapsToken = process.env.REACT_APP_GOOGLE_MAPS_TOKEN;

// DO NOT DELETE
Modal.setAppElement("body");

const ClientForm = (props) => {
  const {
    clientId,
    rawAssessors,
    rawZones,
    defaultInitialValues,
    httpMethod,
    httpParams,
    className,
    create,
  } = props;
  const [assessors, setAssessors] = useState([]);
  const [zones, setZones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalImage, setModalImage] = useState(errorImage);

  const [addressCoords, setAddressCoords] = useState({
    latitude: 4.68357,
    longitude: -74.14443,
  });

  const [formattedAddress, setFormattedAddress] = useState("Cll 22i #10344");

  const [showUpdateMessage, setShowUpdateMessage] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [assessorKeys, setAssessorKeys] = useState({});
  const [zoneKeys, setZoneKeys] = useState({});

  /* Here data should be fetched from the Assessors API */
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (create) {
          const { geolocation } = navigator;
          if (geolocation) {
            geolocation.getCurrentPosition(
              async (position) => {
                console.log("Ubicando navegador...");
                setAddressCoords({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
                setFormattedAddress(
                  await getAddress({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  })
                );
              },
              () => {
                console.log("Ubicaci??n imposible.");
              }
            );
          }
          // const rawAssessors = await getAssessors();
          // const rawZones = await getZones();
          const assessorNames = Object.values(rawAssessors);
          const zoneNames = Object.values(rawZones);
          setAssessors(["--Seleccione un asesor--", ...assessorNames]);
          setZones(["--Seleccione una zona--", ...zoneNames]);
          setAssessorKeys(rawAssessors);
          setZoneKeys(rawZones);
          setIsLoading(false);
          return;
        }
        if (!create) {
          const streetQuery = defaultInitialValues["storeAddress"]
            .replace(" ", "+")
            .replace("#", "%23");
          const GoogleGeocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${streetQuery}}&key=${GoogleMapsToken}`;
          const result = await axios.get(GoogleGeocodeURL);
          if (result.data.results.length > 0) {
            const pos = result.data.results[0].geometry.location;
            setAddressCoords({
              latitude: pos.lat,
              longitude: pos.lng,
            });
          }
          setFormattedAddress(defaultInitialValues.storeAddress);
          // const rawAssessors = await getAssessors();
          // const rawZones = await getZones();
          const assessorNames = Object.values(rawAssessors);
          const zoneNames = Object.values(rawZones);
          setAssessors(["--Seleccione un asesor--", ...assessorNames]);
          setZones(["--Seleccione una zona--", ...zoneNames]);
          setAssessorKeys(rawAssessors);
          setZoneKeys(rawZones);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [
    create,
    clientId,
    defaultInitialValues,
    rawAssessors,
    rawZones,
    setIsLoading,
  ]);

  const formik = useFormik({
    initialValues: {
      name: defaultInitialValues["name"],
      documentType: defaultInitialValues["documentType"],
      documentId: defaultInitialValues["documentId"],
      cellphone: defaultInitialValues["cellphone"],
      email: defaultInitialValues["email"],
      assessor: defaultInitialValues["assessor"],
      storeName: defaultInitialValues["storeName"],
      locality: defaultInitialValues["locality"],
      neighborhood: defaultInitialValues["neighborhood"],
      zone: defaultInitialValues["zone"],
      status: defaultInitialValues["status"],
      landline: defaultInitialValues["landline"],
      additionalInfo: defaultInitialValues["additionalInfo"],
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(
          /^[a-zA-Z??????????????????????\s]{0,40}$/,
          /*/^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,10}$/,*/
          "Ingrese un nombre v??lido"
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
          "Ingrese n??mero de identificaci??n v??lido en Colombia"
        )
        .moreThan(
          9999999,
          "Ingrese n??mero de identificaci??n v??lido en Colombia"
        )
        .required("Campo requerido"),
      cellphone: Yup.number()
        .lessThan(9999999999, "Ingrese un n??mero de celular v??lido en Colombia")
        .moreThan(999999999, "Ingrese un n??mero de celular v??lido en Colombia")
        .required("Campo requerido"),
      email: Yup.string()
        .email("Ingrese una direcci??n de email v??lida")
        .required("Campo requerido"),
      assessor: Yup.string()
        .matches(
          /^[A-Z]{3,4}[0-9]{3} - [a-zA-Z??????????????????????\s]{2,40}$/,
          "Seleccione un asesor"
        )
        .required("Campo requerido"),
      storeName: Yup.string()
        .matches(/^[a-zA-Z??????????????????????\s]{2,40}$/, "Ingrese un nombre v??lido")
        .required("Campo requerido"),
      locality: Yup.string()
        .matches(
          /^[a-zA-Z??????????????????????\s]{2,40}$/,
          "Ingrese una localidad v??lida"
        )
        .required("Campo requerido"),
      neighborhood: Yup.string()
        .matches(/^[a-zA-Z??????????????????????\s]{2,40}$/, "Ingrese un barrio v??lido")
        .required("Campo requerido"),
      zone: Yup.string()
        .matches(/^[a-zA-Z??????????????????????\s]{3,15}$/, "Escoja una zona")
        .required("Campo requerido"),
      status: Yup.string().matches(/^[^-]*$/, "Seleccione un asesor"),
      landline: Yup.number()
        .positive()
        .integer()
        .lessThan(9999999, "Ingrese n??mero fijo v??lido en Bogot??")
        .moreThan(999999, "Ingrese n??mero fijo v??lido en Bogot??")
        .required("Campo requerido"),
      additionalInfo: Yup.string(),
    }),
    onSubmit: (values) => {
      setShowConfirmModal(true);
    },
  });

  // console.log(formattedAddress);
  // console.log(formik);

  const handleSubmitDataFromModal = async () => {
    const action = create ? "Creaci??n " : "Actualizaci??n ";
    // console.log(formik.values);
    try {
      const data = new FormData();
      data.append("grocerName", formik.values["storeName"]);
      data.append("ownerName", formik.values["name"]);
      data.append("documentType", formik.values["documentType"]);
      data.append("documentId", formik.values["documentId"]);
      data.append("cellphone", formik.values["cellphone"]);
      data.append("phone", formik.values["landline"]);
      data.append("email", formik.values["email"]);
      data.append("address", formattedAddress);
      for (const key in zoneKeys) {
        if (zoneKeys[key] === formik.values["zone"]) {
          data.append("zone", key);
        }
      }
      for (const key in assessorKeys) {
        if (assessorKeys[key] === formik.values["assessor"]) {
          data.append("sellerCreator", key);
        }
      }
      data.append("locality", formik.values["locality"]);
      data.append("addressAdditionalInfo", formik.values["additionalInfo"]);
      if (!create) {
        data.append("status", formik.values["status"] === "Activo" ? 0 : 1);
      }
      data.append("neighborhood", formik.values["neighborhood"]);
      data.append("latitude", addressCoords.latitude);
      data.append("longitude", addressCoords.longitude);
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

      setShowConfirmModal(false);
      setIsLoading(true);
      const res = await httpMethod(httpArg);

      if (res.correct) {
        if (create) {
          formik.resetForm();
          formik.values = defaultInitialValues;
          const setUpLocation = async () => {
            const { geolocation } = navigator;
            if (geolocation) {
              geolocation.getCurrentPosition(
                async (position) => {
                  console.log("Reubicando navegador...");
                  setAddressCoords({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  });
                  setFormattedAddress(
                    await getAddress({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                    })
                  );
                },
                () => {
                  console.log("Reubicaci??n imposible.");
                }
              );
            }
          };
          setUpLocation();
        }

        setUpdateMessage(res.message);
        setModalImage(confirmationImage);
        setIsLoading(false);
        setShowUpdateMessage(true);
        return;
      }
      setUpdateMessage(res.message);
      setModalImage(errorImage);
      setIsLoading(false);
      setShowUpdateMessage(true);
    } catch (error) {
      console.log(error);
      setUpdateMessage(action + "fallida. Intente nuevamente.");
      setModalImage(errorImage);
      setShowUpdateMessage(true);
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
    // console.log(formik.errors);
    const formIsNotRight = numErrors > 0 || emptyField;
    setShowErrorModal(formIsNotRight);
    setShowConfirmModal(!formIsNotRight);
  };

  if (isLoading) {
    return <div className={className["loading-div"]} />;
  }

  return (
    <div className={className["view-container"]}>
      <h1 className={className["page-title"]}>
        {create ? "Crear cliente" : "Actualizar Cliente"}
      </h1>
      <form onSubmit={formik.handleSubmit} action="/form">
        <div className={className["col-wrap"]}>
          <div className={className["col-client"]}>
            <div className={className["header-box"]}>
              <h1>Informaci??n del cliente propietario</h1>
            </div>
            <InputField
              fieldName="name"
              formHook={formik}
              labelKey="Nombre"
              fieldType="text"
              className={className}
            />
            <SelectField
              fieldName="documentType"
              formHook={formik}
              labelKey="Tipo de documento"
              optionVals={[
                "--Seleccione tipo de documento--",
                "C??dula de ciudadan??a",
                "C??dula de extranger??a",
                "NIT",
              ]}
              className={className}
            />
            <InputField
              fieldName="documentId"
              formHook={formik}
              labelKey="Documento de Identidad"
              fieldType="number"
              className={className}
            />
            <InputField
              fieldName="cellphone"
              formHook={formik}
              labelKey="N??mero Celular"
              fieldType="number"
              className={className}
            />
            <InputField
              fieldName="email"
              formHook={formik}
              labelKey="Email"
              fieldType="email"
              className={className}
            />
            <SelectField
              fieldName="assessor"
              formHook={formik}
              labelKey="Asesor Creador"
              optionVals={assessors}
              className={className}
            />
            {!create && (
              <SelectField
                fieldName="status"
                formHook={formik}
                labelKey="Estado cliente"
                optionVals={["--Seleccione un estado--", "Activo", "Inactivo"]}
                className={className}
              />
            )}
          </div>
          <div className={className["col-store"]}>
            <div className={className["header-box"]}>
              <h1>Informaci??n de la tienda</h1>
            </div>
            <InputField
              fieldName="storeName"
              formHook={formik}
              labelKey="Nombre de la tienda"
              fieldType="text"
              className={className}
            />
            <InputField
              fieldName="locality"
              formHook={formik}
              labelKey="Localidad"
              fieldType="text"
              className={className}
            />
            <InputField
              fieldName="neighborhood"
              formHook={formik}
              labelKey="Barrio"
              fieldType="text"
              className={className}
            />
            <SelectField
              fieldName="zone"
              formHook={formik}
              labelKey="Zona"
              optionVals={zones}
              className={className}
            />
            <InputField
              fieldName="landline"
              formHook={formik}
              labelKey="Tel??fono fijo"
              fieldType="number"
              className={className}
            />
            <InputField
              fieldName="additionalInfo"
              formHook={formik}
              labelKey="Informaci??n adicional"
              fieldType="text"
              className={className}
            />
          </div>
        </div>
        <div className={className["location-div"]}>
          <div className={className["header-box"]}>
            <h1>Ubicaci??n</h1>
          </div>
          <AddressGraphicSearchBar
            fieldName="location"
            labelKey="Direcci??n"
            value={formattedAddress}
            setAddress={setFormattedAddress}
            setCoords={setAddressCoords}
            className={className}
            mapContainerStyle={{
              width: "100%",
              height: "100%",
            }}
            zoom={14}
            center={{
              lat: addressCoords.latitude,
              lng: addressCoords.longitude,
            }}
            markerCoords={addressCoords}
            mapPin={mapPin}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            type="submit"
            onClick={handleDataValidation}
            className={className["submit-button"]}
          >
            {create ? "CREAR CLIENTE" : "GUARDAR"}
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
          Confirme {create ? "creaci??n" : "actualizaci??n"} de cliente
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
        isOpen={showUpdateMessage}
        onRequestClose={() => {
          setShowUpdateMessage(false);
        }}
        className={className["Modal"]}
        overlayClassName={className["Overlay"]}
      >
        <p align="center">
          <img src={modalImage} alt="" width="40px" height="40px" />
          <br />
          {updateMessage}
        </p>
      </Modal>
    </div>
  );
};

export default ClientForm;
