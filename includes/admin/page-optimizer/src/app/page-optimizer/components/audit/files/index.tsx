import {Cell,
    ColumnMeta,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    Header,
    useReactTable
} from "@tanstack/react-table";
import {JsonView} from "react-json-view-lite";
import React from "react";
import AuditColumns from "./columns";
import {isImageAudit} from "lib/utils";


interface AuditFileProps {
    audit: Audit
}

const AuditFiles = ({audit}: AuditFileProps) => {

    const columnHelper = createColumnHelper<AuditFile>()

    if (!audit?.files?.headings) {
        return (
            <JsonView data={audit} shouldInitiallyExpand={(level) => false}/>
        )
    }

    const columns = audit?.files?.headings
        ?.map((heading) => {

            return columnHelper.accessor(row => row[heading.key as keyof AuditFile], {
                id: heading.key ? heading.key : 'no-key',
                meta: heading,
                cell: info => <AuditColumns audit={audit} heading={heading} cell={info}/>,
                header: () => <span>{heading.label}</span>,
            });

        });


    const table = useReactTable({
        data: audit.files.items,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const cellWidth = (valueType: string) => {

        switch (valueType) {
            case 'timespanMs':
                return '160px';
            case 'bytes':
                return '140px';
            default:
                return 'auto'
        }
    }

    const shouldRender = (cell: Header<AuditFile, unknown> | Cell<AuditFile, unknown>) => {
        let col = cell.column.columnDef;

        if(col.id === 'node' && isImageAudit(audit.id) ) {
            return false
        }

        return !['pattern'].includes(col.id as string)
    }

    return (
        <div className='border-t dark:border-zinc-700 border-zinc-200 w-full p-4'>
            <div className='w-full dark:border-zinc-700 border border-zinc-200 rounded-[20px] overflow-hidden'>
                <table className='w-full'>
                    <thead>
                    {table?.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.filter(header => shouldRender(header)).map(header => (
                                <th className='first:pl-6 px-2 py-3 dark:bg-zinc-900 bg-zinc-100 font-medium text-xs text-left' key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table?.getRowModel().rows.map(row => (
                        <tr  key={row.id}>
                            {row.getVisibleCells().filter(cell => shouldRender(cell)).map(cell => (
                                <td style={{
                                    // @ts-ignore
                                    width: cellWidth(cell.column.columnDef.meta?.valueType)
                                }} className='first:pl-6 py-2 border-t dark:border-zinc-700 border-zinc-200 px-2 text-sm h-[50px] items-center' key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default AuditFiles