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

const getClientDetailById = (id) => {
    /* MOCK BACKEND FOR FETCHING DETAIL INFO */
    try {
        return {
            basicInfo : {
                name : 'Test Name',
                cellphone : parseInt(`${id}000000000`),
                email : `mail${id}@mail.com`,
                storeName: 'Tienda Superveci',
                locality: 'Suba',
                storeAddress: 'Cra. 10 #10-10, Bogotá, Colombia',
                createdAt : '06-07-21',
                coordinates : {
                    latitude : 4.68734,
                    longitude : -74.14816
                }
            },
            sellingInfo : {
                clientType : 'Orgánico',
                clientLevel : 'Premium',
                deliveredReq : {
                    number : 5,
                    totalValue : 5000000
                },
                returns : {
                    number : 5,
                    percent : 1
                }
            }
        }
    } catch(error) {
        return error;
    }
}

const getClientByIdSells = (id) => {
    const data = [];
    const sample = {
        id : 11,
        sellDate : new Date(),
        value : 58000,
        ticket : 123,
        state: 'Cancelado'
    }
    for (let i=0; i<20; i++) {
        data.push(sample);
    }
    return data;
}

const getClientByIdMostBought = (id) => {
    const data = [];
    const sample = {
        id : 5,
        name : 'Test Product',
        category : 'Test Category',
        quantity : 8
    }
    for (let i=0; i<20; i++) {
        data.push(sample);
    }
    return data;
}

export { postClient, getClientById, putClientById, getClientDetailById, getClientByIdSells, getClientByIdMostBought };
