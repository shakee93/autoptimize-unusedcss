import {cn} from "lib/utils";
import React, {useEffect, useState} from "react";
import FilesTableHeader from "app/page-optimizer/components/audit/content/header";
import Accordion from "components/accordion";
import FileTable from "app/page-optimizer/components/audit/content/table";
import {JsonView} from "react-json-view-lite";


interface FilesTableProps {
    audit: Audit
    group: any
    index: number
    type?: 'list' | 'table'
}

const FilesGroup = ({ audit, index, group, type = 'table' }: FilesTableProps) => {

    const [open, setOpen] = useState((type === 'table' && index === 0) || (type === 'list') )


    return (
        <div
            data-tour={`${audit.id}-group-${index}`}
            className={cn(
            "flex flex-col",
            type == 'table' && 'border-t'
        )}>
            {type == 'table' && (
                <div className={cn('flex flex-col gap-3 justify-center ')}>
                    <FilesTableHeader
                        index={index}
                        audit={audit}
                                      open={open}
                                      setOpen={setOpen}
                                      group={group}
                    />
                </div>
            )}

            <Accordion isOpen={open}>
                <FileTable
                    index={index}
                    group={group} audit={audit} />
                {/*<JsonView data={group}/>*/}
            </Accordion>


        </div>
    )
}

export default FilesGroup