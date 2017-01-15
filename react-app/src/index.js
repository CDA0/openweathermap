import React from 'react';
import ReactDOM from 'react-dom';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import App from './App';

const config = { apiKey: "b2e84cc56524b139a761c420392095b8" }

ReactDOM.render(<App config={config}/>, document.getElementById("app"));
