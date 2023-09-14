import React, {useEffect} from 'react';
import SpeedInsights from "./components/speed-insights";
import WebFont from 'webfontloader';
import {useAppContext} from "../../context/app";
import {Toaster} from "components/ui/toaster";

function SpeedPopover() {

    const { options } = useAppContext()



    return (
        <div id='rl-react-popup-wrapper' className={`font-sans ${!options ? 'flex flex-col justify-center text-center ' : ''}`}>
            <SpeedInsights>
                {(options && options.plugin_url) && (
                    <span className="rl-icon">
                    <img src={options?.plugin_url + "/assets/images/logo-icon-light.svg"} alt="RapidLoad logo"/>
                </span>
                )}
                <span className="rl-label">RapidLoad</span>
            </SpeedInsights>
            <Toaster/>
        </div>
    );
}

export default SpeedPopover;
