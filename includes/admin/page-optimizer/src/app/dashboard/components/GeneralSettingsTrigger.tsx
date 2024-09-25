import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "components/ui/dialog";
import AppButton from "components/ui/app-button";
import { Cog6ToothIcon } from "@heroicons/react/20/solid";
import TooltipText from "components/ui/tooltip-text";
import GeneralSettings from "app/dashboard/components/GeneralSettings";

interface MyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const GeneralSettingsTrigger: React.FC<MyDialogProps> = ({ open, onOpenChange }) => {


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <div>
                    <TooltipText text={`General Settings`}>
                        <Cog6ToothIcon className='w-5 text-brand-400'/>
                    </TooltipText>
                </div>
            </DialogTrigger>
            <DialogTitle></DialogTitle>
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader className='border-b px-6 py-4 mt-1'>
                    <DialogTitle>General Settings</DialogTitle>
                </DialogHeader>
                <div>
                    <GeneralSettings onClose={onOpenChange}/>
                </div>
                <DialogDescription>
                    {/* Additional description if needed */}
                </DialogDescription>
                {/*<DialogFooter className="px-6 py-3 border-t">*/}
                {/*    <AppButton onClick={() => onOpenChange(false)} variant='outline' className='text-sm'>*/}
                {/*        Close*/}
                {/*    </AppButton>*/}
                {/*    <AppButton*/}
                {/*        className="ml-2 bg-violet-950 text-sm font-semibold text-white py-1.5 px-4 rounded-lg hover:bg-violet-900"*/}
                {/*    >*/}
                {/*        Save Settings*/}
                {/*    </AppButton>*/}
                {/*</DialogFooter>*/}
            </DialogContent>
        </Dialog>
    );
};

export default GeneralSettingsTrigger;
