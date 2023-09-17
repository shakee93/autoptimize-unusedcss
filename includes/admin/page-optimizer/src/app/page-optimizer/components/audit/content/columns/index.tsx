import React, {useState} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "components/ui/tooltip";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import {CircleDashed} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "components/ui/select";
import prettyBytes from "pretty-bytes";
import prettyMilliseconds from "pretty-ms";
import {CellContext} from "@tanstack/react-table";
import {formatNumberWithGranularity, isDev, truncateMiddleOfURL} from "lib/utils";
import AuditColumnUrl from "app/page-optimizer/components/audit/content/columns/url";
import AuditColumnDropdown from "app/page-optimizer/components/audit/content/columns/dropdown";
import AuditNodeColumn from "app/page-optimizer/components/audit/content/columns/node";


interface AuditColumnProps {
    audit: Audit
    heading: AuditHeadings,
    cell: CellContext<AuditResource, any>,
}

const AuditColumns = ({ audit, heading, cell } : AuditColumnProps) => {
    let value = cell.getValue()
    let subItems = cell.row.original?.subItems?.items[0] || {}

    if (!value && subItems) {
        return  <>
            {(heading?.subItemsHeading?.key && heading?.subItemsHeading?.key in subItems) && (
                <div className='px-2 pt-2 text-brand-500 dark:text-brand-300 min-w-max'>
                    {subItems[heading.subItemsHeading.key]}
                </div>
            )}
        </>;
    }

    if (!value) {
        return <></>;
    }

    if (heading.valueType === 'url') {
        return <AuditColumnUrl audit={audit} cell={cell}/>;
    }

    if (heading.valueType === 'controls') {
        return <AuditColumnDropdown cell={cell} audit={audit} heading={heading}/>
    }

    if (heading.valueType === 'bytes') {
        return <span>{prettyBytes(value as number)}</span>
    }

    if (['ms', 'timespanMs'].includes(heading.valueType as string)) {
        return <span>{prettyMilliseconds(cell.getValue() as number)}</span>
    }

    if (heading.valueType === 'node') {
        return <AuditNodeColumn heading={heading} cell={cell}/>
    }

    if (heading.valueType === 'numeric' && typeof value === 'number') {
        return <span>{formatNumberWithGranularity((value as number), heading.granularity)}</span>
    }

    if (heading.valueType === 'numeric' && typeof value === 'object') {
        return <span>{(value.value as number)}</span>
    }

    if (typeof value === 'object') {
        return <span>{JSON.stringify(value)}</span>
    }

    if (heading.valueType === 'text') {
        return <span>{value}</span>
    }

    if (isDev) {
        console.log('col', value, heading.valueType, audit.id);
    }

    return <span>{JSON.stringify(value)}</span>;

}

export default AuditColumns