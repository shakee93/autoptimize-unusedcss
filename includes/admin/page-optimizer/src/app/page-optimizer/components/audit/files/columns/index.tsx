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
import {formatNumberWithGranularity, truncateMiddleOfURL} from "lib/utils";
import AuditColumnUrl from "app/page-optimizer/components/audit/files/columns/url";
import AuditColumnDropdown from "app/page-optimizer/components/audit/files/columns/dropdown";
import AuditNodeColumn from "app/page-optimizer/components/audit/files/columns/node";


interface AuditColumnProps {
    audit: Audit
    heading: AuditHeadings,
    cell: CellContext<AuditResource, any>,
}

const AuditColumns = ({ audit, heading, cell } : AuditColumnProps) => {

    let value = cell.getValue()

    if (heading.valueType === 'url') {
        return <AuditColumnUrl audit={audit} cell={cell}/>
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
        return <AuditNodeColumn cell={cell}/>
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

    console.log('col', value, heading.valueType);
    return <span>{value}</span>;

}

export default AuditColumns