import React, {Suspense, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import PageOptimizer from "app/page-optimizer";
import Dashbaord from "app/dashbaord";
import SpeedPopover from "app/speed-popover";
import {useAppContext} from "../context/app";
import {ThunkDispatch} from "redux-thunk";
import {useDispatch, useSelector} from "react-redux";
import {AppAction, AppState, RootState} from "../store/app/appTypes";
import {fetchData} from "../store/app/appActions";
import {Toaster} from "components/ui/toaster";
import {AnimatePresence} from "framer-motion";
import {useRootContext} from "../context/root";
import Header from "app/page-optimizer/components/Header";
import {cn} from "lib/utils";

const AppTour = React.lazy(() => import( 'components/tour'))
const InitTour = React.lazy(() => import('components/tour/InitTour'))



const App = ({popup, _showOptimizer = false}: {
    popup?: HTMLElement | null,
    _showOptimizer?: boolean
}) => {

    const [popupNode, setPopupNode] = useState<HTMLElement | null>(null);
    const {showOptimizer, version, setShowOptimizer, mode, options} = useAppContext()
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
    }, [dispatch, activeReport]);

    const hash = window.location.hash.replace("#", "");
    const [activeRoute, setActiveRoute] = useState( hash.length > 0 ? hash : '/');
    const [routes, setRoutes] = useState( [
        {
            title: "Dashboard",
            id: "/",
            component: <Dashbaord/>
        },
        {
            title: "Optimize",
            id: "/optimize",
            component: <PageOptimizer/>
        }
    ])


    useEffect(() => {
        window.location.hash = '#' + activeRoute
    }, [activeRoute])
    
    useEffect(() => {
        const validRoute = routes.some(route => route.id === window.location.hash.replace('#', ''))


        if (!validRoute) {
            setActiveRoute('/')
        }

    }, [])

    return (
        <AnimatePresence>
            {(mounted && showOptimizer) &&
                <div className='dark:text-brand-300 text-brand-800'>
                    <Suspense>
                        <AppTour isDark={isDark}>
                            <InitTour mode={mode}/>
                        </AppTour>
                    </Suspense>


                    <div className=' z-[1000000] dark:bg-brand-930 bg-brand-50'>
                        <header className='flex gap-8 h-16 items-center border-b'>
                            <div className='relative px-4'>
                                <img className='w-36' src={ options?.page_optimizer_base ? (options?.page_optimizer_base + `/logo.svg`) : '/logo.svg'} alt='RapidLoad - #1 to unlock breakneck page speed'/>
                                {version && (
                                    <span className='absolute text-xxs w-[200px] left-[90px] top-[1px] dark:text-brand-500 text-brand-400'>v{version}</span>
                                )}
                            </div>

                            <div className='flex'>

                                {routes.map((route, i) => (
                                    <button key={i}
                                        onClick={e => setActiveRoute(route.id)}
                                        className={cn(
                                        'px-6 flex-1 h-16 border-l text-sm tracking-wider border-b-2 border-b-transparent',
                                        activeRoute === route.id && 'dark:bg-brand-700 bg-brand-200 dark:border-b-brand-400 border-b-purple-950'
                                    )}>
                                        {route.title}
                                    </button>
                                ))}

                            </div>

                        </header>

                    </div>

                    {routes.find(route => route.id === activeRoute)?.component || routes[0].component}

                </div>
            }
        </AnimatePresence>
    );
}

export default App;
