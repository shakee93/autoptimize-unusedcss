import Settings from "app/page-optimizer/components/audit/Settings";
import TooltipText from "components/ui/tooltip-text";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/24/solid";
import React from "react";
import {Table} from "@tanstack/react-table";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../../store/app/appSelector";
import {JsonView} from "react-json-view-lite";

interface FilesTableHeaderProps {
    audit: Audit
    table: Table<AuditResource>
    tableFilterStates: any
    updateFilter: any
}

const FilesTableHeader = ({audit, table, tableFilterStates, updateFilter} : FilesTableHeaderProps) => {
    const tableId = table.options.meta?.tableId;
    const { data, settings, changes } = useSelector(optimizerData)
    let rows = table.getCoreRowModel().rows.map(r => r.original)
    let file_type = table.options.meta?.type
    // @ts-ignore
    let urls = rows.filter(r => r?.url?.file_type?.value === file_type).map(r => r?.url?.url)
    let _changes = changes?.files.map(i => i.file)

    // TODO: count the file changes
    let countOfChanges = 0;

    // TODO: possible bug in list type table audits
    // @ts-ignore
    const passed = rows.find((r) => r?.passed)
    
    if (!tableId) {
        return <></>
    }

    if (urls && changes) {
        countOfChanges = urls.filter(url => _changes.includes(url)).length
    }

    return (
        <>
            <div
                className='flex items-center gap-2 font-medium text-sm ml-2 capitalize'>
                {table.options.meta?.title ? table.options.meta.title : "Related Resources"}
                {/*{!!countOfChanges && (*/}
                {/*    <>*/}
                {/*        <span> · </span>*/}
                {/*        <span className='text-xs text-blue-500 font-normal'>{countOfChanges} file change{countOfChanges > 1 && 's'}</span>*/}
                {/*    </>*/}
                {/*)}*/}
            </div>
            {audit.settings.length > 0 && (
                <div className='flex gap-3'>
                    <Settings type={table.options.meta?.type} audit={audit}/>
                    {passed && (
                        <TooltipText
                            text='Show the files that have successfully passed this audit'>
                            <div
                                onClick={e => updateFilter(table.options.meta?.tableId)}
                                className="flex cursor-pointer gap-2 font-medium text-sm hover:bg-brand-100 dark:bg-brand-900 bg-brand-50 border w-fit rounded-xl items-center pl-3 pr-2 py-2"
                            >
                                Show Optimized Files
                                {(tableFilterStates[tableId] && tableFilterStates[tableId] === 'on') ?
                                    <MinusCircleIcon className='w-6 h-6 dark:text-brand-500 text-brand-900'/> :
                                    <PlusCircleIcon className='w-6 h-6 dark:text-brand-500 text-brand-900'/>
                                }
                            </div>
                        </TooltipText>
                    )}
                </div>
            )}
        </>
    );
}

export default FilesTableHeader