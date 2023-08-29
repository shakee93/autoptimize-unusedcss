import {cn, isImageAudit} from "lib/utils";
import Settings from "app/page-optimizer/components/audit/Settings";
import TooltipText from "components/ui/tooltip-text";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/24/solid";
import {Cell, flexRender, Header, Table} from "@tanstack/react-table";
import {ChevronLeft, ChevronRight} from "lucide-react";
import React, {useState} from "react";
import FilesTableHeader from "app/page-optimizer/components/audit/content/header";
import {JsonView} from "react-json-view-lite";


interface FilesTableProps {
    audit: Audit
    table: Table<AuditResource>
    tableFilterStates: any
    updateFilter: any
}

const FilesTable = ({ audit, table, tableFilterStates, updateFilter }: FilesTableProps) => {

    // the pageIndex of table gets reset by actions in dropdown. so setting our own index
    const [pageIndex, setPageIndex] = useState<number>(0)

    const shouldRender = (
        cell: Header<AuditResource, unknown> | Cell<AuditResource, unknown>
    ) => {
        let col = cell.column.columnDef;

        if (col.id === "node" && isImageAudit(audit.id)) {
            return false;
        }

        if(col.id === 'action' && [
            'modern-image-formats',
            'offscreen-images',
            'unsized-images'
        ].includes(audit.id)) {
            return false
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
        <div className="flex flex-col gap-3 px-4 py-3 border-t">
            <div className={cn(
                'flex flex-col gap-2 justify-center',
            )}>
               <FilesTableHeader audit={audit}
                                 table={table}
                                 tableFilterStates={tableFilterStates}
                                 updateFilter={updateFilter}
               />
            </div>
            <div className="w-full border rounded-[20px] overflow-hidden">
                <table className="w-full">
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
                <div className="w-full flex justify-end">
                    <ul className="flex gap-1 mt-4 items-center">
                        <li onClick={e => {
                            pageIndex > 0 && setPageIndex(p =>  p - 1)
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
                                    "hover:bg-brand-100 border px-3 py-1.5 cursor-pointer rounded text-xs",
                                    pageIndex === index ? "bg-brand-200" : ""
                                )}
                                onClick={() => {
                                    setPageIndex(index)
                                    table.setPageIndex(e => index);
                                }}
                                key={index}
                            >
                                {index + 1}
                            </li>
                        ))}
                        <li onClick={e => {
                            if(table.getCanNextPage()) {
                                setPageIndex(p => p + 1)
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
    )
}

export default FilesTable