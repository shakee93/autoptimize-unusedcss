import React, {useEffect} from 'react';
import SpeedInsights from "./components/speed-insights";
import WebFont from 'webfontloader';

declare global {
    interface Window {
        rapidload: any;
    }
}

function App() {

    let root = window.rapidload?.plugin_url

    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Lexend:wght@100;200;300;400;700&display=swap'],
            },
        });
    }, [])

    return (
        <div className={`rl-react-node-wrapper font-sans ${!root ? 'flex flex-col justify-center text-center ' : ''}`}>

            <SpeedInsights root={root}>
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
