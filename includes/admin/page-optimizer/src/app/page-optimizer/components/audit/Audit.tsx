import Card from "@/components/ui/card";
import { PlusCircleIcon, MinusCircleIcon} from "@heroicons/react/24/solid";
import React, {useState, useRef, useEffect, forwardRef, useImperativeHandle} from "react";
import Setting from './Setting';
import PerformanceIcons from '../performance-widgets/PerformanceIcons';
import 'react-json-view-lite/dist/index.css';
import AuditFiles from "app/page-optimizer/components/audit/files";
import {JsonView} from "react-json-view-lite";
import AppButton from "components/ui/app-button";
import {ArrowDown} from "lucide-react";
import {useSelector} from "react-redux";
import {isEqual} from "underscore";
import {optimizerData} from "../../../../store/app/appSelector";
import {AuditComponentRef} from "app/page-optimizer";

export interface AuditProps {
    audit?: Audit;
    index?: number;
    onHeightChange?: (height: number) => void;
}

const Audit = forwardRef<AuditComponentRef, AuditProps>(({audit, onHeightChange }, ref) => {
    const [toggleFiles, setToggleFiles] = useState(false);
    const [showJson, setShowJson] = useState<boolean>(false)
    const {settings} = useSelector(optimizerData);
    const divRef = useRef<HTMLDivElement>(null);

    if (!audit?.id) {
        return <></>;
    }

    let icon = audit.icon

    if (audit.type === 'passed_audit') {
        icon = 'pass'
    }

    useEffect(() => {
        notifyHeightChange();
    }, [toggleFiles]);

    const notifyHeightChange = () => {
        if (divRef.current && typeof onHeightChange === 'function') {
            // Get the actual height of the Audit component
            const height = divRef.current.clientHeight;
            // reduce the height keep a padding above the circle
            onHeightChange(height - 15);
        }
    };

    useImperativeHandle(ref, () => ({
        notifyHeightChange,
    }));

    return (
        <Card ref={divRef} padding='p-0' cls={`w-full flex justify-center flex-col items-center `}>
            <div className='min-h-[56px] relative flex justify-between w-full py-2 px-4'>
                <div className='flex gap-3 font-normal  items-center text-base'>
                    <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-zinc-700 bg-zinc-100`}>
                            <PerformanceIcons icon={icon}/>
                            </span>
                    {audit.name}
                </div>

                <div className='flex gap-2 items-center'>

                    {audit.settings.length > 0 &&(
                        <div className="flex flex-wrap">
                            {audit.settings.map((s, index) => (
                                <Setting audit={audit} key={index} settings={settings?.find((_s : AuditSetting) => _s.name === s.name)} index={index} />
                            ))}
                        </div>
                    )}

                    {(audit.files?.items?.length) > 0 && (
                        <div> <button onClick={() => setToggleFiles(prev => !prev)}
                                      className={`transition duration-300 cursor-pointer flex items-center gap-2 pl-4 pr-2 py-1.5 text-sm rounded-xl dark:hover:opacity-80 ${toggleFiles ? ' dark:bg-zinc-900 bg-zinc-100 border dark:border-zinc-600 border-zinc-300': 'dark:bg-zinc-800 bg-zinc-200/[.2] border border-zinc-300'}`}>
                            View Files {(toggleFiles) ?
                            <MinusCircleIcon className='w-6 h-6 dark:text-zinc-500 text-zinc-900'/> :
                            <PlusCircleIcon className='w-6 h-6 dark:text-zinc-500 text-zinc-900'/>}
                        </button>
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
            {audit.files && toggleFiles && (
                <AuditFiles audit={audit}/>
            )}

        </Card>
    );
})

export default Audit
