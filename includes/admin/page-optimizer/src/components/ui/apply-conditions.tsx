import React, { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "components/ui/dialog";
import TooltipText from "components/ui/tooltip-text";
import {Cog6ToothIcon} from "@heroicons/react/20/solid";
import AdditionalInputs from "app/page-optimizer/components/audit/additional-inputs";
import AppButton from "components/ui/app-button";
import Mode from "app/page-optimizer/components/Mode";

const ApplyConditions = () => {
    const [open, setOpen] = React.useState(false);

    const apply = () => {
        console.log("Apply Conditions")
    }

    return (
        <div className="cursor-pointer select-none" onClick={apply}>

            <Mode>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger disabled asChild>
                            <div >
                                <TooltipText text={`Apply Conditions`}>
                                    <Cog6ToothIcon className='w-5 text-brand-400'/>
                                </TooltipText>
                            </div>
                        </DialogTrigger>
                        <DialogContent asChild className="sm:max-w-[450px] cursor-auto">
                            <DialogHeader className='border-b px-6 py-7'>
                                <DialogTitle>Apply Conditions</DialogTitle>
                                <DialogDescription>
                                    Make changes to your <span className='lowercase'>Test</span> settings here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 px-6 py-4">
                                {/*<AdditionalInputs updates={updates} update={update} data={additionalInputs}/>*/}
                            </div>
                            <DialogFooter className='px-6 py-3 border-t'>
                                <AppButton className='text-sm'>Save changes</AppButton>
                                <AppButton onClick={e => setOpen(false)} variant='outline' className='text-sm'>Close</AppButton>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

            </Mode>
        </div>
    );
};

export default ApplyConditions;
