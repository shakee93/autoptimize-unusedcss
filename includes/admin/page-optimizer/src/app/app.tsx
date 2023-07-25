import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import PageOptimizer from "app/page-optimizer";
import SpeedPopover from "app/speed-popover";
import {useOptimizerContext} from "../context/root";
import {ThunkDispatch} from "redux-thunk";
import {AppAction, AppState, fetchData} from "../store/reducers/appReducer";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store/reducers";

const App = ({ is_popup } : {
    is_popup: boolean
}) => {
    const [popupNode, setPopupNode] = useState<HTMLElement | null>(null);
    const { showOptimizer,options } = useOptimizerContext()

    useEffect(() => {
        if (is_popup) {
            // We're assuming here that 'rl-node-wrapper' is the id of the second root
            const node = document.getElementById('rl-node-wrapper')

            if (node) {
                node.innerHTML = ''
                setPopupNode(node);
            }
        }
    }, [is_popup]);

    const popover = is_popup && popupNode ? ReactDOM.createPortal(<SpeedPopover />, popupNode) : <SpeedPopover />;

    const dispatch: ThunkDispatch<AppState, unknown, AppAction> = useDispatch();
    const { data, error } = useSelector((state: RootState) => state.app);

    useEffect(() => {

        if (options?.ajax_url) {
            let url = options.ajax_url + '?action=fetch_page_speed&url=' + options.optimizer_url
            dispatch(fetchData(url));
        }

    }, [dispatch]);

    return (
        <div>
            {popover}
            { showOptimizer && <PageOptimizer/> }
        </div>
    );
}

export default App;
