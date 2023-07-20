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
