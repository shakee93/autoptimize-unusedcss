import Settings from "app/page-optimizer/components/audit/Settings";
import TooltipText from "components/ui/tooltip-text";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/24/solid";
import React, {Dispatch, SetStateAction} from "react";
import {Table} from "@tanstack/react-table";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../../store/app/appSelector";
import {JsonView} from "react-json-view-lite";
import {cn} from "lib/utils";

interface FilesTableHeaderProps {
    audit: Audit
    group: any
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

const FilesTableHeader = ({audit, group, open, setOpen} : FilesTableHeaderProps) => {


    const label = (typeof group.items[0].url !== 'string' && group.items[0].url?.file_type?.label) || group.type
    let title = label.toLowerCase() === 'unknown' ? 'Unattributable items' :`${label} Files`

    if ("grouped_items" in audit.files && audit.files.grouped_items.length === 1 && label.toLowerCase() === 'unknown') {
        title = ''
    }

    let rows = group.items

    // TODO: count the file changes

    // TODO: possible bug in list type table audits
    // @ts-ignore
    const resources = rows.filter((r) => !r?.passed) || []
    // @ts-ignore
    const passed = rows.filter((r) => r?.passed) || []

    return (
        <>
            <div
                className={cn(
                    'flex justify-between items-center gap-2 font-medium text-sm capitalize px-4 py-3',
                    open && 'border-b'
                )
                }>

                <div className='flex gap-2 items-center px-2'>
                    <div className='flex gap-2'>
                        <TooltipText asChild text={
                            `${open ? 'Hide' : 'Show'} ${title ?? title}`
                        }>
                            <button className='flex gap-2' onClick={e => setOpen(p => !p)}>
                                { open ?
                                    <MinusCircleIcon className='w-5 h-5 dark:text-brand-500 text-brand-900'/> :
                                    <PlusCircleIcon className='w-5 h-5 dark:text-brand-500 text-brand-900'/>
                                }
                                <span>{title ? title : "Related Resources"}</span>
                            </button>
                        </TooltipText>
                    </div>

                    <div className='opacity-50 text-xs'>
                        {resources.length > 0 && (
                            <span>{resources.length} Resource{resources.length > 1 ? 's' : ''}</span>
                        )}
                        {(resources.length > 0 && passed.length > 0) && ', '}
                        {passed.length > 0 && (
                            <span>{passed.length} Optimized Resource{passed.length > 1 ? 's' : ''}</span>
                        )}
                    </div>
                </div>

                {(audit.settings.length > 0) && (
                    <div className='flex flex-col gap-3 px-4'>
                        <Settings type={group.type} audit={audit}/>
                    </div>
                )}

            </div>
        </>
    );
}

export default FilesTableHeader