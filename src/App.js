
import './App.css';
import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
// import CreateZoneLeaderForm from './components/CreateZoneLeaderForm';
// import UpdateZoneLeaderForm from './components/UpdateZoneLeaderForm';
import UpdateZoneLeaderView from './components/UpdateZoneLeaderView';
import CreateZoneLeaderView from './components/CreateZoneLeaderView';
import LeadersListTableView from './components/LeadersListTableView';
import LeaderZoneMap from './components/LeaderZoneMap';

// const leaderId = 29;

function HomePage() {
  return (
    <LeaderZoneMap
      isMarkerShown
      googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `400px` }} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
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
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
