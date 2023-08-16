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
    audit?: Audit;
    index?: number;
    onHeightChange?: (height: number) => void;
}

const Audit = forwardRef<AuditComponentRef, AuditProps>(({audit, index, onHeightChange }, ref) => {
    const [toggleFiles, setToggleFiles] = useState(index === 0);
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

        setOpenAudits(prevOpenAudits => {
            if (toggleFiles) {
                // Add if not present
                if (!prevOpenAudits.includes(audit.id)) {
                    return [...prevOpenAudits, audit.id];
                }
            } else {
                // Remove if present
                return prevOpenAudits.filter(id => id !== audit.id);
            }

            return prevOpenAudits; // Return the array unchanged if no action is taken
        });

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
                  `hover:opacity-100 w-full flex justify-center flex-col items-center`,
                  toggleFiles && 'shadow-xl dark:shadow-zinc-800/70'
              )}
        >
            <div className='min-h-[56px] relative flex justify-between w-full py-2 px-4'>
                <div className='flex gap-3 font-normal  items-center text-base'>

                    <div
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-zinc-700 bg-zinc-100`}>
                        {audit.scoreDisplayMode === 'informative' ? <span className='w-3 h-3 border-2 border-zinc-400 rounded-full'></span> : <PerformanceIcons icon={icon}/> }
                    </div>
                    <div className='flex flex-col justify-around'>
                        {audit.name}
                        <span className='flex text-xxs leading-tight opacity-70'>
                             {audit.displayValue && (
                                 <span>{audit.displayValue}</span>
                             )}
                        </span>
                    </div>

                </div>

                <div className='flex gap-4 items-center'>



                    { (audit.files?.items?.length > 0 || audit.settings.length > 0) && (
                        <div className='text-xs opacity-50'>
                            {summary()}
                        </div>
                    )}

                    {/*<Settings audit={audit} max={1}/>*/}

                    {(audit.files?.items?.length > 0 || audit.settings.length > 0)  && (
                        <div>
                            <TooltipText text='Show resources and actions'>
                                <div onClick={() => setToggleFiles(prev => !prev)}
                                        className={`min-w-[125px] cursor-pointer flex items-center gap-2 pl-4 pr-2 py-1.5 text-sm rounded-xl dark:hover:opacity-80 dark:border-zinc-600 ${toggleFiles ? ' dark:bg-zinc-900 bg-zinc-100 border border-zinc-300': 'dark:bg-zinc-800 bg-zinc-200/[.2] border border-zinc-300 '}`}>
                                    {!toggleFiles ? 'Show' : 'Hide'} Actions {(toggleFiles) ?
                                    <MinusCircleIcon className='w-6 h-6 dark:text-zinc-500 text-zinc-900'/> :
                                    <PlusCircleIcon className='w-6 h-6 dark:text-zinc-500 text-zinc-900'/>}
                                </div>
                            </TooltipText>
                        </div>
                    )}

                    {/*<Button onClick={e => setShowJson(p => !p)} dark={false}><ArrowDown className='w-4'/></Button>*/}

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
