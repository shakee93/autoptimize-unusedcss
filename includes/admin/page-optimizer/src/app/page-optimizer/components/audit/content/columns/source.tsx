import React from "react";
import {CellContext} from "@tanstack/react-table";
import {truncateMiddleOfURL} from "lib/utils";
import {Circle} from "lucide-react";


interface SourceColumnProps {
    cell: CellContext<AuditResource, any>
}

const SourceColumn = ({cell}: SourceColumnProps) => {

    let value = cell.getValue()

    return (
        <div>
            <div className='flex flex-col'>
                <a target={"_blank"} className='hover:text-purple-750' href={value.url}>{value.url}</a>
                <div className='flex gap-2 items-center'>
                    <span className='opacity-90 text-blue-800 dark:text-brand-400 text-xs capitalize'>{value.urlProvider}</span>
                    <Circle className='w-1.5 fill-brand-600 stroke-none'/>
                    <span className='opacity-90 text-xs'>
                        <span className='text-blue-800 dark:text-brand-400'>Code Location :</span> Line {value.line}, Column {value.column}</span>
                </div>
            </div>
        </div>
    )
}

export default SourceColumn