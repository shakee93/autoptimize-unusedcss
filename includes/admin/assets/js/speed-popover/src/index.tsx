import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

let el = document.getElementById('rl-node-wrapper') as HTMLElement

if (!el) {
    console.error('RapidLoad: admin node is missing');
}

const root = ReactDOM.createRoot(
  el
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
