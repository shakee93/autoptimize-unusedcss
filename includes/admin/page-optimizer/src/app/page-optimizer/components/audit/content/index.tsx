import React, {Dispatch, SetStateAction, useEffect, useMemo} from "react";
import Description from "app/page-optimizer/components/audit/Description";
import Settings from "app/page-optimizer/components/audit/Settings";
import {JsonView} from "react-json-view-lite";

interface AuditContentProps {
    audit: Audit;
    helpOpen: boolean
    setHelpOpen: Dispatch<SetStateAction<boolean>>
}

import {
    RowData
} from "@tanstack/react-table";
import {isDev, transformFileType} from "lib/utils";
import FileGroup from "app/page-optimizer/components/audit/content/FileGroup";
import Treeview from "components/tree-view";
import {Circle, XIcon} from "lucide-react";
import {auditPoints} from "app/page-optimizer/components/audit/KeyPoints";
import {XCircleIcon} from "@heroicons/react/24/solid";
import SupportCard from "app/page-optimizer/components/audit/SupportCard";


declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        tableId: string
        type: string
    }
}



const AuditContent = ({audit, helpOpen, setHelpOpen}: AuditContentProps) => {


    if (isDev && audit.files?.type && !["table", "opportunity", "list", "criticalrequestchain"].includes(audit.files.type)) {
        return <JsonView data={audit} shouldInitiallyExpand={(level) => false}/>;
    }


    let remainingSettings = useMemo(() => (
        audit
        .settings
        // @ts-ignore
        .filter(s => ! audit.files?.grouped_items?.map(group => transformFileType(audit, group.type))
            .includes(s.category) )),
        [])

    let points = useMemo(() => {
        return auditPoints[audit.id] || []
    }, [])

    return (
        <div className="relative border-t w-full pt-4">
            {helpOpen &&
                <SupportCard setHelpOpen={setHelpOpen} audit={audit}/>
            }
            <div className="pb-4 text-brand-700 dark:text-brand-300">
                <div className="px-4 ml-2">
                   {/*<Help audit={audit}/>*/}
                    <Description content={audit.description}/>

                    {points.length > 0 &&
                        <ul className='px-3 mt-2 flex text-sm gap-3 text-brand-500 dark:text-brand-400'>
                            {points.map((point, index) => (
                                point && (<li key={index} className='flex gap-1.5 items-center'>
                                    <Circle className='w-2 stroke-none mt-[1px] fill-brand-300 dark:fill-brand-700'/> <span>{point}</span>
                                </li>)
                            ))}
                        </ul>
                    }

                </div>
            </div>

            {(audit.settings.length > 0 && remainingSettings.length > 0) && (
                <div  className='border-t py-4 px-4'>
                   <div data-tour={`${audit.id}-recommended-settings`} className='w-fit flex flex-col gap-3'>
                       <div className='font-medium text-sm ml-2'>
                           {audit.settings.length !== remainingSettings.length ? 'Additional Settings' : 'Recommended Settings'}
                       </div>
                       <Settings audit={audit} auditSettings={remainingSettings}/>
                   </div>
                </div>
            )}


            {(audit.files?.type === 'criticalrequestchain') &&
                <div className='border-t'>
                    <Treeview data={audit.files?.chains[Object.keys(audit.files.chains)[0]]}/>
                </div>
            }

            {((audit.files?.type === "opportunity" || audit.files?.type === "table")) &&
                audit.files?.grouped_items?.map((group, index) =>
                    <FileGroup
                        key={index}
                        index={index}
                        audit={audit}
                        group={group}
                    />
                )
            }

            {(audit.files?.type === "list" ) && (
                <>
                    {audit.files?.items.map((list, index) =>
                        (list?.type === 'table' && list.items?.length > 0) && (
                            <FileGroup
                                key={index}
                                index={index}
                                audit={audit}
                                group={list}
                                type='list'
                            />
                        )
                    )}
                </>
            )}
        </div>
    );
};

export default AuditContent;
