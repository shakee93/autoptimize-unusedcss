import React, {useEffect} from 'react';
import SpeedInsights from "./components/speed-insights";
import WebFont from 'webfontloader';
import { ReactNode, Dispatch, SetStateAction } from 'react';
import {useOptimizerContext} from "../../context/root";
declare global {
    interface Window {
        rapidload: any;
    }
}

function SpeedPopover() {

    const { options } = useOptimizerContext()

    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Lexend:wght@100;200;300;400;700&display=swap'],
            },
        });
    }, [])

    return (
        <div className={`rl-react-node-wrapper font-sans ${!options ? 'flex flex-col justify-center text-center ' : ''}`}>

            <SpeedInsights>
                {options && (
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
