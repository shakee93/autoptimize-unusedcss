import React, {useEffect, useState, useCallback, useRef} from 'react';
import {CheckCircleIcon, XCircleIcon as SolidXCircleIcon} from "@heroicons/react/24/solid";
import {Loader, Monitor, RefreshCw} from "lucide-react";
import {FaceSmileIcon, FaceFrownIcon, QueueListIcon, ArrowPathIcon,Bars3BottomLeftIcon , ArrowPathRoundedSquareIcon, XCircleIcon as OutlineXCircleIcon} from "@heroicons/react/24/outline";
import {useAppContext} from "../context/app";
import {optimizerData} from "../store/app/appSelector";
import CountdownTimer from './ui/CountdownTimer';
import {ThunkDispatch} from "redux-thunk";
import {useDispatch, useSelector} from "react-redux";
import useCommonDispatch from "hooks/useCommonDispatch";
import {AppAction, RootState} from "../store/app/appTypes";
import {changeReport, fetchData, getCSSStatus} from "../store/app/appActions";
import {setCommonState} from "../store/common/commonActions";
import Loading from "components/loading";
import {m, AnimatePresence, motion} from "framer-motion";
import {Button} from "components/ui/button";
import {cn} from "lib/utils";
import NextSteps from "components/next-steps";
import Confetti from 'react-confetti'
import ApiService from "../services/api";
import {toast} from "./ui/use-toast";
import {Label} from "./ui/label";

