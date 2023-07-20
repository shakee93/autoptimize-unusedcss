import React from 'react';
import SpeedInsights from "./components/speed-insights";

declare global {
    interface Window {
        rapidload: any;
    }
}

function App() {

    let root = window.rapidload?.plugin_url

    return (
        <div className="rl-react-node-wrapper flex flex-col justify-center text-center cursor-pointer ">

            <SpeedInsights>
                {root && (
                    <span className="rl-icon">
                    <img src={root + "/assets/images/logo-icon-light.svg"} alt="RapidLoad logo"/>
                </span>
                )}
                <span className="rl-label">RapidLoad</span>
            </SpeedInsights>

        </div>
    );
}

export default App;
