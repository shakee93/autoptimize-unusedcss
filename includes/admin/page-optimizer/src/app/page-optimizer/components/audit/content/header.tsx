import Settings from "app/page-optimizer/components/audit/Settings";
import TooltipText from "components/ui/tooltip-text";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/24/solid";
import React, {Dispatch, SetStateAction, useMemo} from "react";
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
    index:number
}

const FilesTableHeader = ({audit, group, open, setOpen, index} : FilesTableHeaderProps) => {



    const label = (typeof group.items[0].url !== 'string' && group.items[0].url?.file_type?.label) || group.type
    let title = useMemo(() => {

        let l = label.toLowerCase()

        if (l === 'table') {
            return 'Additional Information'
        }


        if (l === 'unknown') {
            return  'Unattributable items';
        }

        return `${label} Files`;

    }, [group])

    if ("grouped_items" in audit.files && audit.files.grouped_items.length === 1 && label.toLowerCase() === 'unknown') {
        title = ''
    }

    let rows = group.items

    // @ts-ignore
    const resources = rows.filter((r) => !r?.passed) || []
    // @ts-ignore
    const passed = rows.filter((r) => r?.passed) || []

    return (
        <>
            <div
                data-tour={`${audit.id}-file-group-${index}-header`}
                className={cn(
                    'flex flex-col xl:flex-row justify-between xl:items-center gap-3 xl:gap-2 font-medium text-sm capitalize px-4 py-3',
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
                    <div
                        data-tour={`${audit.id}-group-${index}-settings`}
                        className='flex flex-col gap-3 xl:px-4'>
                        <Settings type={group.type} audit={audit}/>
                    </div>
                )}

            </div>
        </>
    );
}

export default FilesTableHeader