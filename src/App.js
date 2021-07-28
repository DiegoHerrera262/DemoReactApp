import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import CreateZoneLeaderForm from './components/CreateZoneLeaderForm';
// import UpdateZoneLeaderForm from './components/UpdateZoneLeaderForm';
import Login from "./components/Login";
import Register from "./components/register";
import UpdateZoneLeaderView from "./components/ViewZoneLeadersUpdate";
import CreateZoneLeaderView from "./components/ViewZoneLeadersCreate";
import LeadersListTableView from "./components/ViewZoneLeadersMain";
import CreateClientView from "./components/ViewClientsCreate";
import ClientsTable from "./components/GenericTable";
import UpdateClientView from "./components/ViewClientsUpdate";
import ClientsDetailView from "./components/ViewClientsDetail";
import ClientsMainView from "./components/ViewClientsMain";
import CreateBonusView from "./components/ViewBonusCreate";
import CreateProducts from "./components/Products/createProducts/index";
import CreateSupplier from "./components/suppliers/createSupplier/index";
import ViewBonusUpdate from "./components/ViewBonusUpdate";
import { getLeaderById } from "./endpoint/zoneLeaders.methods";
import  SideBar from './components/lateralMenu/SideBar'

const Headers = [
  {
    accessor: "userId",
    header: "Id Usuario",
  },
  {
    accessor: "id",
    header: "Id",
  },
  {
    accessor: "title",
    header: "Título",
  },
  {
    accessor: "completed",
    header: "Completado",
  },
];

const MessageButton = (props) => {
  const { message, id } = props;
  return (
    <button
      onClick={() => {
        alert(`${message} : ${id}`);
      }}
      style={{
        fontSize: "0.1em",
        backgroundColor: "white",
        border: "1px solid #272741",
        borderRadius: "5px",
        color: "#272741",
      }}
    >
      {`${message}`}
    </button>
  );
};

function HomePage() {
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    const fetchFakeData = async () => {
      const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
      setDataset(res.data);
    };
    fetchFakeData();
  }, []);

  const handleClick = async () => {
    const res = await getLeaderById(2);
    console.log(typeof res);
  };

  return (
    <>
      {dataset.length === 0 && <div>Cargando...</div>}
      {dataset.length > 0 && (
        <>
          <button onClick={handleClick}>Test Leaders Api</button>
          <ClientsTable
            dataset={dataset}
            Headers={Headers}
            downloadFileName={"SomeTable"}
            pageSize={10}
            identifier={"id"}
            actions={[
              {
                Component: MessageButton,
                props: {
                  message: "Editar",
                },
              },
              {
                Component: MessageButton,
                props: {
                  message: "Eliminar",
                },
              },
            ]}
          />
        </>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" render={() => <ClientsMainView />} />

          {/* user reg routes */}

          <Route exact path="/login" render={() => <Login />} />
          <Route exact path="/register" render={() => <Register />} />

          {/* Assessors Routes */}

          <Route
            exact
            path="/assessors"
            render={() => <LeadersListTableView />}
          />

          <Route
            exact
            path="/assessors/create"
            render={() => <CreateZoneLeaderView />}
          />

          <Route
            exact
            path="/assessors/update/:id"
            render={(props) => (
              <UpdateZoneLeaderView leaderId={props.match.params.id} />
            )}
          />

          {/* Clients routes */}

          <Route
            exact
            path="/clients"
            render={(props) => <ClientsMainView />}
          />

          <Route
            exact
            path="/clients/create"
            render={() => <CreateClientView />}
          />

          <Route
            exact
            path="/clients/update/:id"
            render={(props) => (
              <UpdateClientView clientId={props.match.params.id} />
            )}
          />

          <Route
            exact
            path="/clients/detail/:id"
            render={(props) => (
              <ClientsDetailView clientId={props.match.params.id} />
            )}
          />

          {/* Bonus routes */}

          <Route
            exact
            path="/bonus/create"
            render={(props) => <CreateBonusView />}
          />

          <Route
            exact
            path="/bonus/update/:id"
            render={(props) => (
              <ViewBonusUpdate bonusId={props.match.params.id} />
            )}
          />

          {/* Products routes */}

          <Route
            exact
            path="/create-products"
            render={() => <CreateProducts />}
          />

          {/* Suppliers routes */}

          <Route
            exact
            path="/create-supplier"
            render={() => <CreateSupplier />}
          />

<Route
            exact
            path="/sidebar"
            render={() => < SideBar />}
          />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
