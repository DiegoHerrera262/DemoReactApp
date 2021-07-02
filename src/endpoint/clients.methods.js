import axios from 'axios';

const postClient = (data) => {
    const defaultURl = 'http://localhost:8000/grocers/create';
    try {
        for (let value of data.values()) {
            console.log(value)
        }
    } catch (error) {
        return error;
    }
}

const getClientById = (id) => {
    const defaultURl = `http://localhost:8000/grocers/${id}`;
    try {
        return {
            name : 'Test Name',
            documentType : 'Cédula de ciudadanía',
            documentId : parseInt(`${id}000000000`),
            cellphone : parseInt(`${id}000000000`),
            email : `mail${id}@mail.com`,
            assessor : 'Asesor 1',
            storeName: 'Tienda Superveci',
            locality: 'Suba',
            neighborhood: 'Suba Rincon',
            zone: 'Norte',
            landline: parseInt(`123430${id}`),
            storeAddress: 'Cra. 75 #150-50, Bogotá, Colombia'
        }
    } catch (error) {
        return error;
    }
}

const putClientById = (id, data) => {
    const defaultURl = `http://localhost:8000/grocers/${id}`;
    try {
        console.log('Actualizando cliente: ', id);
        for (let value of data.values()) {
            console.log(value);
        }
    } catch (error) {
        return error;
    }
}

export { postClient, getClientById, putClientById };