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

const getSellerById = async (leaderId) => {
  const getURL = `${process.env.REACT_APP_SERVER_HOST}/sellers/`;
  try {
    const leaderData = await axios.get(getURL, {
      params: {
        id: leaderId,
      },
    });
    return leaderData.data;
  } catch (error) {
    console.log(error);
    return {
      name: "",
      lastName: "",
      documentId: "",
      zone: "",
      address: "",
      leaderCode: "",
      email: "",
      cellphone: "",
      endContractDate: "",
    };
  }
};

const getSellerFilesById = async ({ leaderId, fileKey }) => {
  const getURL = `${process.env.REACT_APP_SERVER_HOST}/sellers/files/${leaderId}`;
  try {
    const res = await axios.get(getURL, {
      params: {
        fileKey: fileKey,
      },
      responseType: "blob",
    });
    const file = new File([res.data], res.headers["content-disposition"], {
      type: res.headers["content-type"],
    });
    // console.log(file);
    return file;
  } catch (error) {
    console.log();
    return {};
  }
};

const getSellerFullById = async ({ id, files }) => {
  try {
    let fullData = await getSellerById(id);
    if (files) {
      console.log("Trayendo archivos...");
      const rut = await getSellerFilesById({
        leaderId: id,
        fileKey: "rutImage",
      });
      const bankData = await getSellerFilesById({
        leaderId: id,
        fileKey: "bankCertification",
      });
      const profileImage = await getSellerFilesById({
        leaderId: id,
        fileKey: "imageUrl",
      });
      const contract = await getSellerFilesById({
        leaderId: id,
        fileKey: "contractImage",
      });
      const frontID = await getSellerFilesById({
        leaderId: id,
        fileKey: "documentImage",
      });
      return {
        ...fullData[0],
        rut: rut,
        profileImage: profileImage,
        contract: contract,
        frontID: frontID,
        bankData: bankData,
      };
    }
    return fullData;
  } catch (error) {
    console.log(error);
    return {};
  }
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

const putSeller = async ({ sellerData, id }) => {
  try {
    const putURL = `${process.env.REACT_APP_SERVER_HOST}/sellers/${id}`;
    await axios.put(putURL, sellerData);
    return { message: "Asesor actualizado correctamente", correct: true };
  } catch (error) {
    return {
      message: error.message,
      correct: false,
    };
  }
};

export {
  postSeller,
  putSeller,
  getAllSellers,
  getSellerById,
  getSellerFullById,
  getSellerFilesById,
};
