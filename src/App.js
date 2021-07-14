
import './App.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import CreateZoneLeaderForm from './components/CreateZoneLeaderForm';
// import UpdateZoneLeaderForm from './components/UpdateZoneLeaderForm';
import UpdateZoneLeaderView from './components/UpdateZoneLeaderView';
import CreateZoneLeaderView from './components/CreateZoneLeaderView';
import LeadersListTableView from './components/LeadersListTableView';
import ClientsTable from './components/ClientsTable';
import  Login from  './components/Login/index'
import Register from './components/register/index'
// const leaderId = 29;
const mockEntry1 = {
  name : 'Foo',
  lastName : 'Bar',
  age : 31,
  job : 'Developer'
}
const mockEntry2 = {
  name : 'Foo2',
  lastName : 'Bar2',
  age : 31,
  job : 'Developer2'
}
const mockData = [];
for (let i = 0; i < 10; i++) {
  mockData.push(mockEntry1)
}
for (let i = 0; i < 10; i++) {
  mockData.push(mockEntry2)
}

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
          pageSize={10}
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
            exact path='/login'
            render={() => <Login />}
          />
          <Route
            exact path='/register'
            render={() => <Register />}
          />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
