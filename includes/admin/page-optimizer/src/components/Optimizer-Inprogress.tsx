import React, {useEffect, useState, useCallback} from 'react';
import {CheckCircleIcon} from "@heroicons/react/24/solid";
import {Loader, Monitor, RefreshCw} from "lucide-react";
import { FaceSmileIcon, FaceFrownIcon, QueueListIcon, ArrowPathRoundedSquareIcon  } from "@heroicons/react/24/outline";
import {useAppContext} from "../context/app";
import {optimizerData} from "../store/app/appSelector";
import CountdownTimer from './ui/CountdownTimer';
import {ThunkDispatch} from "redux-thunk";
import {useDispatch, useSelector} from "react-redux";
import useCommonDispatch from "hooks/useCommonDispatch";
import {AppAction, RootState} from "../store/app/appTypes";
import {changeReport, fetchData} from "../store/app/appActions";
import {setCommonState} from "../store/common/commonActions";
import Loading from "components/loading";
import {m, AnimatePresence} from "framer-motion";
import {Button} from "components/ui/button";
import {cn} from "lib/utils";


const OptimizerInprogress = () => {

    const { data, loading, error, settings } = useSelector(optimizerData);
    const [fetchCalled, setFetchCalled] = useState(false);
    const { options, savingData, setShowInprogress } = useAppContext();
    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const url = options?.optimizer_url;
    const {activeReport} = useSelector((state: RootState) => state.app);
    const {inProgress } = useCommonDispatch()
    const loadingStatuses = ['failed', 'queued', 'processing'];

    const [checkCircleCount, setCheckCircleCount] = useState(0);

    const filteredSettings = settings?.filter(setting => {
        return setting.inputs.some(input => input.control_type === "checkbox" && input.value === true);
    });

    const includesStatusSettings = (string: string, substrings: string[]): boolean => {
        return substrings.some(substring => string.includes(substring));
    };

    const [currentIndex, setCurrentIndex] = useState(0);

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
        }, 2000);

        return () => clearInterval(interval);
    }, [filteredSettings]);


    useEffect(() => {
        filteredSettings?.forEach(setting => {
            if (includesStatusSettings(setting.name, ['Critical CSS', 'Unused CSS']) && setting.status?.status !== 'success') {
                setTimeout(() => {
                    dispatch(fetchData(options, url, false, true));
                }, 10000);
            }
        });

    }, [dispatch, activeReport, settings]);

    useEffect(() => {
        if (!filteredSettings) return;

        let count = 0;
        for (let index = 0; index < filteredSettings.length; index++) {
            const setting = filteredSettings[index];
            if (includesStatusSettings(setting.name, ['Critical CSS', 'Unused CSS']) && setting.status?.status !== 'success') {
                continue;
            }
            if (index <= currentIndex) {
                count++;
            }
        }
        setCheckCircleCount(count);
    }, [filteredSettings, currentIndex]);

    useEffect(() => {
        if(checkCircleCount  == filteredSettings?.length){
            const timer = setTimeout(() => {
                //dispatch(setCommonState('inProgress', false));
                setShowInprogress(false);
                dispatch(fetchData(options, url, true));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [checkCircleCount]);

    return (
       <m.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{
               ease: 'linear',
               duration: 0.5,
           }}>

               <div className='py-20 grid justify-center items-center '>
                   <div className="mb-3.5 rounded-[40px] min-w-[650px] dark:bg-brand-950 bg-brand-0 dark:hover:border-brand-700/70 hover:border-brand-400/60 ">

                       <div className=" px-16 py-10 ">

                           {filteredSettings?.map((setting, index: number) => (

                               <div key={index} className="grid font-medium">
                                   <div className="flex gap-4 items-center relative">
                                       <div className="inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-200/50">
                                           {/*{includesStatusSettings(setting.name, ['Critical CSS', 'Unused CSS']) && setting.status?.status != 'success' ? (*/}
                                           {/*    <Loader className='w-5 animate-spin text-brand-800'/>*/}
                                           {/*) : (index <= currentIndex ? (*/}
                                           {/*        <CheckCircleIcon className="w-7 h-7 fill-green-600" />*/}
                                           {/*        ) : (*/}
                                           {/*             <Loader className='w-5 animate-spin text-brand-800'/>*/}
                                           {/*        )*/}
                                           {/*)}*/}

                                           <React.Fragment key={index}>
                                               {includesStatusSettings(setting.name, ['Critical CSS', 'Unused CSS']) && setting.status?.status !== 'success' ? (
                                                   <Loader className='w-5 animate-spin text-brand-800'/>
                                               ) : (
                                                   index <= currentIndex ? (
                                                       <CheckCircleIcon className="w-7 h-7 fill-green-600" />
                                                   ) : (
                                                       <Loader className='w-5 animate-spin text-brand-800'/>
                                                   )
                                               )}
                                           </React.Fragment>

                                       </div>
                                       <h1 className="text-base">{setting.name.includes('Cache' ) ? 'Generating ' : setting.name.includes('Critical CSS') ? 'Generating above-the-fold' : (setting.name.includes('Unused CSS') ? 'Stripping off' : 'Optimizing')} {setting.name}</h1>
                                   </div>

                                   <div className="ml-3.5 grid gap-2 border-l my-2">
                                       {includesStatusSettings(setting.name, ['Critical CSS', 'Unused CSS']) && setting.status?.status !== 'success' ? (

                                           <>
                                               <div className="ml-[29px] ">
                                                   <Loading className={'text-sm text-gray-500 -mt-2'} customMessage={'Processing in progress — just '} customMessageAfter={'seconds to completion. Hang tight!'} url={url} countDown={true}/>

                                                   <div className={`border-2 rounded-xl px-4 py-3 mt-1.5 ${setting.status?.status === 'failed' && index <= currentIndex ? ' border-red-600 bg-red-100/30' : 'border-orange-400 bg-orange-100/30'}`}>
                                                       <div className="flex gap-2 items-center relative">
                                                           {setting.status?.status === 'queued' ? <QueueListIcon className="h-6 w-6" />: setting.status?.status === 'processing' ? <ArrowPathRoundedSquareIcon className="h-6 w-6" /> : <FaceFrownIcon className="h-6 w-6 text-red-600" />}
                                                           <h3 className="text-sm">{setting.status?.status && setting.status?.status.charAt(0).toUpperCase() + setting.status?.status.slice(1) + ' to optimize'}</h3>

                                                       </div>
                                                       {loadingStatuses.includes(setting.status?.status || '') &&(
                                                           <div className="ml-8">
                                                               <Loading className={'text-gray-500'} customMessage={'Processing in progress — just '} customMessageAfter={'seconds to completion. Hang tight!'} url={url} countDown={true}/>
                                                           </div>
                                                       )}
                                                   </div>


                                               </div>
                                           </>

                                       ): index !== filteredSettings.length - 1 && (
                                           <div className="py-3"></div>
                                       )}

                                   </div>
                               </div>
                           ))}

                       </div>

                       <div className="inline-block border-t w-full">
                           <div className="space-y-5 px-16 py-6">
                               <div className="flex gap-4 items-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-200/50">
                            {checkCircleCount == filteredSettings?.length ?
                                ( <CheckCircleIcon className="w-7 h-7 fill-green-600" />):(
                                    <Loader className='w-5 animate-spin text-brand-800'/>
                                )}
                        </span>
                                   <p className="text-gray-400">{checkCircleCount} out of {filteredSettings?.length} steps are completed...</p>
                               </div>
                           </div>
                       </div>


                   </div>
                   <div className='grid justify-center items-center '>
                       <Loading className={'py-4 text-brand-500'} customMessage={"Analyzing in"} url={url} countDown={true}/>
                       <div className='grid justify-center'>
                           <Button
                               onClick={() => {
                               dispatch(fetchData(options, url, true))
                               //dispatch(setCommonState('inProgress', false))
                                   setShowInprogress(false);
                           }}
                                   className={`flex overflow-hidden select-none relative text-sm h-12 rounded-[14px] gap-2 items-center px-4 h-full`}>
                               <RefreshCw className={cn(
                                   'w-4',
                                   loading && 'animate-spin'
                               )}/>
                               Analyze
                           </Button>
                       </div>

                   </div>
               </div>

       </m.div>

    );
}

export default OptimizerInprogress;