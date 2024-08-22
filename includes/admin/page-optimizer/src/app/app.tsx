import React, {Suspense, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import PageOptimizer from "app/page-optimizer";
import SpeedPopover from "app/speed-popover";
import {useAppContext} from "../context/app";
import {ThunkDispatch} from "redux-thunk";
import {useDispatch, useSelector} from "react-redux";
import {AppAction, AppState, RootState} from "../store/app/appTypes";
import {fetchData, getTestModeStatus} from "../store/app/appActions";
import {Toaster} from "components/ui/toaster";
import {AnimatePresence} from "framer-motion";
import {useRootContext} from "../context/root";
import {setCommonState} from "../store/common/commonActions";
import useCommonDispatch from "hooks/useCommonDispatch";
import {toBoolean} from "lib/utils";
import Bugsnag from "@bugsnag/js";

const AppTour = React.lazy(() => import( 'components/tour'))
const InitTour = React.lazy(() => import('components/tour/InitTour'))


const App = ({popup, _showOptimizer = false}: {
    popup?: HTMLElement | null,
    _showOptimizer?: boolean
}) => {

    const [popupNode, setPopupNode] = useState<HTMLElement | null>(null);
    const {showOptimizer, setShowOptimizer, mode, options, setShowInprogress} = useAppContext()
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
    const [mounted, setMounted] = useState(false)

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const {activeReport, mobile, desktop} = useSelector((state: RootState) => state.app);
    const {isDark } = useRootContext()
    const initialTestMode = window.rapidload_optimizer ? toBoolean(window.rapidload_optimizer.test_mode) : false;

    useEffect(() => {

        if (_showOptimizer) {
            setShowOptimizer(true)
        }

        document.body.classList.add('rl-page-optimizer-loaded');
        document.body.classList.add('rpo-loaded');

        if (popup) {
            document.body.classList.add('rpo-loaded:with-popup');
        }

        setTimeout(() => {
            setMounted(true)
        }, 50);

        Bugsnag.leaveBreadcrumb('Titan Loaded')

    }, []);

    useEffect(() => {

        if (showOptimizer) {
            Bugsnag.leaveBreadcrumb('Titan Opened');
        } else {
            Bugsnag.leaveBreadcrumb('Titan Closed');
        }

    }, [showOptimizer])


    useEffect(() => {
        // load initial data
        dispatch(fetchData(options, options.optimizer_url, false));
        dispatch(setCommonState('testModeStatus', initialTestMode));
        //dispatch(setCommonState('inProgress', false))
        setShowInprogress(false);
    }, [dispatch, activeReport]);


    return (
        <AnimatePresence>
            {(mounted && showOptimizer) &&
                <>
                    <Suspense>
                        <AppTour isDark={isDark}>
                            <InitTour mode={mode}/>
                        </AppTour>
                    </Suspense>

                    <PageOptimizer/>

                </>
            }
        </AnimatePresence>
    );
}

export default App;
