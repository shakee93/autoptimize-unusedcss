import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "components/ui/dialog";
import { ContentSelector } from "components/ui/content-selector";
import AppButton from "components/ui/app-button";

interface OptimzePagesTriggerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: any;
}

const OptimzePagesTrigger: React.FC<OptimzePagesTriggerProps> = ({ open, onOpenChange, data }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTitle />
        <DialogContent className="sm:max-w-[650px]">
            <div className="py-2">
                <ContentSelector data={data} />
            </div>
            <DialogFooter className="px-6 py-3 border-t">
                <AppButton onClick={() => onOpenChange(false)} variant='outline' className='text-sm'>
                    Close
                </AppButton>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default OptimzePagesTrigger;
