import {cn} from "lib/utils";
import React, {useEffect, useState} from "react";
import FilesTableHeader from "app/page-optimizer/components/audit/content/header";
import {Accordion} from "components/accordion";
import FileTable from "app/page-optimizer/components/audit/content/table";
import {JsonView} from "react-json-view-lite";


interface FilesTableProps {
    audit: Audit
    group: any
    index: number
    notify: (val: boolean) => void
    type?: 'list' | 'table'
}

const FilesGroup = ({ audit, index, group, notify, type = 'table' }: FilesTableProps) => {

    const [open, setOpen] = useState((type === 'table' && index === 0) || (type === 'list') )

    useEffect(() => {
        notify(true)
    }, [open])

    return (
        <div className={cn(
            "flex flex-col",
            type == 'table' && 'border-t'
        )}>
            {type == 'table' && (
                <div className={cn('flex flex-col gap-3 justify-center ')}>
                    <FilesTableHeader audit={audit}
                                      open={open}
                                      setOpen={setOpen}
                                      group={group}
                    />
                </div>
            )}

            <Accordion isOpen={open}>
                <FileTable group={group} audit={audit} />
                {/*<JsonView data={group}/>*/}
            </Accordion>


        </div>
    )
}

export default FilesGroup