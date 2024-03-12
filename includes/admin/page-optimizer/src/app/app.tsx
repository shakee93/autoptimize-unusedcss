import React, {Suspense, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import PageOptimizer from "app/page-optimizer";
import SpeedPopover from "app/speed-popover";
import {useAppContext} from "../context/app";
import {ThunkDispatch} from "redux-thunk";
import {useDispatch, useSelector} from "react-redux";
import {AppAction, AppState, RootState} from "../store/app/appTypes";
import {fetchData} from "../store/app/appActions";
import {Toaster} from "components/ui/toaster";
import {AnimatePresence} from "framer-motion";
import {useRootContext} from "../context/root";
import {setCommonState} from "../store/common/commonActions";

const AppTour = React.lazy(() => import( 'components/tour'))
const InitTour = React.lazy(() => import('components/tour/InitTour'))



const App = ({popup, _showOptimizer = false}: {
    popup?: HTMLElement | null,
    _showOptimizer?: boolean
}) => {

    const [popupNode, setPopupNode] = useState<HTMLElement | null>(null);
    const {showOptimizer, setShowOptimizer, mode, options} = useAppContext()
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
    const [mounted, setMounted] = useState(false)

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const {activeReport, mobile, desktop} = useSelector((state: RootState) => state.app);
    const {isDark } = useRootContext()


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
        }, 50)
    }, [])


    useEffect(() => {
        // load initial data
        dispatch(fetchData(options, options.optimizer_url, false))
        dispatch(setCommonState('inProgress', false))
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
