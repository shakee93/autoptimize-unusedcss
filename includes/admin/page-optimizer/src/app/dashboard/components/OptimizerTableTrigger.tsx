import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "components/ui/dialog";
import AppButton from "components/ui/app-button";
import OptimizerPagesTable from "app/dashboard/components/OptimizerPagesTable";

interface OptimizerTableTriggerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    settings: any;
}   

const OptimizerTableTrigger: React.FC<OptimizerTableTriggerProps> = ({ open, onOpenChange, settings }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTitle />
        <DialogContent className="sm:min-w-[950px] bg-brand-100/90 p-6 pt-12 sm:rounded-3xl">
        <DialogHeader className='border-b px-6 py-4 mt-1'>
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {/* Additional description if needed */}
                </DialogDescription>
            <div className="">
                <OptimizerPagesTable settings={settings} onOpenChange={onOpenChange} />
            </div>
            {/*<DialogFooter className="px-6 py-3 border-t">*/}
            {/*    <AppButton onClick={() => onOpenChange(false)} variant='outline' className='text-sm'>*/}
            {/*        Close*/}
            {/*    </AppButton>*/}
            {/*</DialogFooter>*/}
        </DialogContent>
    </Dialog>
);

export default OptimizerTableTrigger;
