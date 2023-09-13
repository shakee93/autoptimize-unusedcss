import React, {useEffect, useState} from "react";
import AuditColumns from "./columns";
import Description from "app/page-optimizer/components/audit/Description";
import Settings from "app/page-optimizer/components/audit/Settings";
import {
    createColumnHelper, FilterFn,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel,
    Table,
    useReactTable,
} from "@tanstack/react-table";
import {JsonView} from "react-json-view-lite";

interface AuditContentProps {
    audit: Audit;
    notify: any;
}

import {
    RowData
} from "@tanstack/react-table";
import FilesTable from "app/page-optimizer/components/audit/content/table";
import {transformFileType} from "lib/utils";


declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        title: string
        type?: string
        tableId: string
    }
}



const AuditContent = ({audit, notify}: AuditContentProps) => {

    useEffect(() => {
        notify(true);
    }, []);

    const [tableFilterStates, setTableFilterStates] = useState<{
        [T:string] : string
    }>({});



    const createTable = (index: number,headings : AuditHeadings[], items: AuditResource[], title: string, type?: string) => {
        const columnHelper = createColumnHelper<AuditResource>();

        const tableId = `table_${audit.id}_${index}`

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

        const selectFilterFn: FilterFn<any> = (row, columnId, value, addMeta) => {

            return true;
            // console.log(row.original,columnId, tableId, tableFilterStates, value);

            if (row.original.passed && value === 'on') {
                return true;
            }

            if (row.original.passed) {
                return false;
            }

            // Use currentTableFilterStates instead of tableFilterStates within this function
            return true;
        };



        const table = useReactTable({
            data: items,
            // @ts-ignore
            columns: col,
            getCoreRowModel: getCoreRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            meta: {
                title,
                type,
                tableId
            },
            state: {
                // globalFilter: tableFilterStates[tableId] || 'off',
            },
            // globalFilterFn: selectFilterFn,
            initialState : {
                pagination : {
                    pageSize: 5
                }
            },
            // onGlobalFilterChange: () => updateFilter(tableId),
            // getFilteredRowModel: getFilteredRowModel(),
            autoResetPageIndex: false
        });

        tables.push(table);
    };

    const tables: Table<AuditResource>[] = [];

    // TODO: render criticalrequestchain type properly
    if (audit.files?.type && !["table", "opportunity", "list", "criticalrequestchain"].includes(audit.files.type)) {
        return <JsonView data={audit} shouldInitiallyExpand={(level) => false}/>;
    }

    if (audit.files?.type === "opportunity" || audit.files?.type === "table") {
        audit.files?.grouped_items?.forEach((data, index) => {
            if (data.items && data.items.length > 0) {
                const label = (typeof data.items[0].url !== 'string' && data.items[0].url?.file_type?.label) || data.type
                let title = label.toLowerCase() === 'unknown' ? 'Unattributable items' :`${label} Files`

                if ("grouped_items" in audit.files && audit.files.grouped_items.length === 1 && label.toLowerCase() === 'unknown') {
                    title = ''
                }

                createTable(index, audit.files?.headings || [], data.items, title, data.type);
            }
        });
    }

    if (audit.files?.type === "list") {
        audit.files.items.forEach((item, index) => {
            if (item.type && item.type === "table" && item.items.length > 0) {
                createTable(index, item.headings, item.items, "Related Resources");
            }
        });
    }

    const updateFilter = (tableId: string) => {
        setTableFilterStates((prevFilterStates) => ({
            ...prevFilterStates,
            [tableId]: (prevFilterStates[tableId] && prevFilterStates[tableId] === 'on') ? 'off': 'on', // Update with the new filter value
        }));
    };

    let remainingSettings = audit
        .settings
        .filter(s => !tables.map(t => transformFileType(audit, t.options.meta?.type)).includes(s.category) )


    return (
        <div className="border-t w-full pt-4">
            <div className="pb-4 text-brand-700 dark:text-brand-300">
                <div className="px-4 ml-2">
                    <Description content={audit.description}/>
                </div>
            </div>

            {(audit.settings.length > 0 && remainingSettings.length > 0) && (
                <div className='flex flex-col border-t py-4 px-4 gap-3'>
                    <div className='font-medium text-sm ml-2'>
                        {audit.settings.length !== remainingSettings.length ? 'Additional Settings' : 'Recommended Settings'}
                    </div>
                    <Settings audit={audit} auditSettings={remainingSettings}/>
                </div>
            )}

            {tables.map((table, index) => (
               <FilesTable
                   key={index}
                   notify={notify}
                   index={index}
                   audit={audit}
                   tableFilterStates={tableFilterStates}
                   updateFilter={updateFilter}
                   table={table}
               />
            ))}
        </div>
    );
};

export default React.memo(AuditContent);
