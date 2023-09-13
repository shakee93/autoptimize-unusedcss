import React, {useState} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "components/ui/tooltip";
import {isImageAudit, isUrl, truncateMiddleOfURL} from "lib/utils";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import {CircleDashed} from "lucide-react";
import {CellContext} from "@tanstack/react-table";
import AuditColumnImage from "app/page-optimizer/components/audit/content/columns/image";
import Code from "components/ui/code";

interface AuditColumnUrlProps {
    audit : Audit,
    cell: CellContext<AuditResource, any>
}

const AuditColumnUrl = ({audit, cell} : AuditColumnUrlProps) => {


    let value = cell.getValue()
    
    if (isImageAudit(audit.id) || value?.file_type?.value === 'image') {
        return <AuditColumnImage cell={cell}/>
    } else if (isUrl(value)) {
        return (
            <a className='text-left' target='_blank'
               href={value}>
                <span>{truncateMiddleOfURL(value, 50)}</span>
                <ArrowTopRightOnSquareIcon className='w-4 inline-block ml-2'/>
            </a>
        )
    } else if (typeof value === 'object' && typeof value?.url === 'string') {
        return (
            <a className='text-left align-middle' target='_blank'
               href={value.url}>
                <span>{truncateMiddleOfURL(value.url, 50)}</span>
                <span><ArrowTopRightOnSquareIcon className='w-4 inline-block ml-2 -mt-1'/></span>

            </a>
        )
    } else {
        return <span>{value}</span>
    }
}

export default AuditColumnUrl