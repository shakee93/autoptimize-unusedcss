import Card from "@/components/ui/card";
import { PlusCircleIcon, MinusCircleIcon} from "@heroicons/react/24/solid";
import React, {useState, useRef, useEffect, forwardRef} from "react";
import PerformanceIcons from '../performance-widgets/PerformanceIcons';
import 'react-json-view-lite/dist/index.css';
import AuditContent from "app/page-optimizer/components/audit/content";
import {JsonView} from "react-json-view-lite";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";
import {AuditComponentRef} from "app/page-optimizer";
import TooltipText from "components/ui/tooltip-text";
import {useAppContext} from "../../../../context/app";
import {cn} from "lib/utils";
import {InformationCircleIcon} from "@heroicons/react/20/solid";

export interface AuditProps {
    audit: Audit;
    activeTab: Tab['key'],
    index?: number;
    onHeightChange?: (height: number) => void;
}

const Audit = forwardRef<AuditComponentRef, AuditProps>(({audit, index, activeTab, onHeightChange }, ref) => {

    // const [toggleFiles, setToggleFiles] = useState(false);
    const [toggleFiles, setToggleFiles] = useState(index === 0 && ['opportunities', 'diagnostics'].includes(activeTab)  && (audit?.files?.items?.length > 0 || audit?.settings.length > 0));

    const {settings, activeReport} = useSelector(optimizerData);
    const divRef = useRef<HTMLDivElement>(null);
    const {openAudits, setOpenAudits} = useAppContext()

    const [showJson, setShowJson] = useState<boolean>(false)
    const [filesMounted, setFilesMounted] = useState(false)
    const filesOrActions = (audit.files?.items?.length > 0 || audit.settings.length > 0)

    if (!audit?.id) {
        return <></>;
    }

    let icon = audit.icon

    if (audit.type === 'passed_audit') {
        icon = 'pass'
    }

    useEffect(() => {

        // setOpenAudits(prevOpenAudits => {
        //     if (toggleFiles) {
        //         // Add if not present
        //         if (!prevOpenAudits.includes(audit.id)) {
        //             return [...prevOpenAudits, audit.id];
        //         }
        //     } else {
        //         // Remove if present
        //         return prevOpenAudits.filter(id => id !== audit.id);
        //     }
        //
        //     return prevOpenAudits; // Return the array unchanged if no action is taken
        // });

        notifyHeightChange();

    }, [toggleFiles, activeReport]);


    const notifyHeightChange = () => {
        if (divRef.current && typeof onHeightChange === 'function') {

            setTimeout(() => {
                const height = divRef?.current?.clientHeight || 0;
                onHeightChange(height - 15);
            }, 0)

            return;
        }
        
    };

    const summary = () => {
        const numItems = audit.files?.items?.length || 0;
        const numSettings = audit.settings.length || 0;

        if (numItems === 0 && numSettings === 0) {
            return '';
        }

        let summaryText = ``;

        if (numSettings > 0) {
            summaryText += ` ${numSettings} ${numSettings === 1 ? 'Action' : 'Actions'}`;
        }
        if (numItems > 0) {
            if (numSettings > 0) {
                summaryText += ', ';
            }


            summaryText += ` ${numItems} ${numItems === 1 ? 'Resource' : 'Resources'}`;
        }

        return `${summaryText}`;
    };

    return (
        <Card spreader={(!!audit?.files?.items?.length) && !toggleFiles} ref={divRef}
              className={cn(
                  `hover:opacity-100  w-full flex justify-center flex-col items-center p-0`,
                  toggleFiles ? 'shadow-xl dark:shadow-brand-800/70' : 'dark:hover:border-brand-500 hover:border-brand-400/60'
              )}
        >
            <div className='min-h-[56px] relative flex justify-between w-full py-2 px-4'>

                <div className='flex gap-3 font-normal  items-center text-base'>

                    <TooltipText className='capitalize' text={audit.scoreDisplayMode === 'informative' ? 'Informative' : `Audit status: ${icon}`}>
                        <div
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-100`}>
                            {audit.scoreDisplayMode === 'informative' ? <span className='w-3 h-3 border-2 rounded-full'></span> : <PerformanceIcons icon={icon}/> }

                        </div>
                    </TooltipText>
                    <div className='flex flex-col justify-around'>
                        <div className='flex gap-2 items-center'>
                            {audit.name}
                            {/*<span className='text-xxs leading-tight border border-purple-300 rounded-2xl py-0.5 px-2 bg-purple-100'>*/}
                            {/*    2 changes*/}
                            {/*</span>*/}

                        </div>
                        <span className='flex text-xxs leading-tight opacity-70'>
                             {audit.displayValue && (
                                 <span>{audit.displayValue}</span>
                             )}
                            {/*<span>{audit.id}</span>*/}
                        </span>
                    </div>

                </div>

                <div className='flex gap-4 items-center'>

                    { (audit.files?.items?.length > 0 || audit.settings.length > 0) && (
                        <div className='text-xs opacity-50'>
                            {summary()}
                        </div>
                    )}

                    <div>
                        <TooltipText
                            text={filesOrActions ? 'Show resources and actions' : 'Learn more about this audit'}
                        >
                            <div onClick={() => setToggleFiles(prev => !prev)}
                                 className={`min-w-[125px] cursor-pointer flex items-center gap-2 pl-4 pr-2 py-1.5 text-sm rounded-2xl dark:hover:bg-transparent hover:bg-brand-100 transition-colors ${toggleFiles ? ' dark:bg-brand-900 border ': 'border '}`}>

                                {filesOrActions ? (
                                    toggleFiles ? 'Hide Actions' : 'Show Actions'
                                ) : 'Learn More'}


                                {filesOrActions ? (
                                    (toggleFiles) ?
                                        <MinusCircleIcon className='w-6 h-6 dark:text-brand-500 text-brand-900'/> :
                                        <PlusCircleIcon className='w-6 h-6 dark:text-brand-500 text-brand-900'/>
                                ) : (
                                    (toggleFiles) ?
                                    <MinusCircleIcon className='w-6 h-6 dark:text-brand-500 text-brand-900'/> :
                                    <InformationCircleIcon className='w-6 h-6 dark:text-brand-500 text-brand-900'/>
                                    )}
                            </div>
                        </TooltipText>
                    </div>

                </div>



            </div>

            {showJson && (
                <div className='w-full p-4'>
                    <JsonView data={audit} shouldInitiallyExpand={(level) => false} />
                </div>
            )}
            {(toggleFiles) && (
                <AuditContent notify={notifyHeightChange} audit={audit}/>
            )}

        </Card>
    );
})

export default Audit
