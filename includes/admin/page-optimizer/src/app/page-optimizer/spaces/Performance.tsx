import Card from "components/ui/card";
import {AnimatePresence, m} from "framer-motion";
import Audit from "app/page-optimizer/components/audit/Audit";
import React, {useEffect, useRef, useState, useMemo} from "react";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";
import {useAppContext} from "../../../context/app";
import {cn} from "lib/utils";
import TogglePerformance from "components/toggle-performance";
import useCommonDispatch from "hooks/useCommonDispatch";
import {setCommonState} from "../../../store/common/commonActions";
import {CopyMinus, FoldVertical, Layers, SplitSquareVertical} from "lucide-react";
import TooltipText from "components/ui/tooltip-text";
import ScaleUp from "components/animation/ScaleUp";
import {BoltIcon, MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/24/solid";
import {Cog6ToothIcon, InformationCircleIcon} from "@heroicons/react/20/solid";
import SetupChecklist from "app/page-optimizer/components/SetupChecklist";
import AuditList from "app/page-optimizer/components/AuditList";
import SpeedSettings from "app/page-optimizer/spaces/SpeedSettings";
import {AuditsLine, SettingsLine} from "app/page-optimizer/components/icons/line-icons";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "components/ui/dialog";
import Fields from "app/page-optimizer/components/audit/additional-inputs";
import AppButton from "components/ui/app-button";
import Mode from "app/page-optimizer/components/Mode";
import { Checkbox } from "components/ui/checkbox";
import {
    TitanLogo
} from "app/page-optimizer/components/icons/icon-svg";


const welcomePopupKey = 'new-titan-prompt'
const Performance = () => {
    const {data, loading, error} = useSelector(optimizerData);

    const { dispatch ,  activeTab, openAudits, storePassedAudits} = useCommonDispatch()
    const [isSticky, setIsSticky] = useState(false);
    const navbarRef = useRef(null);
    const [open, setOpen] = React.useState(false);
    const [showNewTitanModelPopup, setShowNewTitanModelPopup]= useState( !!localStorage.getItem(welcomePopupKey));
    const {
        options,
        setOpenAudits,
        mode,
        manipulatingStyles,
        savingData,
        togglePerformance,
        setTogglePerformance,
        version
    } = useAppContext()

    const tabs: Tab[] = [

        {
            key: "opportunities",
            name: "Opportunities",
            color: 'border-orange-400',
            activeColor: 'bg-orange-400',
        },
        {
            key: "diagnostics",
            name: "Diagnostics",
            color: 'border-yellow-400 ',
            activeColor: 'bg-yellow-400 '
        },
        {
            key: "passed_audits",
            name: "Passed Audits",
            color: 'border-green-600',
            activeColor: 'bg-green-600'
        },

    ];

    const isOnboardMode = !['onboard', 'preview'].includes(mode);

    useEffect(() =>{

        setTimeout(() => {
            if(isOnboardMode && !showNewTitanModelPopup){
                setShowNewTitanModelPopup(true);
                setOpen(true);
            }
        }, 1000)

    },[]);

    const [isCheckedPopup, setIsCheckedPopup] = useState(false);
    const saveNewTitanModelPopup = (open: boolean) => {

        if (isCheckedPopup) {
            localStorage.setItem(welcomePopupKey, 'true');
        }
        if(!open){
            setOpen(false);
        }
        
    };

    return (

        <div data-tour='audits'>
            <h2 className="text-lg ml-5 mb-4 flex gap-2 font-normal items-center">
                {!togglePerformance && <TogglePerformance/>}
                Fix Performance Issues</h2>
            <div ref={navbarRef} style={{ height: '1px' }}></div>
            <div className={cn(
                'tabs flex sticky gap-2 -top-1 z-10',
            )}>
                <div

                    onClick={() => dispatch(setCommonState('activeTab', 'configurations'))}
                    className={cn(

                        `whitespace-nowrap dark:bg-brand-930/90 bg-brand-0 border-2 border-transparent rounded-[20px] cursor-pointer w-[200px]  flex items-center gap-2 px-5 py-3 text-sm font-medium`,

                        activeTab === 'configurations' ? "font-medium " : "text-brand-500 dark:hover:text-brand-300"
                    )}
                    data-tour="speed-settings"> <BoltIcon className='w-4 rounded-[15px]'/>  Speed Settings</div>

                <Card data-tour='audit-groups'
                      className={cn(
                          'dark:bg-brand-930/90 bg-brand-0 flex justify-between items-center select-none p-0 pl-6 pr-3 rounded-[20px]',
                          isSticky && 'rounded-b-xl rounded-t-none shadow-lg'
                      )}

                >
                   <div className='flex'>
                       {tabs.map((tab) => {
                           return (
                               <div
                                   onClick={() => dispatch(setCommonState('activeTab', tab.key))}
                                   className={cn(
                                       `cursor-pointer flex items-center gap-2 px-4 py-3 text-sm font-medium`,
                                       isSticky && 'py-3',
                                       activeTab === tab.key ? "font-medium " : "text-brand-500 dark:hover:text-brand-300"
                                   )}
                                   key={tab.key}
                               >
                                   {tab.name}
                                   {(tab.key !== 'configurations' && data && data?.audits.length > 0) && (
                                       <div className={
                                           cn(
                                               'flex text-xxs items-center justify-center rounded-full w-6 h-6 border-2',
                                               isSticky && 'w-5 h-5 border',
                                               tab.color,
                                               (activeTab === tab.key) && tab.activeColor,
                                           )}>
                            <span className={cn(
                                activeTab === tab.key && ' text-white dark:text-brand-900'
                            )}>
                                {data?.grouped[`${tab.key}`].length}
                            </span>
                                       </div>
                                   )}

                               </div>
                           )
                       })}
                   </div>

                    <div className='flex items-center'>
                        <AnimatePresence>
                            {openAudits.length > 1 &&
                                <ScaleUp>
                                    <div
                                        onClick={e => dispatch(setCommonState('openAudits', []))}
                                        className='dark:hover:bg-brand-700 hover:bg-brand-100 w-9 h-9 rounded-full flex items-center justify-center'>
                                        <TooltipText text='Collpase all Audits'>
                                            <FoldVertical className='w-5 text-brand-500 dark:text-brand-200'/>
                                        </TooltipText>
                                    </div>
                                </ScaleUp>
                            }
                        </AnimatePresence>

                    </div>
                </Card>
            </div>

            <div className="audits pt-4 flex mb-24">
                <div className='w-full'>

                    <AnimatePresence initial={false}>
                        <div key='performance' className='grid grid-cols-12 gap-6 w-full relative '>
                            <div className='col-span-12 flex flex-col gap-4'>
                                {activeTab === 'configurations' ?
                                   <>
                                       {/*<SetupChecklist/>*/}
                                       <SpeedSettings/>
                                   </>
                                    :
                                    <AuditList activeTab={activeTab}/>
                                }
                            </div>
                        </div>
                        <div key='audit-blank'>
                            {(activeTab !== 'configurations' && (!data?.grouped[activeTab] || data?.grouped[activeTab].length <= 0)) && (
                                <m.div
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -20}}
                                    className='flex flex-col gap-8 items-center px-8 pt-40 w-full'>

                                    <div>
                                        <img alt='Good Job!' className='w-64'
                                             src={options?.page_optimizer_base ? (options?.page_optimizer_base + `/success.svg`) : '/success.svg'}/>
                                    </div>

                                    <span className='flex gap-2'>
                                    Brilliantly done! It's clear you've mastered this.
                                </span>
                                </m.div>

                            )}
                        </div>
                    </AnimatePresence>
                </div>
            </div>

            <Mode>
                {showNewTitanModelPopup  && (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent asChild className="sm:max-w-[530px] cursor-auto">

                            <DialogHeader className='px-6 pt-6 pb-1'>
                                <div className='flex gap-2 items-center'>
                                    <div className='relative'>
                                        {/*<img className='w-36' src={ options?.page_optimizer_base ? (options?.page_optimizer_base + `/logo.svg`) : '/logo.svg'} alt='RapidLoad - #1 to unlock breakneck page speed'/>*/}
                                        <TitanLogo/>
                                    </div>

                                    <DialogTitle>Welcome to Titan’s New Look! (v1.1.6)</DialogTitle>
                                </div>

                                <div className='relative py-4'>
                                    <img className='w-[480px] rounded-lg' src={ options?.page_optimizer_package_base ? (options?.page_optimizer_package_base + `/gear-record-flow.gif`) : '/gear-record-flow.gif'} alt='Welcome to Titan'/>
                                </div>
                                <DialogDescription >
                                    {/*The update makes the design sleek and modern for better navigation. There's a new <span className="font-semibold">Speed Settings</span> tab for quick access to recommended settings. The interface is now simpler to understand metrics.*/}
                                    <h3>RapidLoad has introduced <span className='font-semibold'>three gear modes</span> for more efficient configuration:</h3>
                                    <ul className="list-disc px-6">
                                        <li>Starter Mode</li>
                                        <li>Accelerator Mode</li>
                                        <li>Turbo Mode</li>
                                        <li>Along with a Custom Mode for personalized optimization.</li>
                                    </ul>
                                </DialogDescription>


                            </DialogHeader>

                            <DialogFooter className='px-6 py-3 border-t'>
                                <label className="flex py-2 absolute items-center left-6">
                                    <Checkbox  onCheckedChange={(c: boolean) =>{
                                        setIsCheckedPopup(c);
                                        localStorage.setItem(welcomePopupKey, 'true');
                                    }}/>
                                    <span className="text-muted-foreground select-none">Don't show this again</span>
                                </label>
                                <AppButton onClick={e => saveNewTitanModelPopup(false)} className='text-sm'>Explore Now</AppButton>
                                <AppButton onClick={e => setOpen(false)} variant='outline' className='text-sm'>Close</AppButton>
                            </DialogFooter>

                        </DialogContent>
                    </Dialog>


                )}


            </Mode>
        </div>

    )

}

export default Performance