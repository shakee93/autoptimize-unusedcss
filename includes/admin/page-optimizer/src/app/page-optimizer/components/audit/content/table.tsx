import useTable from "hooks/useTable";
import {flexRender} from "@tanstack/react-table";
import {cn} from "lib/utils";
import {ChevronLeft, ChevronRight} from "lucide-react";
import React from "react";
import {JsonView} from "react-json-view-lite";

interface FileGroupProps {
    audit: Audit
    group: any
}

const FileTable = ({audit, group }: FileGroupProps) => {

    if (!group?.items?.length) {
        return <></>
    }

    const cellWidth = (valueType: string) => {
        switch (valueType) {
            case "timespanMs":
            case "ms":
                return "160px";
            case "bytes":
                return "140px";
            case "controls":
                return "200px";
            default:
                return "auto";
        }
    };

    const [table] = useTable(
        audit,
        (group.headings ? group.headings : audit?.files?.headings) || [],
        group.items,
        group.type
    )

    return (
        <div className='px-4 py-3'>
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
                    {table?.getRowModel().rows.map((row) => (
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
                                    {/*{cell.column.columnDef.meta?.valueType}*/}
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
    );
}

export default React.memo(FileTable)