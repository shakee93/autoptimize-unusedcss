import {createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";
import AuditColumns from "app/page-optimizer/components/audit/content/columns";
import {isImageAudit} from "lib/utils";
import React from "react";


const useTable = (
    audit : Audit,
    headings : AuditHeadings[],
    items: AuditResource[],
    type: string
) => {
    const columnHelper = createColumnHelper<AuditResource>();

    const tableId = `table_${audit.id}`

    const col = headings.map((heading) => {
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

    const getHiddenColumns = () => {

        let hiddenColumns: { [id: string]: boolean } = {
            pattern: false,
            file_type: false,
            passed: false
        }

        if (isImageAudit(audit.id)) {
            hiddenColumns.node = false
        }

        // check the first row to find any blank columns if found hide that column
        let firstRow = Object.keys(items[0]);
        col.filter(c => !firstRow.includes(c.id ? c.id : '')).forEach(c => {
            if(c.id) hiddenColumns[c.id] = false
        })

        return hiddenColumns;
    }

    const table = useReactTable({
        data: items,
        // @ts-ignore
        columns: col,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        meta: {
            tableId,
            type
        },
        initialState : {
            pagination : {
                pageSize: 5
            },
            columnVisibility: getHiddenColumns()
        },
        autoResetPageIndex: false,
    });

    return [table];
};

export default useTable