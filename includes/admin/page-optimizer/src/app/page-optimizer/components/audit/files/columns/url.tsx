import React, {useState} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "components/ui/tooltip";
import {truncateMiddleOfURL} from "lib/utils";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import {CircleDashed} from "lucide-react";
import {CellContext} from "@tanstack/react-table";
import AuditColumnImage from "app/page-optimizer/components/audit/files/columns/image";

interface AuditColumnUrlProps {
    audit : Audit,
    cell: CellContext<AuditFile, any>
}

const AuditColumnUrl = ({audit, cell} : AuditColumnUrlProps) => {


    let value = cell.getValue() as string

    if (['modern-image-formats'].includes(audit.id)) {
        return <AuditColumnImage cell={cell}/>
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