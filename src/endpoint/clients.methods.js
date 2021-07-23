import axios from "axios";

const getAssessors = async () => {
  /*{ 1: "Asesor 1", 2: "Asesor 2", 3: "Asesor 3", 30: "Asesor 30" }*/
  const defaultURL = `${process.env.REACT_APP_SERVER_HOST}/sellers`;
  const rawAssessors = await axios.get(defaultURL, {
    params: {
      all: true,
    },
  });
  const assessors = {};
  rawAssessors.data.forEach((assessor) => {
    assessors[
      assessor["id"]
    ] = `${assessor["sellerCode"]} - ${assessor["name"]} ${assessor["lastName"]}`;
  });
  return assessors;
};

const getAssessorsKeys = () => {
  return Object.values(getAssessors());
};

const getLevels = () => {
  return { 0: "Vecino novato", 1: "Vecino fiel", 2: "Vecino pro" };
};

const getLevelsKeys = () => {
  return Object.values(getLevels());
};

const getZones = () => {
  return { 2: "Norte", 1: "Sur" };
};

const getZonesKeys = () => {
  return Object.values(getZones());
};

const getStatus = () => {
  return { 0: "Activo", 1: "Inactivo" };
};

const getStatusKeys = () => {
  return Object.values(getStatus());
};

const postClient = async ({ data }) => {
  const defaultURl = `${process.env.REACT_APP_SERVER_HOST}/grocer/create`;
  console.log("Creando nuevo cliente...");
  try {
    await axios.post(defaultURl, data);
    return { message: "Cliente creado correctamente.", correct: true };
  } catch (error) {
    console.log(error.message);
    return { message: error.message, correct: false };
  }
};

const putClientById = async ({ data, params: { id } }) => {
  const defaultURl = `http://localhost:8000/grocer/${id}`;
  try {
    await axios.put(defaultURl, data);
    return { message: "Cliente actualizado correctamente.", correct: true };
  } catch (error) {
    console.log(error.message);
    return { message: error.message, correct: false };
  }
};

