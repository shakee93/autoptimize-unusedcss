import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "components/ui/dialog";
import { ContentSelector } from "components/ui/content-selector";
import AppButton from "components/ui/app-button";

interface OptimzePagesTriggerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: any;
}

const OptimzePagesTrigger: React.FC<OptimzePagesTriggerProps> = ({ open, onOpenChange, data }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTitle></DialogTitle>
        <DialogContent className="sm:max-w-[650px]">
        <DialogHeader className='border-b px-6 py-4 mt-1 hidden'>
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {/* Additional description if needed */}
                </DialogDescription>
            <div className="py-2">
                <ContentSelector data={data} onOpenChange={onOpenChange} />
            </div>
            <DialogFooter className="px-6 py-3 border-t">
                <AppButton onClick={() => onOpenChange(false)} variant='outline' className='text-sm dark:bg-brand-800/40 dark:text-brand-300 dark:hover:bg-brand-800/50'>
                    Close
                </AppButton>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default OptimzePagesTrigger;
