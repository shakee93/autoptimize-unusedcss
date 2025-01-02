import React, { Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import PageOptimizer from "app/page-optimizer";
import dashboard from "app/dashboard";
import SpeedPopover from "app/speed-popover";
import { useAppContext } from "../context/app";
import { ThunkDispatch } from "redux-thunk";
import { useDispatch, useSelector } from "react-redux";
import { AppAction, RootState } from "../store/app/appTypes";
import {fetchPosts, fetchReport, fetchSettings, getTestModeStatus, updateLicense} from "../store/app/appActions";
import { Toaster } from "components/ui/toaster";
import {AnimatePresence, m, motion} from "framer-motion";
import { useRootContext } from "../context/root";
import Header from "app/page-optimizer/components/Header";
import { cn, hasQueryParam } from "lib/utils";
import { setCommonState } from "../store/common/commonActions";
import useCommonDispatch from "hooks/useCommonDispatch";
import {toBoolean, isDev, disableDebugReport, isAdminPage, getOptimizeUrl} from "lib/utils";
import Bugsnag from "@bugsnag/js";
import Dashboard from "app/dashboard";
import Onboard from "app/onboard";
import TestModeSwitcher from "app/page-optimizer/components/TestModeSwitcher";

const AppTour = React.lazy(() => import('components/tour'))
const InitTour = React.lazy(() => import('components/tour/InitTour'))
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "components/ui/dialog";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ContentSelector } from "components/ui/content-selector";
import AppButton from "components/ui/app-button";
import GeneralSettingsTrigger from "app/dashboard/components/GeneralSettingsTrigger";
import OptimzePagesTrigger from "app/dashboard/components/OptimzePagesTrigger";
import OptimizerTableTrigger from "app/dashboard/components/OptimizerTableTrigger";
import ThemeSwitcher from "components/ui/theme-switcher";
import TooltipText from "components/ui/tooltip-text";
import { optimizerData } from "../store/app/appSelector";
import TestModeNotification from "components/ui/test-mode-notification";
import { Circle, MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import OptimizerPagesTable from "app/dashboard/components/OptimizerPagesTable";
import SlideUp from "components/animation/SlideUp";
import StepTwo from "app/onboard/components/StepTwo";
import HermesAIBot from "app/ai-bot";

const App = ({ popup, _showOptimizer = false }: {
    popup?: HTMLElement | null,
    _showOptimizer?: boolean
}) => {

    const [popupNode, setPopupNode] = useState<HTMLElement | null>(null);
    const { showOptimizer, version, setShowOptimizer, mode, options, uucssGlobal } = useAppContext()
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
    const [mounted, setMounted] = useState(false)
    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const { activeReport, allPosts } = useSelector((state: RootState) => state.app);
    const { isDark } = useRootContext()
    const initialTestMode = window.rapidload_optimizer ? toBoolean(window.rapidload_optimizer.test_mode) : false;
    const [open, setOpen] = useState({
        generalSettings: false,
        optimizerTable: false,
        optimizePages: false
    });
    const { headerUrl, onboardCompleted } = useCommonDispatch();
    const { changeTheme } = useRootContext()
    const { testMode, license, data } = useSelector(optimizerData);

    useEffect(() => {


        if (_showOptimizer && isAdminPage || isDev) {
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

        !isDev && !disableDebugReport && Bugsnag.leaveBreadcrumb('Titan Loaded')

    }, []);

    useEffect(() => {

        if (showOptimizer) {
            !isDev && !disableDebugReport && Bugsnag.leaveBreadcrumb('Titan Opened');
        } else {
            !isDev && !disableDebugReport && Bugsnag.leaveBreadcrumb('Titan Closed');
        }

    }, [showOptimizer])


    useEffect(() => {
        const optimizeUrl = getOptimizeUrl();
        dispatch(setCommonState('headerUrl', optimizeUrl));
        console.log("headerUrl: ", headerUrl)
        const initialUrl = data?.loadingExperience?.initial_url
        ? decodeURIComponent(data.loadingExperience.initial_url.replace('?rapidload_preview', ''))
        : null;
        console.log("initialUrl: ", initialUrl)
        // load initial data
        dispatch(fetchReport(options, headerUrl ? headerUrl : options.optimizer_url, false));
        //console.log(activeRoute)
        if(!uucssGlobal?.on_board_complete && !isDev){
            return;
        }
       
        dispatch(fetchSettings(options, headerUrl ? headerUrl : options.optimizer_url, false));
        dispatch(setCommonState('testModeStatus', initialTestMode));
        dispatch(fetchPosts(options));
    }, [dispatch, activeReport]);

    const [showStepTwo, setShowStepTwo] = useState(false);

    useEffect(() => {
        if(!uucssGlobal?.on_board_complete){
            return;
        }

        const updateLicenseAndStore = async () => {
           const response = await dispatch(updateLicense(options));
            const isLicensed = response.data?.licensedDomain;
           // const isLicensed = true;
            if(!isLicensed && uucssGlobal?.on_board_complete == '1'){
                localStorage.removeItem('rapidLoadLicense');
                setShowStepTwo(true);
            }
        };
        updateLicenseAndStore();

    }, [dispatch]);


    useEffect(() => {
        if (license?.licensedDomain) {
            localStorage.setItem('rapidLoadLicense', JSON.stringify(license));
        }
        const storedLicense = localStorage.getItem('rapidLoadLicense');
        if(storedLicense){
           setShowStepTwo(false)
        }

    }, [license]);

    const renderStepTwo = () => {
        return (
            <div className='bg-transparent p-6'>
            <motion.div
                key="stepTwo"
                initial={{x: 100, opacity: 0}}
                animate={{x: 0, opacity: 1}}
                exit={{x: 100, opacity: 0}}
                transition={{duration: 0.2}}
            >
                <StepTwo reconnect={true}/>
            </motion.div>
            </div>
        );
    }
    // const hash = window.location.hash.replace("#", "");
    //  const [activeRoute, setActiveRoute] = useState( hash.length > 0 ? hash : '/');
    //  const [routes, setRoutes] = useState( [
    //      {
    //          title: "Dashboard",
    //          id: "/",
    //          component: <Dashboard />
    //      },
    //      {
    //          title: "Optimize",
    //          id: "/optimize",
    //          component: <PageOptimizer/>
    //      }
    //  ])
    //
    //
    //  useEffect(() => {
    //      window.location.hash = '#' + activeRoute
    //  }, [activeRoute])
    //
    //  useEffect(() => {
    //      const validRoute = routes.some(route => route.id === window.location.hash.replace('#', ''))
    //
    //
    //      if (!validRoute) {
    //          setActiveRoute('/')
    //      }
    //
    //  }, [])

    const [activeRoute, setActiveRoute] = useState(window.location.hash.replace("#", "") || "/");
    const [routes, setRoutes] = useState([
        { title: "Dashboard", id: "/", component: <Dashboard /> },
        { title: "Optimize", id: "/optimize", component: <PageOptimizer /> },
        { title: "Onboard", id: "/onboard", component: <Onboard /> },
        { title: "Hermes AI", id: "/hermes-ai", component: <HermesAIBot /> },
    ]);

    // Effect to listen for hash changes
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace("#", "");
            // Extract the base route without query parameters
            const baseRoute = hash.split('?')[0];
            const validRoute = routes.some(route => route.id === baseRoute);
            if (validRoute) {
                setActiveRoute(hash); // Store the full hash including query params
            } else {
                setActiveRoute("/");
            }
        };

        window.addEventListener("hashchange", handleHashChange);
        // Initial check
        handleHashChange();
        
        return () => {
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, [routes]);

    // Modify the route finding logic
    const findRouteComponent = (route: string) => {
        // Extract the base route without query parameters
        const baseRoute = route.split('?')[0];
        return routes.find(r => r.id === baseRoute)?.component || routes[0].component;
    };

    // useEffect(() => {
    //     if (isAdminPage || isDev) {
    //         if (onboardCompleted) {
    //             window.location.hash = activeRoute;
    //         } else if (uucssGlobal?.on_board_complete === undefined || uucssGlobal?.on_board_complete === "") {
    //             window.location.hash = "#/onboard";
    //             setActiveRoute("/onboard");
    //         } else {
    //             window.location.hash = activeRoute;
    //         }
    //     }
    // }, [activeRoute, onboardCompleted]);
    useEffect(() => {
        const hasNonce = hasQueryParam("nonce");

        if (!(isAdminPage || isDev)) return;

        if (onboardCompleted || isDev) {
            window.location.hash = activeRoute;
            return;
        }

        if (!uucssGlobal?.on_board_complete || hasNonce) {
            window.location.hash = "#/onboard";
            setActiveRoute( "/onboard");
            return;
        }
        window.location.hash = activeRoute;
    }, [activeRoute, onboardCompleted]);


    const optimizerTable = {
        title: "Optimize Pages",
        description: "Check out your Optimized Pages details in here.",
        total_jobs: 1000,
    };

    const handleOpenChange = (key: string, isOpen: boolean) => {
        setOpen(prev => ({
            ...prev,
            [key]: isOpen
        }));
    };
    

    return (
        <AnimatePresence>

            {(mounted && showOptimizer) &&
                <>

                    {/*{testMode &&*/}
                    {/*    <TestModeNotification/>*/}
                    {/*}*/}
                    <div className='dark:text-brand-300 text-brand-800 dark:bg-brand-900 bg-[#F0F0F1] '>

                        <Suspense>
                            <AppTour isDark={isDark}>
                                <InitTour mode={mode} />
                            </AppTour>
                        </Suspense>

                        {activeRoute !== "/onboard" && !showStepTwo && (
                        <div className='justify-center flex container'>
                            <header
                                className={cn('container px-2 py-2 flex gap-3 mt-4 justify-between dark:bg-brand-930/80  bg-brand-0 rounded-2xl', testMode && 'ring-2 ring-[#f7b250] ring-offset-0')}>
                                <div className='flex items-center'>
                                    <div className='relative px-2'>
                                        <img className='w-10'
                                            src={options?.page_optimizer_base ? (options?.page_optimizer_base + `/new-logo.svg`) : '/new-logo.svg'}
                                            alt='RapidLoad - #1 to unlock breakneck page speed' />
                                    </div>
                                    <div className='flex'>
                                        <div
                                            data-tour='app-switch'
                                            className='select-none relative flex dark:bg-brand-800 py-0.5 pl-[2px] pr-[8px] rounded-2xl cursor-pointer overflow-hidden'
                                        >
                                            <div
                                                className={`absolute top-1 bottom-1 left-1 bg-brand-200/60 border dark:bg-brand-700 rounded-xl transition-all duration-300 ease-in-out transform ${activeRoute === routes[1].id ? "translate-x-[115%] w-[45%]" : "translate-x-0 w-[55%]"
                                                    }`}
                                            >

                                            </div>

                                            {routes.map((route, i) => {
                                                if (route.id === '/onboard' || route.id === '/hermes-ai') {
                                                    return null;
                                                }
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => setActiveRoute(route.id)}
                                                        className={cn(
                                                            'flex h-10 text-sm z-10 font-medium items-center px-3 gap-2',
                                                            activeRoute === route.id ? 'text-black dark:text-white' : 'text-gray-500'
                                                        )}
                                                    >
                                                        <Circle
                                                            className={cn(
                                                                `w-2 stroke-0 transition-all fill-purple-800 relative inline-flex`,
                                                                activeRoute === route.id ? 'delay-200' : 'opacity-0'
                                                            )}
                                                        />
                                                        {route.title}
                                                    </button>
                                                );
                                            })}

                                        </div>
                                    </div>
                                </div>


                                <div className="flex gap-6 items-center">
                                    <TestModeSwitcher />

                                    <div className="flex items-center gap-1.5">
                                        <GeneralSettingsTrigger open={open.generalSettings} onOpenChange={(isOpen) => handleOpenChange("generalSettings", isOpen)} />
                                        {/*<TooltipText text="Theme">*/}
                                        {/*    <div onClick={e => changeTheme()}>*/}
                                        {/*        <ThemeSwitcher></ThemeSwitcher>*/}
                                        {/*    </div>*/}
                                        {/*</TooltipText>*/}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className='w-8 h-12 flex items-center justify-center'>
                                                <TooltipText className='flex items-center justify-center' asChild={true} text='Add Optimization'>
                                                    <MoreVertical className={cn(
                                                        'h-5 w-5 dark:text-brand-300 text-brand-600 transition-opacity',
                                                    )} />
                                                </TooltipText>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent style={{
                                                width: 200
                                            }} align='end' sideOffset={6}
                                                className='z-[110000] relative min-w-[200px]'>
                                                <DropdownMenuLabel>Additional Options</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => {
                                                    setTimeout(() => {
                                                        handleOpenChange("optimizePages", true)
                                                    }, 100)
                                                }}>
                                                    Optimization
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => {
                                                    setTimeout(() => {
                                                        handleOpenChange("optimizerTable", true)
                                                    }, 100)
                                                }}>
                                                    View Table
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        <OptimzePagesTrigger
                                            open={open.optimizePages}
                                            onOpenChange={(isOpen: boolean) => handleOpenChange("optimizePages", isOpen)}
                                            data={allPosts} />
                                        <OptimizerTableTrigger
                                            open={open.optimizerTable}
                                            onOpenChange={(isOpen: boolean) => handleOpenChange("optimizerTable", isOpen)}
                                            settings={optimizerTable} />
                                    </div>



                                </div>




                            </header>

                        </div>
                        )}
                        {showStepTwo ? (renderStepTwo()):(
                            <SlideUp uuid={activeRoute || routes[0].id}>
                                {findRouteComponent(activeRoute)}
                            </SlideUp>
                        )}


                        {version && (
                            <div className=' container px-6'>
                                <div className='flex border-t-2 justify-between py-6 items-center'>
                                    <div>
                                    <span
                                        className='text-sm dark:text-brand-500 text-brand-400'>Copyright © {new Date().getFullYear()} RapidLoad v{version}</span>
                                    </div>
                                    <div>
                                        {/* <AppButton
                                            onClick={e => changeTheme()}
                                            className='transition-none h-12 px-3 rounded-2xl border-none bg-transparent'
                                            variant='outline'>
                                            <ThemeSwitcher></ThemeSwitcher>
                                        </AppButton> */}
                                    </div>
                                </div>

                            </div>

                        )}
                    </div>
                </>
            }
        </AnimatePresence>
    );
}

export default App;
