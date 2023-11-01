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
import {Cog6ToothIcon, InformationCircleIcon} from "@heroicons/react/20/solid";
import AdditionalInputs from "app/page-optimizer/components/audit/additional-inputs";
import AppButton from "components/ui/app-button";
import Mode from "app/page-optimizer/components/Mode";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/24/solid";

const ApplyConditions = () => {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = useState(window?.rapidload_optimizer )

    const apply = () => {
        console.log("Apply Conditions");
        console.log("Here : ", options.group_by_conditions);
    }

    return (
        <div className="cursor-pointer select-none" onClick={apply}>

            <Mode>
                    <Dialog open={open} onOpenChange={setOpen} >
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
                                <div
                                    className="w-full dark:bg-brand-950 bg-brand-0 border rounded-3xl flex flex-col justify-between items-center px-4 py-3">
                                    {/*<div*/}
                                    {/*     className={`min-w-[125px] cursor-pointer flex items-center gap-2 pl-4 pr-2 py-1.5 text-sm rounded-2xl dark:hover:bg-brand-800 hover:bg-brand-100 transition-colors `}>*/}

                                    {/*    {filesOrActions ? (*/}
                                    {/*        toggleFiles ? 'Hide Actions' : 'Show Actions'*/}
                                    {/*    ) : 'Learn More'}*/}


                                    {/*    {filesOrActions ? (*/}
                                    {/*        (toggleFiles) ?*/}
                                    {/*            <MinusCircleIcon className='w-6 h-6 dark:text-brand-500 text-brand-900'/> :*/}
                                    {/*            <PlusCircleIcon className='w-6 h-6 dark:text-brand-500 text-brand-900'/>*/}
                                    {/*    ) : (*/}
                                    {/*        (toggleFiles) ?*/}
                                    {/*            <MinusCircleIcon className='w-6 h-6 dark:text-brand-500 text-brand-900'/> :*/}
                                    {/*            <InformationCircleIcon className='w-6 h-6 dark:text-brand-500 text-brand-900'/>*/}
                                    {/*    )}*/}
                                    {/*</div>*/}
                            </div>
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
