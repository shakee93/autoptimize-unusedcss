import {cn} from "lib/utils";
import React, {useEffect, useState} from "react";
import FilesTableHeader from "app/page-optimizer/components/audit/content/header";
import {Accordion} from "components/accordion";
import FileTable from "app/page-optimizer/components/audit/content/table";


interface FilesTableProps {
    audit: Audit
    group: any
    index: number
    notify: (val: boolean) => void
}

const FilesGroup = ({ audit, index, group, notify }: FilesTableProps) => {

    const [open, setOpen] = useState(index === 0)

    useEffect(() => {
        notify(true)
    }, [open])


    return (
        <div className="flex flex-col border-t">
            <div className={cn(
                'flex flex-col gap-3 justify-center ',
            )}>
                <FilesTableHeader audit={audit}
                                  open={open}
                                  setOpen={setOpen}
                                  group={group}
                />
            </div>

            <Accordion isOpen={open}>
                <FileTable group={group} audit={audit} />
            </Accordion>
        </div>
    )
}

export default FilesGroup