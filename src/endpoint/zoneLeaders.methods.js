import axios from "axios";

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
  const getURL = `${process.env.REACT_APP_SERVER_HOST}/leaders/${leaderId}`;
  try {
    const leaderData = await axios.get(getURL);
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
  updateLeader,
  getLeaderById,
  getLeaders,
  deleteLeaderById,
};
