import React, {ReactNode} from "react";
import store from "./store";
import RootProvider from "./context/root";
import {AppProvider} from "./context/app";
import {TooltipProvider} from "components/ui/tooltip";
import {domAnimation, LazyMotion} from "framer-motion";
import ShadowRoot from "components/shadow-dom";
import stylesUrl from "./index.css";
import SpeedPopover from "app/speed-popover";
import App from "app/app";
import {Provider} from "react-redux";
import mode from "app/page-optimizer/components/Mode";


interface ProvidersProps {
    children: ReactNode
    showOptimizer?: boolean
    popup: HTMLElement | null
    mode: RapidLoadOptimizerModes,
    modeData?: RapidLoadOptimizerModeData
    global: boolean
}

const Providers = ({children, mode, modeData, showOptimizer, global, popup}: ProvidersProps) => {

    return <>
        <Provider store={store}>
            <RootProvider>
                <AppProvider global={global}
                             initShowOptimizerValue={showOptimizer}
                             mode={mode}
                             modeData={modeData}>
                    <TooltipProvider>
                        <LazyMotion features={domAnimation}>
                            {children}
                        </LazyMotion>
                    </TooltipProvider>
                </AppProvider>
            </RootProvider>
        </Provider>
    </>
}

export default Providers