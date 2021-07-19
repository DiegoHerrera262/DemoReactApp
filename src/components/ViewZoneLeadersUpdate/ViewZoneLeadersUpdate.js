import React, { useState, useEffect } from "react";
import UpdateZoneLeaderForm from "../UpdateZoneLeaderForm";
import { getLeaderById } from "../../endpoint/zoneLeaders.methods";
import updateStyles from "./ViewZoneLeadersUpdate.module.css";

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
    zone: ["--Elija una zona--", "Norte", "Sur"],
  });

  useEffect(() => {
    const fetchData = async (id) => {
      const result = await getLeaderById(id);
      const resData = result[0];
      console.log(resData);

      /* 
            THIS SHOULD BE FETCHED FROM ZONE TABLE
            ON THE DATABASE
            */
      const zoneKeys = {
        Norte: 2,
        Sur: 1,
      };

      setSelectValues({
        zone: ["--Elija una zona--", ...Object.keys(zoneKeys)],
      });

      setZoneIds(zoneKeys);
      setDefaultInitialValues({
        name: resData["name"],
        lastName: resData["last_name"],
        documentId: parseInt(resData["document"]),
        zone: Object.keys(zoneKeys).find(
          (key) => zoneKeys[key] === parseInt(resData["zone_id"])
        ) /*parseInt(resData['zone_id']) === 1 ? 'Sur' : 'Norte']*/,
        address: resData["address"],
        leaderCode: parseInt(resData["seller_code"]),
        email: resData["email"],
        cellphone: parseInt(resData["cellphone"]),
        endContractDate: new Date(Date.parse(resData["contract_expires"]))
          .toISOString()
          .substring(0, 10),
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
          <h1 className={updateStyles["page-title"]}>
            Editar datos líder de zona
          </h1>
          <div className={updateStyles["header-box"]}>Información general</div>
          <UpdateZoneLeaderForm
            defaultInitialValues={defaultInitialValues}
            leaderId={props.leaderId}
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

export default UpdateZoneLeaderView;
