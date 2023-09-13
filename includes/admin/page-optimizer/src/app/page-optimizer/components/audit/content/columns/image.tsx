import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "components/ui/tooltip";
import {truncateMiddleOfURL} from "lib/utils";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import {CircleDashed} from "lucide-react";
import React, {useEffect, useMemo, useState} from "react";
import {CellContext} from "@tanstack/react-table";
import Code from "components/ui/code";
import {JsonView} from "react-json-view-lite";


interface AuditColumnImageProps {
    cell: CellContext<AuditResource, any>
}

interface FetchDetails {
    redirected: boolean;
    status: number;
    statusText: string;
}

const AuditColumnImage = ({ cell } : AuditColumnImageProps) => {

    let [loaded, setLoaded] = useState<boolean>(false);

    let value = cell.getValue().url ? cell.getValue().url : cell.getValue()
    let snippet : any = '';

    if (cell.table.options.meta?.type === 'image' && cell.table.options.columns.find(c => c.id === 'node')) {
        // @ts-ignore
        snippet = cell.row.getValue('node') as {
            nodeLabel: string
            selector: string
            snippet: string
        }
    }

    return (
            <Tooltip>
                <TooltipTrigger >
                    <div className='flex items-center gap-3'>
                        <div className='w-6 h-6'>
                            <div style={{
                                backgroundImage: `url(${value})`
                            }} className='w-6 h-6 bg-cover bg-center border rounded-md overflow-hidden'>
                            </div>
                        </div>

                        {value && (
                            <a className='text-left' target='_blank'
                               href={value}>
                                <span>{truncateMiddleOfURL(value, 40)}</span>
                                <span>
                                    <ArrowTopRightOnSquareIcon className='ml-1.5 inline-block w-3.5'/>
                                </span>
                            </a>
                        )}

                    </div>
                </TooltipTrigger>
                <TooltipContent className='max-w-[768px] min-w-[32px] min-h-[32px]'>
                    <div className='flex flex-row items-center gap-3 py-1'>
                        <div>
                            <img alt={value} onError={() => setLoaded(true)}
                                 onLoadCapture={() => setLoaded(true)} className='max-w-[160px]'
                                 src={value}/>
                            {!loaded && (
                                <div className='absolute left-1/2 -translate-y-1/2 top-1/2 -translate-x-1/2'>
                                    <CircleDashed className='animate-spin text-purple-750 w-6'/>
                                </div>
                            )}
                        </div>
                        {snippet && (
                        <div className='flex flex-col gap-2'>

                                <div>
                                    {(snippet?.nodeLabel !== snippet?.selector) && (
                                        <span className='ml-2 mb-2'>{value?.nodeLabel}</span>
                                    )}
                                    <Code lang='jsx' code={snippet?.selector} />
                                </div>
                                <Code code={snippet?.snippet} />

                        </div>
                        )}
                    </div>


                </TooltipContent>
            </Tooltip>
    );
}

export default AuditColumnImage