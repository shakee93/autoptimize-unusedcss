import {
    ColumnDef,
    ColumnHelper,
    createColumnHelper,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import AuditColumns from "app/page-optimizer/components/audit/content/columns";
import {isImageAudit} from "lib/utils";
import React, { useMemo } from "react";

const useTable = (
    audit: Audit,
    headings: AuditHeadings[],
    items: AuditResource[],
    type: string
) => {
    const columnHelper = createColumnHelper<AuditResource>();
    const tableId = `table_${audit.id}`;

    // @ts-ignore
    const columns: ColumnHelper<AuditResource, any>[] = useMemo(() => {
        return headings.map((heading) => {
            return columnHelper.accessor(
                (row) => row[heading.key as keyof AuditResource],
                {
                    id: heading.key ? heading.key : "no-key",
                    meta: heading,
                    cell: (info) => <AuditColumns audit={audit} heading={heading} cell={info}/>,
                    header: () => <span>{heading.label}</span>,
                    enableHiding: true,
                }
            );
        });
    }, [headings, audit, columnHelper]);

    const hiddenColumns = useMemo(() => {
        let hiddenColumns: { [id: string]: boolean } = {
            pattern: false,
            file_type: false,
            passed: false
        };

        if (isImageAudit(audit.id)) {
            hiddenColumns.node = false;
        }

        let firstRow = Object.keys(items[0]);
        columns.filter(c => !firstRow.includes(c.id ? c.id : '')).forEach(c => {
            if (c.id) hiddenColumns[c.id] = false;
        });

        return hiddenColumns;
    }, [audit.id, columns, items]);

    const table = useReactTable({
        data: items,
        columns: columns ,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        meta: {
            tableId,
            type
        },
        initialState: {
            pagination: {
                pageSize: 5
            },
            columnVisibility: hiddenColumns
        },
        autoResetPageIndex: false,
    });

    return [table];
};

export default useTable;
