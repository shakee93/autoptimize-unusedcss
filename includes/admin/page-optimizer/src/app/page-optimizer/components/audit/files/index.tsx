import {
    Cell,
    ColumnMeta,
    createColumnHelper,
    flexRender,
    getCoreRowModel, getPaginationRowModel,
    Header, Table,
    useReactTable
} from "@tanstack/react-table";
import {JsonView} from "react-json-view-lite";
import React, {useEffect, useState} from "react";
import AuditColumns from "./columns";
import {cn, isImageAudit} from "lib/utils";
import Description from "app/page-optimizer/components/audit/Description";
import Settings from "app/page-optimizer/components/audit/Settings";


interface AuditContentProps {
    audit: Audit,
    notify: any
}

const AuditContent = ({audit, notify}: AuditContentProps) => {

    const [mounted, setMounted] = useState(false)
    const tables: Table<AuditResource>[] = [];
    const columns = [];

    if (!['table', 'opportunity', 'list'].includes(audit?.files?.type) ) {
        return (
            <JsonView data={audit} shouldInitiallyExpand={(level) => false}/>
        )
    }

    if (['table', 'opportunity'].includes(audit.files.type)) {
        const columnHelper = createColumnHelper<AuditResource>()


        const col = audit?.files?.headings
            ?.map((heading) => {
                return columnHelper.accessor(row => row[heading.key as keyof AuditResource], {
                    id: heading.key ? heading.key : 'no-key',
                    meta: heading,
                    cell: info => <AuditColumns audit={audit} heading={heading} cell={info}/>,
                    header: () => <span>{heading.label}</span>,
                });

            })

        columns.push(
            col
        )

        if (col) {
            tables.push(
                useReactTable({
                    data: audit.files.items,
                    // @ts-ignore
                    columns: col,
                    getCoreRowModel: getCoreRowModel(),
                    getPaginationRowModel: getPaginationRowModel(),
                })
            );
        }


    }

    if (audit.files.type === 'list') {

        audit.files.items.forEach(item => {
            const columnHelper = createColumnHelper<AuditResource>()

            if (item.type && item.type !== 'table') {
                return;
            }

            const col = item?.headings
                ?.map((heading) => {
                    return columnHelper.accessor(row => row[heading.key as keyof AuditResource], {
                        id: heading.key ? heading.key : 'no-key',
                        meta: heading,
                        cell: info => <AuditColumns audit={audit} heading={heading} cell={info}/>,
                        header: () => <span>{heading.label}</span>,
                    });

                })

            columns.push(
                col
            )

            tables.push(
                useReactTable({
                    data: item.items,
                    // @ts-ignore
                    columns: col,
                    getCoreRowModel: getCoreRowModel(),
                    getPaginationRowModel: getPaginationRowModel(),
                })
            )

        })

    }


    useEffect(() => {

        if (tables[0]) {
            tables[0].setPageSize(10);
        }

        setMounted(true);

        notify(true)

    }, []);
    const cellWidth = (valueType: string) => {

        switch (valueType) {
            case 'timespanMs':
                return '160px';
            case 'bytes':
                return '140px';
            case 'controls':
                return '200px';
            default:
                return 'auto'
        }
    }

    const shouldRender = (cell: Header<AuditResource, unknown> | Cell<AuditResource, unknown>) => {
        let col = cell.column.columnDef;

        if(col.id === 'node' && isImageAudit(audit.id) ) {
            return false
        }

        return !['pattern', 'file_type'].includes(col.id as string)
    }


    return (
        <div className='border-t dark:border-zinc-700 border-zinc-200 w-full py-4'>
            <div className=' pb-4 text-zinc-700 dark:text-zinc-300'>
               <div className='px-4 ml-2'>
                   <Description content={audit.description}/>
               </div>
            </div>
            {audit.settings.length > 0 && (
                <div className='flex flex-col border-t dark:border-zinc-700 py-4 px-4 gap-3'>
                    <div className='font-medium text-sm ml-2'>Recommended Settings</div>
                    <Settings audit={audit}/>
                </div>
            )}

            {(audit?.files?.items?.length > 0 && mounted && tables.length > 0) && tables.map((table, index) => (
                <div key={index} className='flex flex-col gap-3 p-4 border-t dark:border-zinc-700'>
                    <div className='font-medium text-sm ml-2'>Related Resources</div>
                    <div className='w-full dark:border-zinc-700 border border-zinc-200  rounded-[20px] overflow-hidden'>

                            <table className='w-full'>
                                <thead>
                                {table?.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.filter(header => shouldRender(header)).map(header => (
                                            <th className='first:pl-6 px-2 py-3 dark:bg-zinc-900 bg-zinc-100 font-medium text-xs text-left'
                                                key={header.id}>
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

                                    <tr key={row.id}>
                                        {row.getVisibleCells().filter(cell => shouldRender(cell)).map(cell => (
                                            <td style={{
                                                // @ts-ignore
                                                width: cellWidth(cell.column.columnDef.meta?.valueType)
                                            }}
                                                className='first:pl-6 py-2 border-t dark:border-zinc-700 border-zinc-200 px-2 text-sm h-[50px] items-center'
                                                key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                        {/*<JsonView shouldInitiallyExpand={e => false} data={audit.files}/>*/}
                    </div>

                    {table.getPageCount() > 1 && (
                        <div className='w-full flex justify-end'>
                            <ul className='flex gap-1 mt-4'>
                                <li className='hover:bg-zinc-200 px-3 py-1 cursor-pointer rounded text-xs'>{'<'}</li>
                                {[...Array(table.getPageCount())].map((i, index) => (
                                    <li className={cn(
                                        'hover:bg-zinc-200 px-3 py-1 cursor-pointer rounded text-xs',
                                        table.getState().pagination.pageIndex === index ? 'bg-zinc-200' : ''
                                    )}
                                        onClick={() => {
                                            table.setPageIndex(index)
                                        }}
                                        key={index}>{index + 1}</li>
                                ))}
                                <li className='hover:bg-zinc-200 px-3 py-1 cursor-pointer rounded text-xs'>{'>'}</li>
                            </ul>
                        </div>
                    )}
                </div>
            )) }
        </div>
    )
}

export default AuditContent