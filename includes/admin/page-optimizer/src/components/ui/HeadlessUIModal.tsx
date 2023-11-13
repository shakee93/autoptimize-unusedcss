// HeadlessUiModal.tsx
import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import AdditionalInputs from 'app/page-optimizer/components/audit/additional-inputs';

interface HeadlessUiModalProps {
    open: boolean;
    onClose: () => void;
    settingsName: string;
    updates: any[]; // Assuming the type of updates, adjust as needed
    update: (val: any, key: string) => void;
    saveAdditionalSettings: () => void;
}

const HeadlessUiModal: React.FC<HeadlessUiModalProps> = ({
                                                         open,
                                                         onClose,
                                                         settingsName,
                                                         updates,
                                                         update,
                                                         saveAdditionalSettings,
                                                     }) => {
    return (
        <Transition show={open} as={React.Fragment}>
            <Dialog onClose={onClose}>
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30 z-[120000]" />

                <Transition.Child
                    as={React.Fragment}
                    enter="transform transition-opacity ease-in-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transform transition-opacity ease-in-out duration-300"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Dialog.Panel className="fixed inset-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-8">
                        <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                            {settingsName} Settings
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-muted-foreground">
                            Make changes to your <span className="lowercase">{settingsName}</span> settings here. Click save when you're done.
                        </Dialog.Description>

                        <div className="grid gap-4">
                            <AdditionalInputs updates={updates} update={update} data={updates} />
                        </div>

                        <div className="flex justify-end mt-4 space-x-2">
                            <button className="text-sm" onClick={saveAdditionalSettings}>
                                Save changes
                            </button>
                            <button className="text-sm" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
};

export default HeadlessUiModal;
