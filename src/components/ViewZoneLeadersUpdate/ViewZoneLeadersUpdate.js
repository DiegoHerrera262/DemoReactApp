import React, { useState, useEffect } from "react";
import UpdateZoneLeaderForm from "../UpdateZoneLeaderForm";
//import { getLeaderFullById } from "../../endpoint/zoneLeaders.methods";
import updateStyles from "./ViewZoneLeadersUpdate.module.css";

import { getZones } from "../../endpoint/clients.methods";
import { getLeaders } from "../../endpoint/zoneLeaders.methods";
import { getSellerFullById } from "../../endpoint/sellers.methods";

// Keys for labeling inputs
const labelKeys = {
  name: "Nombre",
  lastName: "Apellido",
  documentType: "Tipo de documento",
  documentId: "Documento de identidad",
  zone: "Zona",
  isLeader: "Seleccione para líder de zona",
  address: "Dirección",
  leaderCode: "Código de líder",
  email: "Email",
  cellphone: "Número celular",
  endContractDate: "Fecha fin de contrato",
};

const typeKeys = {
  name: "text",
  lastName: "text",
  documentType: "select",
  documentId: "number",
  zone: "select",
  isLeader: "checkbox",
  address: "address",
  leaderCode: "text",
  email: "email",
  cellphone: "number",
  endContractDate: "date",
};

const UpdateZoneLeaderView = (props) => {
  const { leaderId } = props;
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    name: "",
    lastName: "",
    documentId: "",
    zone: "",
    address: "",
    leaderCode: "",
    email: "",
    cellphone: "",
    endContractDate: "",
    frontID: {},
    rut: {},
    bankData: {},
    contract: {},
    profileImage: "",
  });
  const [loadingData, setLoadingData] = useState(true);
  const [zoneIds, setZoneIds] = useState({});
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
    const fetchData = async (id) => {
      const result = await getSellerFullById({
        id: id,
        files: true,
      });
      console.log(result);
      /*
      const resData = result[0];
      console.log(resData);
      console.log(resData);
      */

      /* 
            THIS SHOULD BE FETCHED FROM ZONE TABLE
            ON THE DATABASE
            */
      const zoneKeys = await getZones();
      const rawLeaders = await getLeaders();
      let leadersKey = {};
      console.log(rawLeaders);
      if (rawLeaders.length > 0) {
        rawLeaders.forEach((leader) => {
          leadersKey[
            leader.id
          ] = `${leader["sellerCode"]} - ${leader["name"]} ${leader["lastName"]}`;
        });
      }

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

      setZoneIds(zoneKeys);
      setDefaultInitialValues({
        name: result["name"],
        lastName: result["lastName"],
        documentType: result["documentType"],
        documentId: parseInt(result["documentId"]),
        zone: zoneKeys[result["zoneId"]],
        address: result["address"],
        leaderCode: result["sellerCode"],
        email: result["email"],
        cellphone: parseInt(result["cellphone"]),
        endContractDate: result["contractExpires"],
        profileImage: new Blob([result["profileImage"]], {
          type: result["profileImage"].type,
        }),
        rut: result["rut"],
        frontID: result["frontID"],
        contract: result["contract"],
        bankData: result["bankData"],
        isLeader: result["sellerType"].toString() === "3",
        superCode: leadersKey[result["leaderId"]],
      });
      setLoadingData(false);
    };
    fetchData(leaderId);
  }, [leaderId]);

  return (
    <>
      {loadingData && <div className={updateStyles["loading-div"]}></div>}
      {!loadingData && (
        <div className={updateStyles["view-container"]}>
          <h1 className={updateStyles["page-title"]}>Editar datos asesor</h1>
          <div className={updateStyles["header-box"]}>
            <h1>Información general</h1>
          </div>
          <UpdateZoneLeaderForm
            defaultInitialValues={defaultInitialValues}
            leaderId={props.leaderId}
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

export default UpdateZoneLeaderView;
