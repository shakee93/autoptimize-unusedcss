import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "components/ui/tooltip";
import {truncateMiddleOfURL} from "lib/utils";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import {CircleDashed} from "lucide-react";
import React, {useState} from "react";
import {CellContext} from "@tanstack/react-table";
import Code from "components/ui/code";


interface AuditColumnImageProps {
    cell: CellContext<AuditFile, any>
}

const AuditColumnImage = ({ cell } : AuditColumnImageProps) => {

    let [loaded, setLoaded] = useState<boolean>(false);
    let value = cell.getValue();
    let snippet = ''
    // @ts-ignore
    
    console.log(cell.table.getAllColumns());

    if (cell.table.getColumn('node')) {
        // @ts-ignore
        snippet = cell.row.getValue('node')?.snippet;
    }

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger>
                    <div className='flex items-center gap-3'>
                        <div className='w-6 h-6 border rounded-md overflow-hidden'>
                            <img className='w-fit' src={value} alt=''/>
                        </div>

                        <a className='flex gap-2' target='_blank'
                           href={value}>{truncateMiddleOfURL(value, 50)}
                            <ArrowTopRightOnSquareIcon className='w-4'/> </a>
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
                        <div>
                            {snippet && (
                                <Code code={snippet} />
                            )}
                        </div>
                    </div>


                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default AuditColumnImage