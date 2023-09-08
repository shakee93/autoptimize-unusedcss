import React, {useEffect} from 'react';
import SpeedInsights from "./components/speed-insights";
import WebFont from 'webfontloader';
import {useOptimizerContext} from "../../context/root";

function SpeedPopover({ shadow }: { shadow: ShadowRoot }) {

    const { options } = useOptimizerContext()



    return (
        <div id='rl-react-popup-wrapper' className={`rl-react-node-wrapper font-sans ${!options ? 'flex flex-col justify-center text-center ' : ''}`}>

            <SpeedInsights shadow={shadow}>
                {(options && options.plugin_url) && (
                    <span className="rl-icon">
                    <img src={options?.plugin_url + "/assets/images/logo-icon-light.svg"} alt="RapidLoad logo"/>
                </span>
                )}
                <span className="rl-label">RapidLoad</span>
            </SpeedInsights>

        </div>
    );
}

export default SpeedPopover;
