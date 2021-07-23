import axios from "axios";

const postSupplier = async (data) => {
  try {
    console.log("Creando proveedor...");
    const defaultURL = `${process.env.REACT_APP_SERVER_HOST}/supplier/create`;
    await axios.post(defaultURL, data);
  } catch (error) {
    console.log(error);
    return error;
  }
};

export { postSupplier };
