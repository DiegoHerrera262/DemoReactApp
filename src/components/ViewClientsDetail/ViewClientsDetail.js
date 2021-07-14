import React, { useState, useEffect } from "react";
import ClientsTable from "../GenericTable";
import detailStyles from "./ViewClientsDetail.module.css";
import {
  getClientDetailById,
  getClientByIdSells,
  getClientByIdMostBought,
} from "../../endpoint/clients.methods";

import TabPane from "../GenericTabPane";
import CustomTabs from "../GenericCustomTabs";
import StaticMap from "../GenericMarkerMap/GenericMarkerMap";
import RedirectButton from "../GenericRedirectButton";

import mapPin from "../../assets/pin.png";

const ClientsDetailView = (props) => {
  const { clientId } = props;
  const [detailInfo, setDetailInfo] = useState({});
  const [sellsInfo, setSellsInfo] = useState([]);
  const [boughtInfo, setBoughtInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const sellsInfoHeaders = [
    {
      accessor: "id",
      header: "Id",
    },
    {
      accessor: "sellDate",
      header: "Fecha",
    },
    {
      accessor: "value",
      header: "Valor",
    },
    {
      accessor: "ticket",
      header: "Factura",
    },
    {
      accessor: "state",
      header: "Estado",
    },
  ];

  const boughtInfoHeaders = [
    {
      accessor: "id",
      header: "Id",
    },
    {
      accessor: "name",
      header: "Nombre Prod.",
    },
    {
      accessor: "category",
      header: "Categoria",
    },
    {
      accessor: "quantity",
      header: "Cantidad",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setDetailInfo(await getClientDetailById(clientId));
      setSellsInfo(await getClientByIdSells(clientId));
      setBoughtInfo(await getClientByIdMostBought(clientId));
      setIsLoading(false);
    };
    fetchData();
  }, [clientId]);

  if (isLoading) {
    return <div className={detailStyles["loading-div"]}></div>;
  }

  return (
    <div className={detailStyles["view-container"]}>
      <h2>Detalle Cliente</h2>
      <div className={detailStyles["view-wrapper"]}>
        <div className={detailStyles["detail-col"]}>
          <div className={detailStyles["banner-div"]}></div>
          <div className={detailStyles["detail-wrapper"]}>
            <div className={detailStyles["basic-info-col"]}>
              <div className={detailStyles["name-banner"]}>
                {`${detailInfo["basicInfo"]["name"].toUpperCase()}`}
              </div>
              <div className={detailStyles["basic-info-content"]}>
                <p> {`${detailInfo["basicInfo"]["storeAddress"]}`} </p>
                <p> {`${detailInfo["basicInfo"]["locality"]}`} </p>
                <p> {`${detailInfo["basicInfo"]["cellphone"]}`} </p>
                <p> {`${detailInfo["basicInfo"]["email"]}`} </p>
                <p> {`Creado ${detailInfo["basicInfo"]["createdAt"]}`} </p>
              </div>
            </div>
            <div className={detailStyles["sells-col"]}>
              <label className={detailStyles["client-type-label"]}>
                {`${detailInfo["sellingInfo"]["clientType"].toUpperCase()}`}
              </label>
              <label className={detailStyles["client-level-label"]}>
                {`Nivel: ${detailInfo["sellingInfo"]["clientLevel"]}`}
              </label>
              <div className={detailStyles["delivered-info-div"]}>
                <p>
                  ENTREGADOS:{" "}
                  <span
                    className={detailStyles["indicator"]}
                  >{`${detailInfo["sellingInfo"]["deliveredReq"]["number"]}`}</span>
                </p>
                <p>
                  Valor:{" "}
                  <span
                    className={detailStyles["indicator"]}
                  >{`${detailInfo["sellingInfo"]["deliveredReq"]["totalValue"]}`}</span>
                </p>
              </div>
              <div className={detailStyles["returned-total-div"]}>
                DEVUELTOS:{" "}
                <span
                  className={detailStyles["indicator"]}
                >{`${detailInfo["sellingInfo"]["returns"]["number"]}`}</span>
              </div>
              <div className={detailStyles["returned-percent-div"]}>
                % DEVOLUCIÓN:{" "}
                <span
                  className={detailStyles["indicator"]}
                >{`${detailInfo["sellingInfo"]["returns"]["percent"]}`}</span>
              </div>
            </div>
          </div>
          <RedirectButton
            buttonLabel="Gestión"
            buttonStyle={detailStyles["manage-button"]}
            path="/"
          />
          <RedirectButton
            buttonLabel="Nuevo pedido"
            buttonStyle={detailStyles["order-button"]}
            path="/clients/create"
          />
        </div>
        <div className={detailStyles["table-col"]}>
          <CustomTabs className={detailStyles}>
            <TabPane name="Pedidos">
              <ClientsTable
                key={"orders-table-view"}
                dataset={sellsInfo}
                Headers={sellsInfoHeaders}
                downloadFileName={`OrdenesCliente-${clientId}`}
                pageSize={2}
                identifier={"id"}
              />
            </TabPane>
            <TabPane name="Más Comprados">
              <ClientsTable
                key={"boughts-table-view"}
                dataset={boughtInfo}
                Headers={boughtInfoHeaders}
                downloadFileName={`MasVendidosCliente-${clientId}`}
                pageSize={3}
                identifier={"id"}
              />
            </TabPane>
            <TabPane name="Ubicación">
              <StaticMap
                mapContainerStyle={{
                  width: "100%",
                  height: "300px",
                }}
                zoom={11}
                center={{
                  latitude: detailInfo["basicInfo"]["coordinates"].latitude,
                  longitude: detailInfo["basicInfo"]["coordinates"].longitude,
                }}
                markerCoords={{
                  latitude: detailInfo["basicInfo"]["coordinates"].latitude,
                  longitude: detailInfo["basicInfo"]["coordinates"].longitude,
                }}
                className={detailStyles}
                mapPin={mapPin}
              />
            </TabPane>
          </CustomTabs>
        </div>
      </div>
    </div>
  );
};

export default ClientsDetailView;
