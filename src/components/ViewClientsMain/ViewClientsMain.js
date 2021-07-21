import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import mainStyles from "./ViewClientsMain.module.css";
import {
  getZonesKeys,
  getLevelsKeys,
  getAssessorsKeys,
  getClientDataFromQuery,
} from "../../endpoint/clients.methods";

import ClientsTable from "../GenericTable";
import RedirectButton from "../GenericRedirectButton";
import InputField from "../GenericFieldInput/GenericFieldInput";
import SelectField from "../GenericSelectInput/GenericSelectInput";

const EditClientButton = (props) => {
  const { id, buttonStyle } = props;
  return (
    <RedirectButton
      buttonLabel="EDITAR"
      buttonStyle={buttonStyle}
      path={`/clients/update/${id}`}
    />
  );
};

const ClientDetailButton = (props) => {
  const { id, buttonStyle } = props;
  return (
    <RedirectButton
      buttonLabel="VER DETALLE"
      buttonStyle={buttonStyle}
      path={`/clients/detail/${id}`}
    />
  );
};

const DateFilterOptions = (props) => {
  const { handleFilterSubmit } = props;
  const defaultInitialValues = {
    startDate: "",
    endDate: "",
  };

  const formik = useFormik({
    initialValues: defaultInitialValues,
    validationSchema: Yup.object({
      startDate: Yup.date().required("Campo requerido"),
      endDate: Yup.date().required("Campo requerido"),
    }),
    onSubmit: (values) => handleFilterSubmit(values),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className={mainStyles["date-filter-div"]}>
        <div className={mainStyles["start-date"]}>
          <InputField
            fieldName="startDate"
            formHook={formik}
            labelKey="Fecha de inicio"
            fieldType="date"
            className={mainStyles}
          />
        </div>
        <div className={mainStyles["end-date"]}>
          <InputField
            fieldName="endDate"
            formHook={formik}
            labelKey="Fecha de fin"
            fieldType="date"
            className={mainStyles}
          />
        </div>
      </div>
      <button type="submit" className={mainStyles["submit-button"]}>
        filtrar
      </button>
    </form>
  );
};

const SelectFilterOptions = (props) => {
  const { handleFilterSubmit, getOptions, filterLabel } = props;
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    const fetchLevels = async () => {
      setLevels(await getOptions());
    };
    fetchLevels();
  }, [getOptions]);

  const formik = useFormik({
    initialValues: {
      levelValue: "",
    },
    validationSchema: Yup.object({
      levelValue: Yup.string().required("Campo Requerido"),
    }),
    onSubmit: (values) => handleFilterSubmit(values),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <SelectField
        fieldName="levelValue"
        formHook={formik}
        labelKey={filterLabel}
        optionVals={levels}
        className={mainStyles}
      />
      <button type="submit" className={mainStyles["submit-button"]}>
        filtrar
      </button>
    </form>
  );
};

const filterOptions = ["Fecha de creación", "Nivel", "Asesor", "Zona"];
const tableHeaders = [
  {
    accessor: "id",
    header: "Id",
  },
  {
    accessor: "assessor",
    header: "Asesor Creador",
  },
  {
    accessor: "owner",
    header: "Tendero",
  },
  {
    accessor: "documentId",
    header: "Documento",
  },
  {
    accessor: "storeAddress",
    header: "Dirección",
  },
  {
    accessor: "location",
    header: "Ubicación",
  },
  {
    accessor: "zone",
    header: "Zona",
  },
  {
    accessor: "creationDate",
    header: "Fecha de Creación",
  },
  {
    accessor: "numOrders",
    header: "Cantidad de Pedidos",
  },
  {
    accessor: "lastOrderDate",
    header: "Fecha Última Orden",
  },
];

