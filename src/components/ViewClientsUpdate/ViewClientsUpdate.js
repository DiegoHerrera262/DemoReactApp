import React, { useState, useEffect } from "react";
import updateClientStyles from "./ViewClientsUpdate.module.css";

import ClientForm from "../CilentsCRUDForm/ClientsCRUDForm";

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

  const [defaultInitialValues, setDefaultInitialValues] = useState(resetValues);

  /* Here data should be fetched from the Assessors API */
  useEffect(() => {
    const fetchData = async () => {
      const clientData = await getClientById(clientId);
      setDefaultInitialValues(clientData);
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
