import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import PageOptimizer from "app/page-optimizer";
import SpeedPopover from "app/speed-popover";
import {useOptimizerContext} from "../context/root";
import Data from "app/data";

const App = ({ is_popup } : {
    is_popup: boolean
}) => {
    const [popupNode, setPopupNode] = useState<HTMLElement | null>(null);
    const { showOptimizer } = useOptimizerContext()

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

    return (
        <div>
            {popover}
            <Data/>
            { showOptimizer && <PageOptimizer/> }
        </div>
    );
}

export default App;
