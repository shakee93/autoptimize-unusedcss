import React, {useState} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "components/ui/tooltip";
import {isImageAudit, isUrl, truncateMiddleOfURL} from "lib/utils";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import {CellContext} from "@tanstack/react-table";
import AuditColumnImage from "app/page-optimizer/components/audit/content/columns/image";
import Code from "components/ui/code";
import {CheckCircleIcon} from "@heroicons/react/24/solid";
import TooltipText from "components/ui/tooltip-text";

interface AuditColumnUrlProps {
    audit : Audit,
    cell: CellContext<AuditResource, any>
    heading: AuditHeadings

}

const AuditColumnUrl = ({audit, cell, heading} : AuditColumnUrlProps) => {

    let value = cell.getValue()
    let passed = false

    if (cell.table.options.columns.find(c => c.id === 'passed')) {
        passed = cell.row.getValue('passed')
    }
    
    if (!value.toString().startsWith('data:image') && (isImageAudit(audit.id) || value?.file_type?.value === 'image')) {
        return <AuditColumnImage cell={cell}/>;
    } else if (isUrl(value)) {
        return (
            <a className='text-left' target='_blank'
               href={value}>
                <span>{truncateMiddleOfURL(value, 60)}</span>
                <ArrowTopRightOnSquareIcon className='w-4 inline-block ml-2'/>
            </a>
        );
    } else if (typeof value === 'object' && typeof value?.url === 'string') {
        return (
            <a className='text-left inline-flex items-center align-middle' target='_blank'
               href={value.url}>
                {passed && (
                    <span className='inline-flex gap-1 mr-1'>
                        {/*<TooltipText text='You are seeing this because you have given this file an action, Not reported by Google PageSpeed.'>*/}
                        {/*    <div className='bg-blue-500 w-1.5 h-1.5 shadow-lg rounded-full'></div>*/}
                        {/*</TooltipText>*/}
                        <TooltipText text='Successfully Optimized file'>
                            <CheckCircleIcon className='w-5 inline-block text-green-600'/>
                        </TooltipText>
                    </span>
                )}
                <span className='items-center gap-2'>
                    {truncateMiddleOfURL(value.url, 60)} <ArrowTopRightOnSquareIcon className='w-4 inline-block -mt-0.5'/></span>
            </a>
        );
    } else {
        return <span>{value}</span>;
    }
}

export default AuditColumnUrl