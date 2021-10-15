import React, { useState, useEffect } from "react";
import listStyles from "./ViewZoneLeadersMain.module.css";

import GenericTable from "../GenericTable/GenericTable";
import CreateLeaderButton from "../CreateLeaderButton";
import UpdateLeaderButton from "../UpdateLeaderButton";
// import DeleteLeaderButton from "../DeleteLeaderButton";

// import { getLeaders } from "../../endpoint/zoneLeaders.methods";
import { getAllSellers } from "../../endpoint/sellers.methods";
import { getZones } from "../../endpoint/clients.methods";

const headerNames = [
  {
    header: "Id",
    accessor: "id",
  },
  {
    header: "Nombre",
    accessor: "name",
  },
  {
    header: "Apellido",
    accessor: "lastName",
  },
  {
    header: "Zona",
    accessor: "zoneId",
  },
  {
    header: "Celular",
    accessor: "cellphone",
  },
  {
    header: "Dirección",
    accessor: "address",
  },
];

const LeadersListTableView = (props) => {
  const [leadersArray, setLeadersArray] = useState([
    {
      id: "",
      name: "",
      last_name: "",
      zoneId: "",
      cellphone: "",
      address: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState("init-key");
  const [zonesKeys, setZonesKeys] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const placeholderSellers = await getAllSellers();
      const placeholderZonesObj = await getZones();
      setZonesKeys(placeholderZonesObj);
      setLeadersArray(
        placeholderSellers.map((seller) => {
          // console.log(client);
          // console.log(placeholderAssessorsObj[client["sellerCreator"]]);
          return {
            ...seller,
            zoneId: placeholderZonesObj[seller["zoneId"]],
          };
        })
      );
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // For handling ui update after leader elimination
  /*
  const handleElimination = (id) => {
    setLeadersArray((prev) => prev.filter((leader) => leader.id !== id));
    setKey(`${id}`);
  };
  */
  // console.log(leadersArray);

  return (
    <>
      {isLoading && <div className={listStyles["loading-div"]}></div>}
      {!isLoading && (
        <div className={listStyles["view-container"]}>
          <h1 className={listStyles["title"]}>Asesores</h1>
          <div className={listStyles["create-button-div"]}>
            <CreateLeaderButton />
          </div>
          <GenericTable
            key={key}
            dataset={leadersArray}
            Headers={headerNames}
            downloadFileName={"asesores"}
            pageSize={5}
            identifier={"id"}
            actions={[
              {
                Component: UpdateLeaderButton,
                props: {},
              } /*
              {
                Component: DeleteLeaderButton,
                props: {
                  handleElimination: handleElimination,
                },
              },
              */,
            ]}
          />
        </div>
      )}
    </>
  );
};

export default LeadersListTableView;
