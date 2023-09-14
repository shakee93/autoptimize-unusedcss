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
import columns from "app/page-optimizer/components/audit/content/columns";


interface FilesTableProps {
    audit: Audit
    table: Table<AuditResource>
    index: number
    notify: (val: boolean) => void
}

const FilesTable = ({ audit, table, index, notify }: FilesTableProps) => {

    const [open, setOpen] = useState(index === 0)
    const tableId = table.options.meta?.tableId;
    const rowModel = table?.getRowModel();
    let rows = table.getCoreRowModel().rows.map(r => r.original)

    // @ts-ignore
    const passed = rows.find((r) => r?.passed)

    useEffect(() => {
        notify(true)
    }, [open])

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
               />
            </div>

            <Accordion isOpen={open}>
                <div className='px-4 py-3'>
                    {rowModel?.rows.length > 0 && (
                        <div className="w-full border rounded-[20px] overflow-hidden">
                            <table className="w-full text-brand-800 dark:text-brand-100">
                                <thead>
                                {table?.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers
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
                                {rowModel.rows.map((row) => (
                                    <tr className={cn(
                                    )} key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                style={{
                                                    // @ts-ignore
                                                    width: cellWidth(cell.column.columnDef.meta?.valueType),
                                                }}
                                                className={cn(
                                                    "first:pl-4 py-2 border-t px-2 text-sm h-[50px] items-center",
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
                    )}
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