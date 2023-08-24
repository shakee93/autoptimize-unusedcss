import Card from "@/components/ui/card";
import { PlusCircleIcon, MinusCircleIcon} from "@heroicons/react/24/solid";
import React, {useState, useRef, useEffect, forwardRef, useImperativeHandle} from "react";
import Setting from './Setting';
import PerformanceIcons from '../performance-widgets/PerformanceIcons';
import 'react-json-view-lite/dist/index.css';
import AuditContent from "app/page-optimizer/components/audit/files";
import {JsonView} from "react-json-view-lite";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";
import {AuditComponentRef} from "app/page-optimizer";
import TooltipText from "components/ui/tooltip-text";
import Settings from "app/page-optimizer/components/audit/Settings";
import {useOptimizerContext} from "../../../../context/root";
import {cn} from "lib/utils";

export interface AuditProps {
    audit: Audit;
    activeTab: string,
    index?: number;
    onHeightChange?: (height: number) => void;
}

const Audit = forwardRef<AuditComponentRef, AuditProps>(({audit, index, activeTab, onHeightChange }, ref) => {

    const [toggleFiles, setToggleFiles] = useState(index === 0 && activeTab === 'opportunities' && (audit?.files?.items?.length > 0 || audit?.settings.length > 0));

    const {settings} = useSelector(optimizerData);
    const divRef = useRef<HTMLDivElement>(null);
    const {openAudits, setOpenAudits} = useOptimizerContext()

    const [showJson, setShowJson] = useState<boolean>(false)
    const [filesMounted, setFilesMounted] = useState(false)

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

    }, [toggleFiles]);


    const notifyHeightChange = () => {
        if (divRef.current && typeof onHeightChange === 'function') {

            setTimeout(() => {
                const height = divRef?.current?.clientHeight || 0;
                onHeightChange(height - 15);
            }, 0)

            return;
        }
        
        console.log('here');
    };

    useImperativeHandle(ref, () => ({
        notifyHeightChange,
    }));

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
        <Card spreader={(!!audit?.files?.items?.length) && !toggleFiles} ref={divRef} padding='p-0'
              className={cn(
                  `hover:opacity-100  w-full flex justify-center flex-col items-center`,
                  toggleFiles ? 'shadow-xl dark:shadow-zinc-800/70' : 'dark:hover:border-zinc-500 hover:border-zinc-400/60'
              )}
        >
            <div className='min-h-[56px] relative flex justify-between w-full py-2 px-4'>

                <div className='flex gap-3 font-normal  items-center text-base'>

                    <TooltipText className='capitalize' text={audit.scoreDisplayMode === 'informative' ? 'Informative' : `Audit status: ${icon}`}>
                        <div
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-zinc-700 bg-zinc-100`}>
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
                            <span>- {audit.id}</span>
                        </span>
                    </div>

                </div>

                <div className='flex gap-4 items-center'>

                    { (audit.files?.items?.length > 0 || audit.settings.length > 0) && (
                        <div className='text-xs opacity-50'>
                            {summary()}
                        </div>
                    )}

                    {(audit.files?.items?.length > 0 || audit.settings.length > 0)  && (
                        <div>
                            <TooltipText text='Show resources and actions'>
                                <div onClick={() => setToggleFiles(prev => !prev)}
                                        className={`min-w-[125px] cursor-pointer flex items-center gap-2 pl-4 pr-2 py-1.5 text-sm rounded-2xl dark:hover:bg-transparent hover:bg-zinc-100 transition-colors ${toggleFiles ? ' dark:bg-zinc-900 border ': 'border '}`}>
                                    {!toggleFiles ? 'Show' : 'Hide'} Actions {(toggleFiles) ?
                                    <MinusCircleIcon className='w-6 h-6 dark:text-zinc-500 text-zinc-900'/> :
                                    <PlusCircleIcon className='w-6 h-6 dark:text-zinc-500 text-zinc-900'/>}
                                </div>
                            </TooltipText>
                        </div>
                    )}

                </div>



            </div>

            {showJson && (
                <div className='w-full p-4'>
                    <JsonView data={audit} shouldInitiallyExpand={(level) => false} />
                </div>
            )}
            {((audit.files?.items?.length > 0 || audit.settings.length > 0) && toggleFiles) && (
                <AuditContent notify={setFilesMounted} audit={audit}/>
            )}

        </Card>
    );
})

export default Audit
