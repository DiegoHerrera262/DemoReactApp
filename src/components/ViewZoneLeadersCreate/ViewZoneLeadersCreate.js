import React, { useState, useEffect } from "react";
import CreateZoneLeaderForm from "../CreateZoneLeaderForm";
import createStyles from "./ViewZoneLeadersCreate.module.css";

import { getLeaders } from "../../endpoint/zoneLeaders.methods";
import { getZones } from "../../endpoint/clients.methods";

// Default initial values for the form
const defaultInitialValues = {
  name: "",
  lastName: "",
  documentType: "",
  documentId: "",
  zone: "",
  isLeader: false,
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
  isLeader: "Seleccione para crear líder de zona",
  address: "Dirección",
  leaderCode: "Código de asesor",
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
  isLeader: "checkbox",
  address: "address",
  leaderCode: "text",
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
  const [leadersKeys, setLeadersKeys] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      /*
            THIS MUST BE FETCHED FROM ZONE
            TABLE ON DATABASE
            */
      const zoneKeys = await getZones();

      let leadersKey = {};
      const rawLeaders = await getLeaders();
      console.log(rawLeaders);
      if (rawLeaders.length > 0) {
        rawLeaders.forEach((leader) => {
          leadersKey[
            leader.id
          ] = `${leader["sellerCode"]} - ${leader["name"]} ${leader["lastName"]}`;
        });
      }
      /*
      if (rawLeaders.length === 0) {
        leadersKey["empty"] = "vacío";
      }
      */

      setZoneIds(zoneKeys);
      setSelectValues({
        zone: ["--Elija una zona--", ...Object.values(zoneKeys)],
        documentType: [
          "--Seleccione un tipo de documento--",
          "Cédula de ciudadanía",
          "Cédula de extrangería",
        ],
      });
      setLeadersKeys(leadersKey);
      setLoadingData(false);
    };
    fetchData();
  }, []);

  return (
    <>
      {loadingData && <div className={createStyles["loading-div"]}></div>}
      {!loadingData && (
        <div className={createStyles["view-container"]}>
          <h1 className={createStyles["page-title"]}>Crear asesor</h1>
          <div className={createStyles["header-box"]}>
            <h1>Información general</h1>
          </div>
          <CreateZoneLeaderForm
            defaultInitialValues={defaultInitialValues}
            labelKeys={labelKeys}
            typeKeys={typeKeys}
            zoneKeys={zoneIds}
            selectValues={selectValues}
            leadersKeys={leadersKeys}
          />
        </div>
      )}
    </>
  );
};

export default CreateZoneLeaderView;
