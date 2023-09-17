import {CellContext} from "@tanstack/react-table";
import Code from "components/ui/code";
import {Tooltip, TooltipContent, TooltipTrigger} from "components/ui/tooltip";
import React from "react";
import {JsonView} from "react-json-view-lite";

interface AuditNodeColumnProps {
    cell: CellContext<AuditResource, any>
    heading: AuditHeadings
}

const AuditNodeColumn = ({cell, heading}: AuditNodeColumnProps) => {

    let value = cell.getValue();
    let subItems = cell.row.original?.subItems?.items[0] || {}

    if (!value) {
        return <></>
    }

    let snippet = value.snippet

    return (
        <div className='text-xs p-3'>
            <Tooltip>
                <TooltipTrigger className='w-full'>
                    <Code code={snippet}></Code>
                </TooltipTrigger>
                <TooltipContent className='flex flex-col'>
                    {(value?.nodeLabel !== value?.selector) && (
                        <span className='ml-2 mb-2'>{value?.nodeLabel}</span>
                    )}
                    <Code lang='css' code={value?.selector} />
                </TooltipContent>
            </Tooltip>

            {(heading?.subItemsHeading?.key && heading?.subItemsHeading?.key in subItems) && (
                <div className='px-2 pt-2  min-w-max'>
                    {subItems[heading.subItemsHeading.key]}
                </div>
            )}

        </div>
    );
}

export default AuditNodeColumn