const getClientById = async (id) => {
  const defaultURl = `http://localhost:8000/grocer/${id}`;
  try {
    /*
    const assessorKeys = await getAssessors();
    const zoneKeys = await getZones();
    */
    const clientReq = await axios.get(defaultURl);
    const clientData = clientReq.data;

    /*
    const assessorName = Object.keys(assessorKeys).filter(
      (key) => assessorKeys[key] === parseInt(clientData.sellerCreator)
    );
    const zoneName = Object.keys(zoneKeys).filter(
      (key) => zoneKeys[key] === parseInt(clientData.zone)
    );
    */

    return {
      name: clientData.ownerName,
      documentType: clientData.documentType,
      documentId: parseInt(clientData.documentId),
      cellphone: parseInt(clientData.cellphone),
      email: clientData.email,
      assessor: clientData.sellerCreator,
      storeName: clientData.grocerName,
      locality: clientData.locality,
      neighborhood: clientData.neighborhood,
      zone: clientData.zone,
      status: clientData.status,
      landline: parseInt(clientData.phone),
      storeAddress: clientData.address,
      additionalInfo: clientData.addressAdditionalInfo,
      level: clientData.level,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getClientDetailById = (id) => {
  /* MOCK BACKEND FOR FETCHING DETAIL INFO */
  try {
    return {
      basicInfo: {
        name: "Test Name",
        cellphone: parseInt(`${id}000000000`),
        email: `mail${id}@mail.com`,
        storeName: "Tienda Superveci",
        locality: "Suba",
        storeAddress: "Cra. 10 #10-10, Bogotá, Colombia",
        createdAt: "06-07-21",
        coordinates: {
          latitude: 4.68734,
          longitude: -74.14816,
        },
      },
      sellingInfo: {
        clientType: "Orgánico",
        clientLevel: "Premium",
        deliveredReq: {
          number: 5,
          totalValue: 5000000,
        },
        returns: {
          number: 5,
          percent: 1,
        },
      },
    };
  } catch (error) {
    return error;
  }
};

const getClientByIdSells = (id) => {
  const data = [];
  const sample = {
    id: 11,
    sellDate: new Date(),
    value: 58000,
    ticket: 123,
    state: "Cancelado",
  };
  for (let i = 0; i < 20; i++) {
    data.push(sample);
  }
  return data;
};

const getClientByIdMostBought = (id) => {
  const data = [];
  const sample = {
    id: 5,
    name: "Test Product",
    category: "Test Category",
    quantity: 8,
  };
  for (let i = 0; i < 20; i++) {
    data.push(sample);
  }
  return data;
};

const getClientDataFromQuery = async (queryParams) => {
  try {
  } catch {}
  const defaultURl = `${process.env.REACT_APP_SERVER_HOST}/grocers/`;
  // console.log(queryParams);
  const res = await axios.get(defaultURl, {
    params: queryParams,
  });
  return res.data;
};

/*
const getClientDataFromQuery = (queryParams) => {
  let sampleDatum = {};
  let dataset = [];
  if (queryParams.startDate && queryParams.endDate) {
    sampleDatum = {
      id: 1,
      assessor: "Test Assessor 1",
      owner: "Owner Date",
      documentId: 12345678,
      storeAddress: "Cra 10 #10-10",
      location: "Loc. Date",
      zone: "Zone Date",
      creationDate: queryParams.startDate,
      numOrders: 5,
      lastOrderDate: queryParams.endDate,
    };
    for (let idx = 0; idx < 40; idx++) {
      sampleDatum = { ...sampleDatum, id: idx };
      dataset.push(sampleDatum);
    }
  }
  if (queryParams.level) {
    sampleDatum = {
      id: 1,
      assessor: queryParams.level,
      owner: "Owner Level",
      documentId: 123456706,
      storeAddress: "Cra 20 #20-20",
      location: "Loc. Level",
      zone: "Zone Level",
      creationDate: "01-01-2021",
      numOrders: 6,
      lastOrderDate: "03-02-2021",
    };
    for (let idx = 40; idx < 80; idx++) {
      sampleDatum = { ...sampleDatum, id: idx };
      dataset.push(sampleDatum);
    }
  }
  if (queryParams.assessor) {
    sampleDatum = {
      id: 1,
      assessor: queryParams.assessor,
      owner: "Owner Assessor",
      documentId: 123456706,
      storeAddress: "Cra 30 #30-30",
      location: "Loc. Assessor",
      zone: "Zone Assessor",
      creationDate: "12-01-2021",
      numOrders: 7,
      lastOrderDate: "06-02-2021",
    };
    for (let idx = 80; idx < 120; idx++) {
      sampleDatum = { ...sampleDatum, id: idx };
      dataset.push(sampleDatum);
    }
  }
  if (queryParams.zone) {
    sampleDatum = {
      id: 1,
      assessor: queryParams.zone,
      owner: "Owner Zone",
      documentId: 12345678,
      storeAddress: "Cra 40 #40-40",
      location: "Loc. Zone",
      zone: queryParams.zone,
      creationDate: "28-01-2021",
      numOrders: 7,
      lastOrderDate: "12-02-2021",
    };
    for (let idx = 120; idx < 160; idx++) {
      sampleDatum = { ...sampleDatum, id: idx };
      dataset.push(sampleDatum);
    }
  }
  return dataset;
};
*/

export {
  getZones,
  getZonesKeys,
  getLevels,
  getLevelsKeys,
  getAssessors,
  getAssessorsKeys,
  getStatusKeys,
  getStatus,
  getClientDataFromQuery,
  postClient,
  getClientById,
  putClientById,
  getClientDetailById,
  getClientByIdSells,
  getClientByIdMostBought,
};
