
import './App.css';
import React from 'react';
// import CreateZoneLeaderForm from './components/CreateZoneLeaderForm';
// import UpdateZoneLeaderForm from './components/UpdateZoneLeaderForm';
// import UpdateZoneLeaderView from './components/UpdateZoneLeaderView';
import CreateZoneLeaderView from './components/CreateZoneLeaderView';

const leaderId = 22;

function App() {
  return (
    <div>
      <CreateZoneLeaderView
        leaderId={leaderId}
      />
    </div>
  );
}

export default App;