const OptimizerInProgress = () => {

    const {data, loading, error, settings} = useSelector(optimizerData);
    const [fetchCalled, setFetchCalled] = useState(false);
    const {options, savingData, setShowInprogress} = useAppContext();
    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const url = options?.optimizer_url;
    const {activeReport, cssStatus} = useSelector((state: RootState) => state.app);
    const {inProgress, settingsMode} = useCommonDispatch()
    const loadingStatuses = ['failed', 'queued', 'processing'];
    const intervalRef = useRef<NodeJS.Timer | null>(null);
    const [loadingRegen, setLoadingRegen] = useState('')

    const [checkCircleCount, setCheckCircleCount] = useState(0);
    const [confettiStatus, setConfettiStatus] = useState(false);

    const filteredSettings = settings?.filter(setting => {
        return setting.inputs.some(input => input.control_type === "checkbox" && input.value === true);
    });

    const includesStatusSettings = (string: string, substrings: string[]): boolean => {
        return substrings.some(substring => string.includes(substring));
    };

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        dispatch(getCSSStatus(options, url, ['uucss', 'cpcss']));
        localStorage.setItem('settingsMode', settingsMode as settingsMode);
    }, [dispatch]);

    useEffect(() => {
    }, [cssStatus]);

    useEffect(() => {

        if (!filteredSettings) return;

        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => {
                if (prevIndex === filteredSettings.length - 1) {
                    clearInterval(interval);
                    return prevIndex;
                }
                return prevIndex + 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [filteredSettings]);

    const [statusSent, setStatusSent] = useState(false);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            const statusNeedsUpdate = filteredSettings?.some(setting => {
                if ((includesStatusSettings(setting.name, ['Critical CSS']) && cssStatus?.cpcss?.status !== 'success') ||
                    (includesStatusSettings(setting.name, ['Unused CSS']) && cssStatus?.uucss?.status !== 'success')) {
                    return true;
                }
                return false;
            });

            if (statusNeedsUpdate && !statusSent) {
                dispatch(getCSSStatus(options, url, ['uucss', 'cpcss']));
                setStatusSent(true);

                setTimeout(() => {
                    setStatusSent(false);
                }, 9000);
            }
        }, 10000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [dispatch, cssStatus, filteredSettings, options, url, statusSent]);


    useEffect(() => {

        if (!filteredSettings) return;

        let count = 0;
        for (let index = 0; index < filteredSettings.length; index++) {
            const setting = filteredSettings[index];
            if (includesStatusSettings(setting.name, ['Critical CSS']) && cssStatus?.cpcss?.status !== 'success' || includesStatusSettings(setting.name, ['Unused CSS']) && cssStatus?.uucss?.status !== 'success') {
                continue;
            }

            if (index <= currentIndex) {
                count++;
            }
        }
        setCheckCircleCount(count);


    }, [filteredSettings, currentIndex]);


    useEffect(() => {
        if (checkCircleCount == filteredSettings?.length) {
            setConfettiStatus(true)

            const timer = setTimeout(() => {
                setConfettiStatus(false);
                // setShowInprogress(false);
                // dispatch(setCommonState('inProgress', false))
                // dispatch(fetchData(options, url, true));
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [checkCircleCount]);

    const checkStatusCondition = (name: string) => {
        return includesStatusSettings(name, ['Critical CSS']) && cssStatus?.cpcss?.status !== 'success' || includesStatusSettings(name, ['Unused CSS']) && cssStatus?.uucss?.status !== 'success'
    };


    const extractErrorMessage = (errorMessage: any)=> {
        const unserializeData: any = {};
        // Regular expression to match PHP serialized data format
        const regex = /s:\d+:"([^"]+)";s:(\d+):"([^"]+)";/g;

        let match;
        while ((match = regex.exec(errorMessage)) !== null) {
            const key = match[1];
            const value = match[3];
            unserializeData[key] = value;
        }

        return unserializeData.message;
    };

    const settingsMap = {
        'Unused CSS': 'Stripping off Unused CSS',
        'Delay Javascript': 'Delaying JavaScript files',
        'Lazy Load Iframes': 'Lazy-loading Iframes',
        'Serve next-gen Images': 'Serving Images in Next-Gen formats(AVIF, WEBP)',
        'RapidLoad CDN': 'Initializing RapidLoad CDN',
        'Critical CSS': 'Generating Critical CSS',
        'Self Host Google Fonts': 'Self-Hosting Google Fonts',
        'Defer Javascript': 'Deferring JavaScript files',
        'Lazy Load Images': 'Lazy-Loading Images',
        'Minify CSS': 'Minifying CSS',
        'Minify Javascript': 'Minifying JavaScript',
        'Page Cache': 'Generating Page Cache',
        'Exclude Above-the-fold Images from Lazy Load': 'Excluding Above-the-Fold Images from Lazy Load',
        'Add Width and Height Attributes': 'Adding Width and Height attributes for Images',
    };

    const getSettings = (name: any) => {
        for (const [key, value] of Object.entries(settingsMap)) {
            if (name.includes(key)) {
                return value;
            }
        }
        return null;
    };


    const buttonSubmit = async (regen : any) => {

        setLoadingRegen(regen)

            const query = 'action='+ regen +'&job_type=url&clear=false&immediate=true&url='+ url
            try {

                const api = new ApiService(options, query)
                await api.post()

                toast({
                    description: <div className='flex w-full gap-2 text-center'>Your action is successful <CheckCircleIcon className='w-5 text-green-600'/></div>,
                })

            } catch (error: any) {

                toast({
                    description: <div className='flex w-full gap-2 text-center'>{error.message} <SolidXCircleIcon className='w-5 text-red-600'/></div>,
                })
            }
        setLoadingRegen('')

    }

    const cssErrors = {
        'Critical CSS': {
            status: cssStatus?.cpcss?.status,
            error: cssStatus?.cpcss?.error,
            regenAction: 'cpcss_purge_url',
            buttonText: 'Regenerate Critical CSS',
        },
        'Unused CSS': {
            status: cssStatus?.uucss?.status,
            error: cssStatus?.uucss?.error,
            regenAction: 'rapidload_purge_all',
            buttonText: 'Regenerate Unused CSS',
        },
    };



    return (
        <m.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{
                ease: 'linear',
                duration: 0.5,
            }}>

            <div className='py-20 pt-32 grid justify-center	'>
                <h2 className='px-32 mb-8 font-medium text-xl text-brand-700'> {(checkCircleCount == filteredSettings?.length) ? "🎉 Congratulations, Optimization Completed!" : "Optimization Summary and Actions"}   </h2>
                <div className='flex gap-8 px-24'>
                    <div
                        className="mb-3.5 rounded-[40px] min-w-[580px] dark:bg-brand-950 bg-brand-0 dark:hover:border-brand-700/70 hover:border-brand-400/60 ">

                        {(checkCircleCount == filteredSettings?.length) &&
                            <Confetti
                                numberOfPieces={150}
                                tweenDuration={3000}
                                recycle={confettiStatus}
                            />
                        }

                        <div className="inline-block border-b w-full">
                            <div className="space-y-5 px-10 py-6">
                                <div className="flex gap-4 items-center">
                        <span
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-200/50">
                            {checkCircleCount == filteredSettings?.length ?
                                <><CheckCircleIcon className="w-7 h-7 fill-green-600"/></> : (
                                    <Loader className='w-5 animate-spin'/>
                                )}
                        </span>
                                    <div className='flex flex-col '>
                                        <h3 className='text-lg font-medium'>Optimization {filteredSettings?.length === checkCircleCount ? 'Completed' : 'Progress'}</h3>
                                        <p className="text-gray-500">{checkCircleCount} out
                                            of {filteredSettings?.length} steps are completed...</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 px-10 pb-8 pt-5">

                            {filteredSettings?.map((setting, index: number) => (
                                <AnimatePresence key={index}>
                                    {index <= currentIndex && (
                                        <motion.div
                                            initial={{opacity: 0, y: 20}}
                                            animate={{opacity: 1, y: 0}}
                                            key={setting.name + index + '-div1'} className="font-medium">
                                            <div className="flex gap-2 items-center relative">
                                                <div
                                                    className="inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-200/50">
                                                    <React.Fragment key={index}>
                                                        {checkStatusCondition(setting.name) ? (
                                                            // <Loader className='w-5 animate-spin'/>
                                                            (['Critical CSS', 'Unused CSS'] as CssErrorKeys[]).some((key) =>
                                                                setting.name.includes(key) && cssErrors[key].status === 'failed'
                                                            ) ? (
                                                                <SolidXCircleIcon className='w-7 h-7 fill-red-600'/>
                                                            ) : (
                                                                <Loader className='w-5 animate-spin'/>
                                                            )

                                                        ) : (
                                                            index <= currentIndex ? (
                                                                <CheckCircleIcon className="w-7 h-7 fill-green-600"/>
                                                            ) : (
                                                                <Loader className='w-5 animate-spin'/>
                                                            )
                                                        )}
                                                    </React.Fragment>

                                                </div>

                                                <h1 className="text-base">
                                                    {getSettings(setting.name)}
                                                </h1>
                                            </div>
                                            {(['Critical CSS', 'Unused CSS'] as CssErrorKeys[]).map((key) => (
                                                setting.name.includes(key) && cssErrors[key].status === 'failed' && (
                                                    <>
                                                    <div
                                                        className="relative grid font-medium text-sm dark:bg-brand-900 border-2 border-red-500 w-fit rounded-xl items-center py-1.5 px-1.5 ml-9"
                                                        key={key}
                                                    >
                                                        <div className="flex justify-between">
                                                              <span className="flex items-center gap-1">
                                                                <OutlineXCircleIcon className='w-6 h-6 text-red-600'/>
                                                                Failed to generate {key.toLowerCase()}
                                                              </span>
                                                            <Button
                                                                className='flex gap-2 border-0 rounded-xl h-7 text-blue-400 text-xs hover:bg-inherit hover:text-blue-4000'
                                                                onClick={e => window.open('https://docs.rapidload.io/', '_blank')}
                                                                variant='outline'
                                                            >
                                                                <Bars3BottomLeftIcon className='w-5 h-5 text-blue-400'/>
                                                                Learn more
                                                            </Button>
                                                        </div>

                                                        <span className="text-gray-500 ml-7">
                                                            {cssErrors[key].error?.code} {cssErrors[key].error?.message} errors when crawling your webpage
                                                        </span>


                                                    </div>

                                                        <div className='flex text-left w-full mt-2 gap-2 ml-9 items-center'>
                                                            {/*{cssErrors[key].error?.code === 403 && (*/}
                                                            {/*        <Button*/}
                                                            {/*            disabled={loadingRegen}*/}
                                                            {/*            className='flex gap-2 rounded-xl h-7 text-gray-500 text-xs'*/}
                                                            {/*            onClick={e => buttonSubmit(cssErrors[key].regenAction)}*/}
                                                            {/*            variant='outline'*/}
                                                            {/*        >*/}
                                                            {/*            {loadingRegen &&*/}
                                                            {/*                <Loader className='w-4 animate-spin -ml-1'/>}*/}
                                                            {/*            Learn more*/}
                                                            {/*        </Button>*/}
                                                            {/*)}*/}

                                                            <span className="text-gray-500 text-xs">
                                                                Quick Actions:
                                                            </span>

                                                            {cssErrors[key].error?.code === 403 && (
                                                                <Button
                                                                    disabled={loadingRegen == cssErrors[key].regenAction}
                                                                    className='flex gap-1 text-gray-500 h-8 text-xs px-2.5 bg-brand-200/50 border-0'
                                                                    onClick={e => buttonSubmit(cssErrors[key].regenAction)}
                                                                    variant='outline'
                                                                >
                                                                    {loadingRegen == cssErrors[key].regenAction ? (
                                                                        <ArrowPathIcon className="h-4 w-4 text-gray-500 -ml-1 animate-spin" />
                                                                    ) : (
                                                                        <ArrowPathIcon className="h-4 w-4 text-gray-500 -ml-1" />
                                                                    )}

                                                                    {cssErrors[key].buttonText}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </>
                                                )
                                            ))}

                                        </motion.div>
                                    )}

                                </AnimatePresence>
                        ))}
                    </div>


                </div>
                <div className='flex flex-col justify-start items-start '>

                    <NextSteps status={checkCircleCount == filteredSettings?.length}/>

                    {/*<div>*/}
                    {/*    <Loading className={'py-4 text-brand-500'} customMessage={"Analyzing in"} url={url}*/}
                    {/*             countDown={true}/>*/}
                    {/*    <div className='flex justify-start'>*/}
                    {/*        <Button*/}
                    {/*            onClick={() => {*/}
                    {/*                dispatch(fetchData(options, url, true))*/}
                    {/*                dispatch(setCommonState('inProgress', false))*/}
                    {/*                setShowInprogress(false);*/}
                    {/*            }}*/}
                    {/*            className={`flex overflow-hidden select-none relative text-sm h-12 rounded-[14px] gap-2 items-center px-4 h-full`}>*/}
                    {/*            <RefreshCw className={cn(*/}
                    {/*                'w-4',*/}
                    {/*                loading && 'animate-spin'*/}
                    {/*            )}/>*/}
                    {/*            Analyze*/}
                    {/*        </Button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}


                </div>
            </div>
        </div>

</m.div>

)
    ;
}

export default OptimizerInProgress;
