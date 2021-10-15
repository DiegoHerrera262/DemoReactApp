import axios from "axios";

const postSupplier = async ({ data }) => {
  try {
    console.log("Creando proveedor...");
    const defaultURL = `${process.env.REACT_APP_SERVER_HOST}/supplier/create`;
    await axios.post(defaultURL, data);
    return { message: "Proveedor creado correctamente", correct: true };
  } catch (error) {
    console.log(error);
    return { message: error.message, correct: false };
  }
};

const putSupplier = async ({ data, params: { id } }) => {
  try {
    console.log("Actualizando proveedor...");
    const defaultURL = `${process.env.REACT_APP_SERVER_HOST}/supplier/${id}`;
    await axios.put(defaultURL, data);
    return { message: "Proveedor creado correctamente", correct: true };
  } catch (error) {
    console.log(error);
    return { message: error.message, correct: false };
  }
};

export { postSupplier, putSupplier };
