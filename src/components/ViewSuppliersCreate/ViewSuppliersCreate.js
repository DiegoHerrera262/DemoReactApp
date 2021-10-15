import SuppliersCRUDForm from "../SuppliersCRUDForm/SuppliersCRUDForm";
import { postSupplier } from "../../endpoint/suppliers.methods";

const ViewSuppliersCreate = (props) => {
  const defaultInitialValues = {
    name: "",
    documentType: "",
    documentId: "",
    email: "",
    phone: "",
    cellphone: "",
    address: "",
    addressAdditionalInfo: "",
    city: "",
    locality: "",
    neighborhood: "",
    status: "Activo",
  };

  return (
    <SuppliersCRUDForm
      create
      defaultInitialValues={defaultInitialValues}
      httpMethod={postSupplier}
      httpParams={{}}
    />
  );
};

export default ViewSuppliersCreate;
