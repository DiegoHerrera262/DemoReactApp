
import './App.css';
import CreateZoneLeaderForm from './components/CreateZoneLeaderForm';
import UpdateZoneLeaderForm from './components/UpdateZoneLeaderForm';

// Default initial values for the form
const defaultInitialValues = {
    name : '',
    lastName : '',
    documentId : '',
    zone : '',
    address : '',
    leaderCode : '',
    email : '',
    cellphone : '',
    endContractDate : '',
}

// Keys for labeling inputs
const labelKeys = {
    name : 'Nombre',
    lastName : 'Apellido',
    documentId : 'Documento de identidad',
    zone : 'Zona',
    address : 'Dirección',
    leaderCode : 'Código de líder',
    email : 'Email',
    cellphone : 'Número celular',
    endContractDate : 'Fecha fin de contrato',
}

const typeKeys = {
    name : 'text',
    lastName : 'text',
    documentId : 'number',
    zone : 'select',
    address : 'text',
    leaderCode : 'number',
    email : 'email',
    cellphone : 'number',
    endContractDate : 'date',
}

const selectValues = {
    zone : [
      '--Elija una zona--',
      'Norte',
      'Sur'
    ]
}

/*
// Map center coordinates
const superVeci = {
  lat : '4.68357', 
  lng : '-74.14443'
}
*/

function App() {
  return (
    <div>
      <CreateZoneLeaderForm
        defaultInitialValues={defaultInitialValues}
        labelKeys={labelKeys}
        typeKeys={typeKeys}
        selectValues={selectValues}
      />
    </div>
  );
}

export default App;
