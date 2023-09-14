import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import PageOptimizer from "app/page-optimizer";
import SpeedPopover from "app/speed-popover";
import {useAppContext} from "../context/app";
import {ThunkDispatch} from "redux-thunk";
import {useDispatch, useSelector} from "react-redux";
import {AppAction, AppState, RootState} from "../store/app/appTypes";
import {fetchData} from "../store/app/appActions";
import {Toaster} from "components/ui/toaster";
import WebFont from "webfontloader";

const App = ({ popup, _showOptimizer = false }: {
    popup?: HTMLElement | null,
    _showOptimizer?: boolean
}) => {
    const [popupNode, setPopupNode] = useState<HTMLElement | null>(null);
    const {showOptimizer, setShowOptimizer, mode, options} = useAppContext()
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
    const [mounted, setMounted] = useState(false)

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const {activeReport, mobile, desktop} = useSelector((state: RootState) => state.app);

    useEffect(() => {

        if (_showOptimizer) {
            setShowOptimizer(true)
        }

        WebFont.load({
            google: {
                families: ['Lexend:wght@100;200;300;400;700&display=swap'],
            },
        });

        document.body.classList.add('rl-page-optimizer-loaded');
        document.body.classList.add('rpo-loaded');

        if (popup) {
            document.body.classList.add('rpo-loaded:with-popup');
        }

        setTimeout(() => {
            setMounted(true)
        }, 50)
    }, [])


    useEffect(() => {
        // load initial data
        dispatch(fetchData(options, options.optimizer_url, false))
    }, [dispatch, activeReport]);

    return (
        <>
            {(mounted && showOptimizer) && <PageOptimizer/>}
        </>
    );
}

export default App;
