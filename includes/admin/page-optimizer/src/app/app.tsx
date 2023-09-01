import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import PageOptimizer from "app/page-optimizer";
import SpeedPopover from "app/speed-popover";
import {useOptimizerContext} from "../context/root";
import {ThunkDispatch} from "redux-thunk";
import {useDispatch, useSelector} from "react-redux";
import {AppAction, AppState, RootState} from "../store/app/appTypes";
import {fetchData} from "../store/app/appActions";
import {Toaster} from "components/ui/toaster";

const App = ({ popup, _showOptimizer = false }: {
    popup?: HTMLElement | null,
    _showOptimizer?: boolean
}) => {
    const [popupNode, setPopupNode] = useState<HTMLElement | null>(null);
    const {showOptimizer, setShowOptimizer, options} = useOptimizerContext()

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const {activeReport, mobile, desktop} = useSelector((state: RootState) => state.app);

    useEffect(() => {
        if (popup) {
            const node = popup

            if (node) {
                node.innerHTML = ''
                setPopupNode(node);
            }
        }
    }, [popup]);

    useEffect(() => {

        if (_showOptimizer) {
            setShowOptimizer(true)
        }

        document.body.classList.add('rl-page-optimizer-loaded');
    }, [])

    const popover = popupNode &&
        ReactDOM.createPortal(<SpeedPopover/>, popupNode) ;

    useEffect(() => {
        // load initial data
        dispatch(fetchData(options, options.optimizer_url, false))
    }, [dispatch, activeReport]);

    return (
        <div>
            {popover}
            {showOptimizer && <PageOptimizer/>}
            <Toaster/>
        </div>
    );
}

export default App;
