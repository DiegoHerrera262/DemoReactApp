
import './App.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import CreateZoneLeaderForm from './components/CreateZoneLeaderForm';
// import UpdateZoneLeaderForm from './components/UpdateZoneLeaderForm';
import UpdateZoneLeaderView from './components/UpdateZoneLeaderView';
import CreateZoneLeaderView from './components/CreateZoneLeaderView';
import LeadersListTableView from './components/LeadersListTableView';
import CreateClientView from './components/CreateClientView';
import ClientsTable from './components/ClientsTable';
import UpdateClientView from './components/UpdateClientView';
import ClientsDetailView from './components/ClientsDetailView';

const Headers = [
  {
    accessor : 'userId',
    header : 'Id Usuario'
  },
  {
    accessor : 'id',
    header : 'Id'
  },
  {
    accessor : 'title',
    header : 'Título'
  },
  {
    accessor : 'completed',
    header : 'Completado'
  }
];

const MessageButton = (props) => {
  const { message, id } = props
  return (
    <button
     onClick={() => {alert(`${message} : ${id}`)}}
     style={{
       fontSize: '0.1em',
       backgroundColor: 'white',
       border: '1px solid #272741',
       borderRadius: '5px',
       color: '#272741'
     }}
    >
      {`${message}`}
    </button>
  );
}

function HomePage() {
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    const fetchFakeData = async () => {
      const res = await axios.get('https://jsonplaceholder.typicode.com/todos');
      setDataset(res.data);
    }
    fetchFakeData();
  }, [])

  return (
    <>
    {
      dataset.length === 0 && (
        <div>
          Cargando...
        </div>
      )
    }
    {
      dataset.length > 0 && (
        <ClientsTable 
          dataset={dataset}
          Headers={Headers}
          downloadFileName={'SomeTable'}
          pageSize={10}
          identifier={'id'}
          actions={[
            {
              Component : MessageButton,
              props : {
                message : 'Editar',
              }
            },
            {
              Component : MessageButton,
              props : {
                message : 'Eliminar',
              }
            }
          ]}
        />
      )
    }
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div>
        {/*
        <ul>
          <Link to='/'>
            <button type="button">
              Home
            </button>
          </Link>
          <Link to='/leaders'>
            <button type="button">
              Lideres
            </button>
          </Link>
        </ul>
        */}
        <Switch>
          <Route 
            exact path='/' 
            render={() => <HomePage />} 
          />

          <Route 
            exact path='/leaders' 
            render={() => <LeadersListTableView />} 
          />
          <Route
            exact path='/leaders/create'
            render={() => <CreateZoneLeaderView />}
          />
          <Route
            exact path='/leaders/update/:id'
            render={(props) => <UpdateZoneLeaderView leaderId={props.match.params.id} />}
          />

          <Route
            exact path='/clients/create'
            render={() => <CreateClientView />}
          />

          <Route
            exact path='/clients/update/:id'
            render={(props) => <UpdateClientView clientId={props.match.params.id} />}
          />

          <Route
            exact path='/clients/detail/:id'
            render={(props) => <ClientsDetailView clientId={props.match.params.id} />}
          />

        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
