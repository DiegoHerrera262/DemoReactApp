import React from "react";
import createClientStyles from "./ViewClientsCreate.module.css";
import ClientForm from "../CilentsCRUDForm/ClientsCRUDForm";

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
};

const CreateClientView = (props) => {
  return (
    <ClientForm
      create
      defaultInitialValues={defaultInitialValues}
      httpMethod={postClient}
      className={createClientStyles}
    />
  );
};

export default CreateClientView;
