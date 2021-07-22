import React, { useState, useEffect } from "react";
import updateClientStyles from "./ViewClientsUpdate.module.css";

import ClientForm from "../CilentsCRUDForm/ClientsCRUDForm";

import { getZones, getAssessors } from "../../endpoint/clients.methods";

import { putClientById, getClientById } from "../../endpoint/clients.methods";

const resetValues = {
  name: "",
  documentType: "",
  documentId: "",
  cellphone: "",
  email: "",
  assessor: "",
  storeName: "",
  locality: "",
  neighborhood: "",
  zone: "",
  landline: "",
  storeAddress: "",
};

const UpdateClientView = (props) => {
  const { clientId } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [rawAssessors, setRawAssessors] = useState({});
  const [rawZones, setRawZones] = useState({});

  const [defaultInitialValues, setDefaultInitialValues] = useState(resetValues);

  /* Here data should be fetched from the Clients API */
  useEffect(() => {
    const fetchData = async () => {
      const rawClientData = await getClientById(clientId);
      const assessorKeys = await getAssessors();
      const zoneKeys = await getZones();
      const clientData = {
        ...rawClientData,
        assessor: assessorKeys[rawClientData["assessor"]],
        zone: zoneKeys[rawClientData["zone"]],
        status: rawClientData["status"] === 0 ? "Activo" : "Inactivo",
      };
      setDefaultInitialValues(clientData);
      setRawAssessors(assessorKeys);
      setRawZones(zoneKeys);
      setIsLoading(false);
    };
    fetchData();
  }, [clientId]);

  if (isLoading) {
    return <div className={updateClientStyles["loading-div"]} />;
  }

  return (
    <ClientForm
      clientId={clientId}
      rawAssessors={rawAssessors}
      rawZones={rawZones}
      defaultInitialValues={defaultInitialValues}
      httpMethod={putClientById}
      httpParams={{
        id: clientId,
      }}
      className={updateClientStyles}
    />
  );
};

export default UpdateClientView;
