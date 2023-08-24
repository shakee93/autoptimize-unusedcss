import React, {useEffect, useState} from "react";
import AuditColumns from "./columns";
import {cn, isImageAudit} from "lib/utils";
import Description from "app/page-optimizer/components/audit/Description";
import Settings from "app/page-optimizer/components/audit/Settings";
import {
    Cell,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    Header,
    Table,
    useReactTable,
} from "@tanstack/react-table";
import {JsonView} from "react-json-view-lite";
import {ChevronLeft, ChevronRight} from "lucide-react";

interface AuditContentProps {
    audit: Audit;
    notify: any;
}

import {
    RowData
} from "@tanstack/react-table";
import {Switch} from "components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "components/ui/dialog";
import TooltipText from "components/ui/tooltip-text";
import {Cog6ToothIcon} from "@heroicons/react/20/solid";
import AdditionalInputs from "app/page-optimizer/components/audit/additional-inputs";
import AppButton from "components/ui/app-button";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/24/solid";

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        title: string
        type?: string
    }
}



const AuditContent = ({audit, notify}: AuditContentProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        notify(true);
    }, []);

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

    const shouldRender = (
        cell: Header<AuditResource, unknown> | Cell<AuditResource, unknown>
    ) => {
        let col = cell.column.columnDef;

        if (col.id === "node" && isImageAudit(audit.id)) {
            return false;
        }

        return !["pattern", "file_type"].includes(col.id as string);
    };

    const createTable = (headings : AuditHeadings[], items: AuditResource[], title: string, type?: string) => {
        const columnHelper = createColumnHelper<AuditResource>();

        const col = headings.map((heading) => {
            return columnHelper.accessor(
                (row) => row[heading.key as keyof AuditResource],
                {
                    id: heading.key ? heading.key : "no-key",
                    meta: heading,
                    cell: (info) => <AuditColumns audit={audit} heading={heading} cell={info}/>,
                    header: () => <span>{heading.label}</span>,
                }
            );
        });

        const table = useReactTable({
            data: items,
            // @ts-ignore
            columns: col,
            getCoreRowModel: getCoreRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            meta: {
                title: title,
                type
            },
            initialState : {
                pagination : {
                    pageSize: 8
                }
            }
        });

        return table;
    };

    const tables: Table<AuditResource>[] = [];

    if (!audit?.files?.type || !["table", "opportunity", "list"].includes(audit.files.type)) {
        return <JsonView data={audit} shouldInitiallyExpand={(level) => false}/>;
    }

    if (audit.files.type === "opportunity" || audit.files.type === "table") {
        // console.log(audit.files.grouped_items);
        audit.files.grouped_items.forEach((data) => {
            if (data.items && data.items.length > 0) {
                const label = (typeof data.items[0].url !== 'string' && data.items[0].url?.file_type?.label) || data.type
                const table = createTable(audit.files?.headings || [], data.items, label === 'unknown' ? 'Other items' :`${label} Files`, data.type);
                tables.push(table);
            }
        });
    }

    if (audit.files.type === "list") {
        audit.files.items.forEach((item) => {
            if (item.type && item.type === "table" && item.items.length > 0) {
                const table = createTable(item.headings, item.items, "Related Resources");
                tables.push(table);
            }
        });
    }

    return (
        <div className="border-t dark:border-zinc-700 border-zinc-200 w-full pt-4">
            <div className="pb-4 text-zinc-700 dark:text-zinc-300">
                <div className="px-4 ml-2">
                    <Description content={audit.description}/>
                </div>
            </div>

            {(audit.settings.length > 0 && audit.settings.find(s => ['cache'].includes(s.category)) ) && (
                <div className='flex flex-col border-t dark:border-zinc-700 py-4 px-4 gap-3'>
                    <div className='font-medium text-sm ml-2'>Recommended Settings</div>
                    <Settings type='cache' audit={audit}/>
                </div>
            )}


            {tables.map((table, index) => (
                <div key={index} className="flex flex-col gap-3 px-4 py-3 border-t dark:border-zinc-700">
                    <div className="flex flex-col gap-2 justify-center">

                        <div
                            className='font-medium text-sm ml-2 capitalize'>{table.options.meta?.title ? table.options.meta.title : "Related Resources"}</div>
                        {audit.settings.length > 0 && (
                            <div className='flex gap-3'>
                                <Settings type={table.options.meta?.type} audit={audit}/>
                                {/*<TooltipText text='Show the files that have successfully passed this audit'>*/}
                                {/*    <div*/}
                                {/*        className="flex cursor-pointer gap-2 font-medium text-sm hover:bg-zinc-100 dark:bg-zinc-900 bg-zinc-50 dark:border-zinc-700 border border-zinc-200 w-fit rounded-xl items-center pl-3 pr-2 py-2"*/}
                                {/*    >*/}
                                {/*        Show Optimized Files <PlusCircleIcon className='w-6 h-6 dark:text-zinc-500 text-zinc-900'/>*/}
                                {/*    </div>*/}
                                {/*</TooltipText>*/}
                            </div>
                        )}
                    </div>
                    <div className="w-full dark:border-zinc-700 border border-zinc-200 rounded-[20px] overflow-hidden">
                        <table className="w-full">
                            <thead>
                            {table?.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers
                                        .filter((header) => shouldRender(header))
                                        .map((header) => (
                                            <th
                                                className="first:pl-6 px-2 py-3 dark:bg-zinc-900 bg-zinc-100 font-medium text-xs text-left"
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
                                <tr key={row.id}>
                                    {row.getVisibleCells().filter((cell) => shouldRender(cell)).map((cell) => (
                                        <td
                                            style={{
                                                // @ts-ignore
                                                width: cellWidth(cell.column.columnDef.meta?.valueType),
                                            }}
                                            className="first:pl-6 py-2 border-t dark:border-zinc-700 border-zinc-200 px-2 text-sm h-[50px] items-center"
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
                                <li className="hover:bg-zinc-200 px-3 py-1 cursor-pointer rounded text-xs">
                                    <ChevronLeft className='w-4'/>
                                </li>
                                {[...Array(table.getPageCount())].map((i, index) => (
                                    <li
                                        className={cn(
                                            "hover:bg-zinc-200 border px-3 py-1.5 cursor-pointer rounded text-xs",
                                            table.getState().pagination.pageIndex === index ? "bg-zinc-200" : ""
                                        )}
                                        onClick={() => {
                                            table.setPageIndex(index);
                                        }}
                                        key={index}
                                    >
                                        {index + 1}
                                    </li>
                                ))}
                                <li className="hover:bg-zinc-200 px-3 py-1 cursor-pointer rounded text-xs">
                                    <ChevronRight className='w-4'/>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AuditContent;