const ClientsMainView = (props) => {
  const [filterType, setFilterType] = useState(filterOptions[1]);
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const initSetUp = async () => {
      const levelOptns = await getLevelsKeys();
      setTableData(
        await getClientDataFromQuery({
          level: levelOptns[0],
        })
      );
      setIsLoading(false);
    };
    initSetUp();
  }, []);

  const handleChangeFilter = (event) => {
    setFilterType(event.target.value);
  };

  const submitHandlers = {
    [filterOptions[0]]: async (values) => {
      console.log("Filtrando clientes por fecha...");
      setIsLoading(true);
      setTableData(
        await getClientDataFromQuery({
          startDate: values["startDate"],
          endDate: values["endDate"],
        })
      );
      setIsLoading(false);
    },
    [filterOptions[1]]: async (values) => {
      console.log("Filtrando clientes por nivel...");
      setIsLoading(true);
      setTableData(
        await getClientDataFromQuery({
          level: values["levelValue"],
        })
      );
      setIsLoading(false);
    },
    [filterOptions[2]]: async (values) => {
      console.log("Filtrando clientes por asesor...");
      setIsLoading(true);
      setTableData(
        await getClientDataFromQuery({
          assessor: values["levelValue"],
        })
      );
      setIsLoading(false);
    },
    [filterOptions[3]]: async (values) => {
      console.log("Filtrando clientes por zona...");
      setIsLoading(true);
      setTableData(
        await getClientDataFromQuery({
          zone: values["levelValue"],
        })
      );
      setIsLoading(false);
    },
  };

  const formOptions = {
    [filterOptions[0]]: DateFilterOptions,
    [filterOptions[1]]: SelectFilterOptions,
    [filterOptions[2]]: SelectFilterOptions,
    [filterOptions[3]]: SelectFilterOptions,
  };

  const formProps = {
    [filterOptions[0]]: {
      handleFilterSubmit: submitHandlers[filterOptions[0]],
    },
    [filterOptions[1]]: {
      handleFilterSubmit: submitHandlers[filterOptions[1]],
      getOptions: getLevelsKeys,
      filterLabel: "Nivel",
      key: `${filterOptions[1]}-1-cond-option`,
    },
    [filterOptions[2]]: {
      handleFilterSubmit: submitHandlers[filterOptions[2]],
      getOptions: getAssessorsKeys,
      filterLabel: "Asesor",
      key: `${filterOptions[2]}-2-cond-option`,
    },
    [filterOptions[3]]: {
      handleFilterSubmit: submitHandlers[filterOptions[3]],
      getOptions: getZonesKeys,
      filterLabel: "Zona",
      key: `${filterOptions[3]}-3-cond-option`,
    },
  };

  const CustomForm = formOptions[filterType];

  return (
    <div className={mainStyles["view-container"]}>
      <div className={mainStyles["title"]}>
        <h1>Clientes</h1>
      </div>
      <div className={mainStyles["create-button-div"]}>
        <RedirectButton
          buttonLabel="Crear cliente"
          buttonStyle={mainStyles["create-button"]}
          path="clients/create"
        />
      </div>
      <div className={mainStyles["filter-prompt"]}>
        <div className={mainStyles["filter-banner"]}>
          <h1>Filtros</h1>
        </div>
        <label htmlFor="filterType" className={mainStyles["filter-label"]}>
          Filtrar por
        </label>
        <br />
        <select
          className={mainStyles["select-filter"]}
          id="filterType"
          onChange={handleChangeFilter}
          value={filterType}
        >
          {filterOptions.map((option, idx) => (
            <option value={option} key={`${option}-%{idx}-option`}>
              {option}
            </option>
          ))}
        </select>
        <CustomForm {...formProps[filterType]} />
      </div>
      {isLoading && <div className={mainStyles["loading-div"]}></div>}
      {!isLoading && (
        <ClientsTable
          dataset={tableData}
          Headers={tableHeaders}
          downloadFileName={`Clientes-${filterType}`}
          pageSize={6}
          identifier={"id"}
          actions={[
            {
              Component: EditClientButton,
              props: {
                buttonStyle: mainStyles["edit-button"],
              },
            },
            {
              Component: ClientDetailButton,
              props: {
                buttonStyle: mainStyles["detail-button"],
              },
            },
          ]}
        />
      )}
    </div>
  );
};

export default ClientsMainView;
