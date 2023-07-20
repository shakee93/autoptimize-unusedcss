import React from 'react';
import logo from './logo.svg';
import './App.css';

declare global {
    interface Window {
        rapidload: any;
    }
}

function App() {

    let image = window.rapidload?.plugin_url + "/assets/images/logo-icon-light.svg"

    return (
        <div className="rl-react-node-wrapper">
            <span className="rl-icon">
                <img src={image} alt=""/>
            </span>
            <span className="rl-label">RapidLoad</span>
        </div>
    );
}

export default App;
