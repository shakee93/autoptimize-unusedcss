import Card from "@/components/ui/card";
import { PlusCircleIcon, MinusCircleIcon} from "@heroicons/react/24/solid";
import React, {useState, useRef } from "react";
import Setting from './Setting';
import PerformanceIcons from '../performance-widgets/PerformanceIcons';
import 'react-json-view-lite/dist/index.css';
import AuditFiles from "app/page-optimizer/components/audit/files";
import {JsonView} from "react-json-view-lite";
import Button from "app/speed-popover/components/elements/button";
import {ArrowDown} from "lucide-react";

interface AuditProps {
    audit?: Audit;
    priority?: boolean;
}

const Audit = ({audit, priority = true }: AuditProps) => {
    const [toggleFiles, setToggleFiles] = useState(false);
    const [showJson, setShowJson] = useState<boolean>(false)

    if (!audit?.id) {
        return <></>;
    }

    let icon = audit.icon

    if (audit.type === 'passed_audit') {
        icon = 'pass'
    }

    return (
        <Card padding='p-0' cls={`w-full flex justify-center flex-col items-center min-h-[58px]`}>
            <div className='flex justify-between w-full py-2 px-3'>
                <div className='absolute left-2 text-center mt-2'>
                    <span
                        className={`border-2 border-zinc-300 inline-block w-3 h-3  rounded-full ${priority ? 'bg-zinc-300' : 'bg-transparent'}`}></span>

                    <span
                          className={`w-[2px] h-[45px] border-dashed border-l-2 border-gray-highlight left-1/2 -translate-x-1/2 top-7 absolute`}></span>
                </div>
                <div className='flex gap-3 font-normal  items-center text-base'>
                    <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100`}>
                            <PerformanceIcons icon={icon}/>
                            </span>
                    {audit.name}
                </div>

                <div className='flex gap-2 items-center'>

                    {audit.settings.length > 0 &&(
                        <div className="flex flex-wrap">
                            {audit.settings.map((settings, index) => (
                                <Setting key={index} settings={settings} index={index} />
                            ))}
                        </div>
                    )}

                    {(audit.files?.items?.length) > 0 && (
                        <div> <button onClick={() => setToggleFiles(prev => !prev)}
                                      className={`${toggleFiles ? 'bg-zinc-100 border border-zinc-300': 'bg-zinc-200/[.2] border border-zinc-200'} transition duration-300 hover:bg-zinc-200 cursor-pointer flex items-center gap-2 pl-4 pr-2 py-1.5 text-sm rounded-xl`}>
                            View Files {(toggleFiles) ?
                            <MinusCircleIcon className='w-6 h-6 text-zinc-900'/> :
                            <PlusCircleIcon className='w-6 h-6 text-zinc-900'/>}
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
}

export default Audit
