import {cn, isImageAudit} from "lib/utils";
import Settings from "app/page-optimizer/components/audit/Settings";
import TooltipText from "components/ui/tooltip-text";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/24/solid";
import {Cell, flexRender, Header, Table} from "@tanstack/react-table";
import {ChevronLeft, ChevronRight} from "lucide-react";
import React, {useEffect, useState} from "react";
import FilesTableHeader from "app/page-optimizer/components/audit/content/header";
import {JsonView} from "react-json-view-lite";
import {Accordion} from "components/accordion";


interface FilesTableProps {
    audit: Audit
    table: Table<AuditResource>
    tableFilterStates: any
    updateFilter: any
    index: number
    notify: (val: boolean) => void
}

const FilesTable = ({ audit, table, tableFilterStates, updateFilter, index, notify }: FilesTableProps) => {

    const [open, setOpen] = useState(index === 0)
    const tableId = table.options.meta?.tableId;
    let rows = table.getCoreRowModel().rows.map(r => r.original)
    // @ts-ignore
    const passed = rows.find((r) => r?.passed)

    useEffect(() => {
        notify(true)
    }, [open])

    const shouldRender = (
        cell: Header<AuditResource, unknown> | Cell<AuditResource, unknown>
    ) => {
        let col = cell.column.columnDef;

        if (col.id === "node" && isImageAudit(audit.id) ) {
            return false;
        }

        return !["pattern", "file_type", 'passed'].includes(col.id as string);
    };

    const cellWidth = (valueType: string) => {
        switch (valueType) {
            case "timespanMs":
                return "160px";
            case "bytes":
                return "140px";
            case "controls":
                return "200px";
            default:
                return "auto";
        }
    };



    return (
        <div className="flex flex-col border-t">
            <div className={cn(
                'flex flex-col gap-3 justify-center ',
            )}>
               <FilesTableHeader audit={audit}
                                 open={open}
                                 setOpen={setOpen}
                                 table={table}
                                 tableFilterStates={tableFilterStates}
                                 updateFilter={updateFilter}
               />
            </div>

            <Accordion isOpen={open}>
                <div className='px-4 py-3'>
                    {(passed && tableId) && (
                        <div className='mb-3 ml-3'>
                            <TooltipText
                                text='Show the files that have successfully passed this audit'>
                                <div
                                    onClick={e => updateFilter(table.options.meta?.tableId)}
                                    className="flex cursor-pointer gap-2 font-medium text-sm hover:bg-brand-100 dark:bg-brand-900 bg-brand-50 border w-fit rounded-xl items-center pl-3 pr-2 py-2"
                                >
                                    Show Optimized Files
                                    {(tableFilterStates[tableId] && tableFilterStates[tableId] === 'on') ?
                                        <MinusCircleIcon className='w-6 h-6 dark:text-brand-500 text-brand-900'/> :
                                        <PlusCircleIcon className='w-6 h-6 dark:text-brand-500 text-brand-900'/>
                                    }
                                </div>
                            </TooltipText>
                        </div>
                    )}
                    <div className="w-full border rounded-[20px] overflow-hidden">
                        <table className="w-full text-brand-800 dark:text-brand-100">
                            <thead>
                            {table?.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers
                                        .filter((header) => shouldRender(header))
                                        .map((header) => (
                                            <th
                                                className="first:pl-6 px-2 py-3 dark:bg-brand-900 bg-brand-100 font-medium text-xs text-left"
                                                key={header.id}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                </tr>
                            ))}
                            </thead>
                            <tbody>
                            {table?.getRowModel().rows.map((row) => (
                                <tr className={cn(
                                    "passed" in row.original && row.original?.passed ? 'bg-green-50 dark:bg-brand-800' : ''
                                )} key={row.id}>
                                    {row.getVisibleCells().filter((cell) => shouldRender(cell)).map((cell) => (
                                        <td
                                            style={{
                                                // @ts-ignore
                                                width: cellWidth(cell.column.columnDef.meta?.valueType),
                                            }}
                                            className={cn(
                                                "first:pl-6 py-2 border-t px-2 text-sm h-[50px] items-center",
                                            )}
                                            key={cell.id}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {table.getPageCount() > 1 && (
                        <div className="w-full flex justify-end pb-0 py-2">
                            <ul className="flex gap-1 items-center">
                                <li onClick={e => {
                                    table.previousPage()
                                }}
                                    className={cn(
                                        "disabled:opacity-30 hover:bg-brand-100 px-3 py-1 cursor-pointer rounded text-xs",
                                        !table.getCanPreviousPage() && 'opacity-30 cursor-no-drop'
                                    )}>
                                    <ChevronLeft className='w-4'/>
                                </li>
                                {[...Array(table.getPageCount())].map((i, index) => (
                                    <li
                                        className={cn(
                                            "dark:hover:bg-brand-700 hover:bg-brand-100 border px-3 py-1.5 cursor-pointer rounded text-xs",
                                            table.getState().pagination.pageIndex === index ? "dark:bg-brand-600 bg-brand-200" : ""
                                        )}
                                        onClick={() => {
                                            table.setPageIndex(e => index);
                                        }}
                                        key={index}
                                    >
                                        {index + 1}
                                    </li>
                                ))}
                                <li onClick={e => {
                                    if(table.getCanNextPage()) {
                                        table.nextPage()
                                    }
                                }}
                                    className={cn(
                                        "disabled:opacity-30 hover:bg-brand-100 px-3 py-1 cursor-pointer rounded text-xs",
                                        !table.getCanNextPage() && 'opacity-30 cursor-no-drop'
                                    )}>
                                    <ChevronRight className='w-4'/>
                                </li>
                            </ul>
                        </div>
                    )}

                </div>
            </Accordion>
        </div>
    )
}

export default FilesTable