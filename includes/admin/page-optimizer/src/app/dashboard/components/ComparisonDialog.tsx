import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "components/ui/dialog";
import ComparisonTable from "components/ui/compare-table";
import AppButton from "components/ui/app-button";

interface ComparisonDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}
const ComparisonDialog: React.FC<ComparisonDialogProps> = ({ open, setOpen }) => (
    <Dialog open={open} onOpenChange={setOpen}>
        {/*<DialogTrigger asChild>*/}
        {/*    <button className="cursor-pointer transition duration-300 text-sm font-semibold text-brand-500 py-1.5">*/}
        {/*        Compare performance gears*/}
        {/*    </button>*/}
        {/*</DialogTrigger>*/}
        <DialogTitle></DialogTitle>
        <DialogContent className="sm:max-w-[650px] sm:rounded-3xl gap-0">
            <DialogHeader className='px-10 pt-6'>
                <DialogTitle>Compare Performance Gears</DialogTitle>
                <DialogDescription>
                    Here is our Gear Mode Comparison Table, providing a clear and concise overview at a glance.
                </DialogDescription>
            </DialogHeader>
            <div className="pt-2">
                <ComparisonTable />
            </div>
            <DialogFooter className="p-6">
                <AppButton onClick={() => setOpen(false)} variant="outline" className="text-sm">
                    Close
                </AppButton>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default ComparisonDialog;
