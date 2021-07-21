import React, { useState, useEffect } from "react";
import CreateZoneLeaderForm from "../CreateZoneLeaderForm";
import createStyles from "./ViewZoneLeadersCreate.module.css";

// Default initial values for the form
const defaultInitialValues = {
  name: "",
  lastName: "",
  documentType: "",
  documentId: "",
  zone: "",
  address: "",
  leaderCode: "",
  email: "",
  cellphone: "",
  endContractDate: "",
};

// Keys for labeling inputs
const labelKeys = {
  name: "Nombre",
  lastName: "Apellido",
  documentType: "Tipo de documento",
  documentId: "Documento de identidad",
  zone: "Zona",
  address: "Dirección",
  leaderCode: "Código de líder",
  email: "Email",
  cellphone: "Número celular",
  endContractDate: "Fecha fin de contrato",
};

const typeKeys = {
  name: "text",
  lastName: "text",
  documentId: "number",
  documentType: "select",
  zone: "select",
  address: "text",
  leaderCode: "number",
  email: "email",
  cellphone: "number",
  endContractDate: "date",
};

/*
const selectValues = {
    zone : [
      '--Elija una zona--',
      'Norte',
      'Sur'
    ]
}
*/

const CreateZoneLeaderView = (props) => {
  const [zoneIds, setZoneIds] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [selectValues, setSelectValues] = useState({
    zone: ["--Seleccione una zona--", "Norte", "Sur"],
    documentType: [
      "--Seleccione un tipo de documento--",
      "Cédula de ciudadanía",
      "Cédula de extrangería",
    ],
  });

  useEffect(() => {
    const fetchData = () => {
      /*
            THIS MUST BE FETCHED FROM ZONE
            TABLE ON DATABASE
            */
      const zoneKeys = {
        Norte: 2,
        Sur: 1,
      };

      setZoneIds(zoneKeys);
      setSelectValues({
        zone: ["--Elija una zona--", ...Object.keys(zoneKeys)],
        documentType: [
          "--Seleccione un tipo de documento--",
          "Cédula de ciudadanía",
          "Cédula de extrangería",
        ],
      });

      setLoadingData(false);
    };
    fetchData();
  }, []);

  return (
    <>
      {loadingData && <div className={createStyles["loading-div"]}></div>}
      {!loadingData && (
        <div className={createStyles["view-container"]}>
          <h1 className={createStyles["page-title"]}>Crear líder de zona</h1>
          <div className={createStyles["header-box"]}>
            <h1>Información general</h1>
          </div>
          <CreateZoneLeaderForm
            defaultInitialValues={defaultInitialValues}
            labelKeys={labelKeys}
            typeKeys={typeKeys}
            zoneKeys={zoneIds}
            selectValues={selectValues}
          />
        </div>
      )}
    </>
  );
};

export default CreateZoneLeaderView;
