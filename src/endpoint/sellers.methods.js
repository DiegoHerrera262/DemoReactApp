import axios from "axios";

const getAllSellers = async () => {
  const defaultURL = `${process.env.REACT_APP_SERVER_HOST}/sellers`;
  const rawAssessors = await axios.get(defaultURL, {
    params: {
      all: true,
    },
  });
  return rawAssessors.data;
};

const postSeller = async (sellerData) => {
  const postURL = `${process.env.REACT_APP_SERVER_HOST}/sellers/`;
  try {
    await axios.post(postURL, sellerData);
    return { message: "Asesor creado correctamente", correct: true };
  } catch (error) {
    return {
      message: error.message,
      correct: false,
    };
  }
};

export { postSeller, getAllSellers };
