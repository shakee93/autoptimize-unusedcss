import React, {useEffect, useState, useCallback, useRef} from 'react';
import {CheckCircleIcon} from "@heroicons/react/24/solid";
import {Loader, Monitor, RefreshCw} from "lucide-react";
import {FaceSmileIcon, FaceFrownIcon, QueueListIcon, ArrowPathRoundedSquareIcon} from "@heroicons/react/24/outline";
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

    const [checkCircleCount, setCheckCircleCount] = useState(0);

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
            const timer = setTimeout(() => {
                // setShowInprogress(false);
                // dispatch(setCommonState('inProgress', false))
                // dispatch(fetchData(options, url, true));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [checkCircleCount]);

    const checkStatusCondition = (name: string) => {
        return includesStatusSettings(name, ['Critical CSS']) && cssStatus?.cpcss?.status !== 'success' || includesStatusSettings(name, ['Unused CSS']) && cssStatus?.uucss?.status !== 'success'
    };

    function unserialize(serializedString: any) {

        const serializedData = serializedString.match(/a:\d+:{.*?}/)[0];
        const unescapedData = serializedData.replace(/\\"/g, '"');
        return eval("(" + unescapedData + ")");
    }

    return (
        <m.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{
                ease: 'linear',
                duration: 0.5,
            }}>

            <div className='py-20 pt-32'>
                <h2 className='px-32 mb-8 font-medium text-xl text-brand-700'>Optimization Summary and Actions</h2>
                <div className='flex gap-8 px-24'>
                    <div
                        className="mb-3.5 rounded-[40px] min-w-[500px] dark:bg-brand-950 bg-brand-0 dark:hover:border-brand-700/70 hover:border-brand-400/60 ">


                        <div className="inline-block border-b w-full">
                            <div className="space-y-5 px-10 py-6">
                                <div className="flex gap-4 items-center">
                        <span
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-200/50">
                            {checkCircleCount == filteredSettings?.length ?
                                (<CheckCircleIcon className="w-7 h-7 fill-green-600"/>) : (
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
                                <AnimatePresence>
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
                                                            <Loader className='w-5 animate-spin'/>
                                                        ) : (
                                                            index <= currentIndex ? (
                                                                <CheckCircleIcon className="w-7 h-7 fill-green-600"/>
                                                            ) : (
                                                                <Loader className='w-5 animate-spin'/>
                                                            )
                                                        )}
                                                    </React.Fragment>

                                                </div>
                                                <h1 className="text-base">{setting.name.includes('Cache') ? 'Generating ' : setting.name.includes('Critical CSS') ? 'Generating above-the-fold' : (setting.name.includes('Unused CSS') ? 'Stripping off' : 'Optimizing')} {setting.name}</h1>
                                            </div>
                                        </motion.div>
                                    )}

                                </AnimatePresence>
                            ))}
                        </div>




                    </div>
                    <div className='flex flex-col justify-start items-start '>

                        <NextSteps/>

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

    );
}

export default OptimizerInProgress;
