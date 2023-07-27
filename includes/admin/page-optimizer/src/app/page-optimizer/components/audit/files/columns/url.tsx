import React, {useState} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "components/ui/tooltip";
import {truncateMiddleOfURL} from "lib/utils";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import {CircleDashed} from "lucide-react";
import {CellContext} from "@tanstack/react-table";

interface AuditColumnUrlProps {
    audit : Audit,
    cell: CellContext<AuditFile, any>
}

const AuditColumnUrl = ({audit, cell} : AuditColumnUrlProps) => {

    let [loaded, setLoaded] = useState<boolean>(false);

    let value = cell.getValue() as string

    if (['modern-image-formats'].includes(audit.id)) {
        return (
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger>
                        <div className='flex items-center gap-2'>
                            <div className='w-6 h-6 border rounded-md overflow-hidden'>
                                <img className='w-fit' src={cell.getValue() as string} alt=''/>
                            </div>
                            <a className='flex gap-2' target='_blank'
                               href={value}>{truncateMiddleOfURL(cell.getValue() as string, 50)}
                                <ArrowTopRightOnSquareIcon className='w-4'/> </a>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className='relative max-w-[32rem] min-w-[2rem] min-h-[2rem]'>
                        <img alt={cell.getValue() as string} onError={() => setLoaded(true)}
                             onLoadCapture={() => setLoaded(true)} className='max-w-[20rem]'
                             src={cell.getValue() as string}/>

                        {!loaded && (
                            <div className='absolute left-1/2 -translate-y-1/2 top-1/2 -translate-x-1/2'>
                                <CircleDashed className='animate-spin text-purple-750 w-6'/>
                            </div>
                        )}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    } else if (value === 'Unattributable') {
        return <span>{value}</span>
    } else {
        return (
            <a className='flex gap-2' target='_blank'
               href={cell.getValue() as string}>{truncateMiddleOfURL(cell.getValue() as string, 50)}
                <ArrowTopRightOnSquareIcon className='w-4'/> </a>
        )
    }
}

export default AuditColumnUrl