import axios from 'axios';

const defaultURl = 'http://localhost:8080/lideres';

// setting up get method
const postLeader = async (leaderData) => {
    try {
        await axios.post(defaultURl, leaderData);
        return {message : 'Lider creado correctamente', correct : true};
    } catch (error) {
        return {message : 'Datos previamente registrados. Creación incorrecta', correct : false};
    }
}

const updateLeader = async (leaderId, newData) => {
    const putURL = `http://localhost:8080/lideres/${leaderId}`;
    try {
        await axios.put(putURL, newData);
        return {message : 'Líder actualizado correctamente', correct : true};
    } catch (error) {
        console.log(error);
        return {message : 'Datos previamente registrados. Actualización Incorrecta', correct : false};
    }
}

const getLeaderById = async (leaderId) => {
    const getURL = `http://localhost:8080/lideres/${leaderId}`;
    try {
        const leaderData = await axios.get(getURL);
        return leaderData.data;
    } catch (error) {
        return {
            name : '',
            lastName : '',
            documentId : '',
            zone : '',
            address : '',
            leaderCode : '',
            email : '',
            cellphone : '',
            endContractDate : '',
        }
    }
}

export {postLeader, updateLeader, getLeaderById};