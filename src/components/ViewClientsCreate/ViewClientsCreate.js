import React, { useState, useEffect } from "react";
import createClientStyles from "./ViewClientsCreate.module.css";
import ClientForm from "../CilentsCRUDForm/ClientsCRUDForm";

import { getZones, getAssessors } from "../../endpoint/clients.methods";

import { postClient } from "../../endpoint/clients.methods";

const defaultInitialValues = {
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
  additionalInfo: "",
};

const CreateClientView = (props) => {
  const [rawAssessors, setRawAssessors] = useState({});
  const [rawZones, setRawZones] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setRawAssessors(await getAssessors());
      setRawZones(await getZones());
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div className={createClientStyles["loading-div"]}></div>;
  }

  return (
    <ClientForm
      create
      rawAssessors={rawAssessors}
      rawZones={rawZones}
      defaultInitialValues={defaultInitialValues}
      httpMethod={postClient}
      className={createClientStyles}
    />
  );
};

export default CreateClientView;
