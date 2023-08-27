import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "components/ui/tooltip";
import {truncateMiddleOfURL} from "lib/utils";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import {CircleDashed} from "lucide-react";
import React, {useEffect, useState} from "react";
import {CellContext} from "@tanstack/react-table";
import Code from "components/ui/code";


interface AuditColumnImageProps {
    cell: CellContext<AuditResource, any>
}

const AuditColumnImage = ({ cell } : AuditColumnImageProps) => {

    let [loaded, setLoaded] = useState<boolean>(false);

    let value = cell.getValue().url ? cell.getValue().url : cell.getValue()
    let snippet : any = '';

    if (cell.table.getColumn('node')) {
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
                        <div className='w-6 h-6 border rounded-md overflow-hidden'>
                            <img className='w-fit' src={value.url ? value.url : value} alt=''/>
                        </div>

                        {value && (
                            <a className='flex gap-2' target='_blank'
                               href={value}>{truncateMiddleOfURL(value.url ? value.url : value, 40)}
                                <ArrowTopRightOnSquareIcon className='w-4'/> </a>
                        )}


                    </div>
                </TooltipTrigger>
                <TooltipContent className='max-w-[48rem] min-w-[2rem] min-h-[2rem]'>
                    <div className='flex flex-row items-center gap-3 py-1'>
                        <div className='relative'>
                            <img alt={value} onError={() => setLoaded(true)}
                                 onLoadCapture={() => setLoaded(true)} className='max-w-[10rem]'
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