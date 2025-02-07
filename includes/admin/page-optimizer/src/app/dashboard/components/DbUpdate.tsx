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
import AppButton from "components/ui/app-button"
import { CheckCircleIcon, Loader, XCircleIcon } from 'lucide-react';
import ApiService from "../../../services/api";
import { useAppContext } from "../../../context/app";
import { toast } from "components/ui/use-toast";

interface MyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DbUpdate: React.FC<MyDialogProps> = ({ open, onOpenChange }) => {
    const [loading, setLoading] = useState(false);
    const { options } = useAppContext();
    const optimizerUrl = options?.optimizer_url;

    const handleDbUpdate = async () => {
        setLoading(true);
        const api = new ApiService(options);
        let response;
        try {
            response = await api.post('rapidload_db_update', {
                url: optimizerUrl
            });
        toast({
            // title: 'Database updated',
            description : (
                <div className="flex w-full gap-2 text-center items-center">
                    <CheckCircleIcon className="w-5 text-green-600" /> Database has been updated successfully 
                </div>
            ),
            });
            
            onOpenChange(false);
        } catch (error) {
            toast({
                // title: 'Error',
                description:  (
                    <div className="flex w-full gap-2 text-center items-center">
                        <XCircleIcon className='w-5 text-red-600' /> An error occurred while updating the database. {response}
                    </div>
                ),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {/* <div>
                    <TooltipText text={`Db Update`}>
                        <Cog6ToothIcon className='w-5 text-brand-400'/>
                    </TooltipText>
                </div> */}
            </DialogTrigger>
            <DialogTitle></DialogTitle>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader className='border-b px-6 py-4 mt-1'>
                    <DialogTitle>RapidLoad Database Update</DialogTitle>
                </DialogHeader>
                <div className="px-6 py-2 text-sm font-normal select-none">
                    {/* <GeneralSettings onClose={onOpenChange}/> */}
                    A new version has been released. To work without issues, please update your database by clicking the update button.
                </div>
                
                <DialogFooter className="p-6 pt-0 flex gap-2">
                <AppButton
                    onClick={handleDbUpdate}
                    className="text-sm font-semibold text-white py-1.5 px-4 rounded-lg"
                >
                    {loading && <Loader className='w-4 animate-spin '/> } Update
                </AppButton>
                <AppButton onClick={() => onOpenChange(false)} variant="outline" className="text-sm">
                    Close
                </AppButton>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DbUpdate;
