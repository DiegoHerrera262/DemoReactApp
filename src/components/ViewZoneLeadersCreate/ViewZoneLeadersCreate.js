import React, { useState, useEffect } from "react";
import CreateZoneLeaderForm from "../CreateZoneLeaderForm";
import createStyles from "./ViewZoneLeadersCreate.module.css";

// Default initial values for the form
const defaultInitialValues = {
  name: "",
  lastName: "",
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
    zone: ["--Elija una zona--", "Norte", "Sur"],
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
      });

      setLoadingData(false);
    };
    fetchData();
  }, []);

  return (
    <>
      {loadingData && <div className={createStyles["loader"]}></div>}
      {!loadingData && (
        <div className={createStyles["main-page-container"]}>
          <div
            style={{
              maxWidth: "91%",
              marginTop: "1.9em",
              marginBottom: "2.1em",
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: "1.5em",
              fontWeight: "600",
            }}
          >
            Crear líder de zona
          </div>
          <div className={createStyles["info-title"]}>Información general</div>
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
