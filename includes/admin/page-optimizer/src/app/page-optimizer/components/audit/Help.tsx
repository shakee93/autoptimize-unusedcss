import {useState} from "react";
import {Accordion} from "components/accordion";
import {QuestionMarkCircleIcon} from "@heroicons/react/20/solid";
import AppButton from "components/ui/app-button";
import {Button} from "components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "components/ui/dialog"

interface HelpProps {
    audit: Audit
}

const Help = ({ audit}: HelpProps) => {

    const [open, setOpen] = useState(false)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div onClick={e => setOpen(p => !p)}
                     className='flex gap-2 pb-1 px-2 items-center text-sm'>
                    {/*<QuestionMarkCircleIcon className='w-5 '/>*/}
                    What do I need do to improve this further? <Button variant='outline' className='text-xs px-3 h-7 '>How to Fix</Button>
                </div>
            </DialogTrigger>
            <DialogContent className='px-6 py-6 w-full max-w-[520px]'>
                <DialogHeader className='flex gap-2'>
                    <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default Help