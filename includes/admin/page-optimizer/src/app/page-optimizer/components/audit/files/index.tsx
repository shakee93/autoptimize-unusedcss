import {ColumnMeta, createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {JsonView} from "react-json-view-lite";
import React from "react";
import AuditColumns from "./columns";


interface AuditFileProps {
    audit: Audit
}

const AuditFiles = ({audit} : AuditFileProps) => {

    const columnHelper = createColumnHelper<AuditFile>()

    if (!audit?.files?.headings) {
        return (
            <JsonView data={audit} shouldInitiallyExpand={(level) => false} />
        )
    }

    const columns = audit?.files?.headings
        ?.filter(heading => !['pattern', 'node'].includes(heading.key) )
        .map((heading) => {

            console.log(heading);
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

    const cellWidth = (valueType : string) => {

        switch (valueType) {
            case 'timespanMs':
                return '160px';
            case 'bytes':
                return '160px';
            default:
                return 'auto'
        }
    }

    return (
        <div className='border-t dark:border-zinc-700 border-zinc-200 w-full p-4'>
            <div className='w-full dark:border-zinc-700 border border-zinc-200 rounded-[20px] overflow-hidden'>
                <table className='w-full'>
                    <thead>
                    {table?.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th className='px-5 py-3 dark:bg-zinc-900 bg-zinc-100 font-medium text-sm text-left' key={header.id}>
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
                            {row.getVisibleCells().map(cell => (
                                <td style={{
                                    // @ts-ignore
                                    width: cellWidth(cell.column.columnDef.meta?.valueType)
                                }} className='py-2 border-t dark:border-zinc-700 border-zinc-200 px-5 text-sm h-[50px] items-center' key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <JsonView data={audit} shouldInitiallyExpand={(level) => false} />

        </div>
    )
}

export default AuditFiles