import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


/*
REMOVED THE StrictMode in order to avoid
react-google-maps to draw two markers

ReactDOM.render(<React.StrictMode><App /></React.StrictMode>,document.getElementById('root'));
*/

ReactDOM.render(<App />,document.getElementById('root'));