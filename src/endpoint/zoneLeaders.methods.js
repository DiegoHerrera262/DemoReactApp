import axios from "axios";
// import * as FileSaver from "file-saver";

// setting up get method
const postLeader = async (leaderData) => {
  const postURL = `${process.env.REACT_APP_SERVER_HOST}/leaders`;
  try {
    await axios.post(postURL, leaderData);
    return { message: "Lider creado correctamente", correct: true };
  } catch (error) {
    return {
      message: error.message,
      correct: false,
    };
  }
};

const putLeader = async ({ sellerData, id }) => {
  try {
    const putURL = `${process.env.REACT_APP_SERVER_HOST}/leaders/${id}`;
    await axios.put(putURL, sellerData);
    return { message: "Líder actualizado correctamente", correct: true };
  } catch (error) {
    return {
      message: error.message,
      correct: false,
    };
  }
};

const updateLeader = async (leaderId, newData) => {
  const putURL = `${process.env.REACT_APP_SERVER_HOST}/leaders/${leaderId}`;
  try {
    await axios.put(putURL, newData);
    return { message: "Líder actualizado correctamente", correct: true };
  } catch (error) {
    console.log(error);
    return {
      message: error.message,
      correct: false,
    };
  }
};

const getLeaders = async () => {
  const getURL = `${process.env.REACT_APP_SERVER_HOST}/leaders`;
  try {
    const leaderList = await axios.get(getURL);
    return leaderList.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getLeaderById = async (leaderId) => {
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

const getLeaderFilesById = async ({ leaderId, fileKey }) => {
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

const getLeaderFullById = async ({ leaderId, files }) => {
  try {
    let fullData = await getLeaderById(leaderId);
    if (files) {
      console.log("Trayendo archivos...");
      const rut = await getLeaderFilesById({
        leaderId: leaderId,
        fileKey: "rutImage",
      });
      const bankData = await getLeaderFilesById({
        leaderId: leaderId,
        fileKey: "bankCertification",
      });
      const profileImage = await getLeaderFilesById({
        leaderId: leaderId,
        fileKey: "imageUrl",
      });
      const contract = await getLeaderFilesById({
        leaderId: leaderId,
        fileKey: "contractImage",
      });
      const frontID = await getLeaderFilesById({
        leaderId: leaderId,
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

const deleteLeaderById = async (leaderId) => {
  const deleteURL = `${process.env.REACT_APP_SERVER_HOST}/sellers/${leaderId}`;
  try {
    await axios.delete(deleteURL);
    return { message: "Asesor eliminado correctamente.", correct: true };
  } catch (error) {
    console.log(error);
    return { message: "Eliminación incorrecta.", correct: false };
  }
};

export {
  postLeader,
  putLeader,
  updateLeader,
  getLeaderById,
  getLeaderFullById,
  getLeaderFilesById,
  getLeaders,
  deleteLeaderById,
};
