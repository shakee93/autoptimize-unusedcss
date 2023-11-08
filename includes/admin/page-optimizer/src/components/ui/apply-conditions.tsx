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
import ConditionsDropdown from "components/ui/apply-conditions-dropdown";

const ApplyConditions = () => {
    const [open, setOpen] = React.useState(false);
    const [groupByConditions, setgroupByConditions] = useState(window?.rapidload_optimizer?.group_by_conditions )
    const [selectedOptions, setSelectedOptions] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');

    const handleSecondDropdownSelect = (selectedOption: string) => {
        const selectedGroupKey = Object.keys(groupByConditions).find(
            (key) => groupByConditions[key].label === selectedOption
        );
        setSelectedOptions(selectedGroupKey || '');
    };

    const apply = () => {
         console.log("Hello : ", groupByConditions);
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
                        <DialogContent asChild className="sm:max-w-[450px] cursor-auto inline-table">
                            <DialogHeader className='border-b px-6 py-7'>
                                <DialogTitle>Apply Conditions</DialogTitle>
                                <DialogDescription>
                                    Make changes to your <span className='lowercase'>Test</span> settings here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex gap-4 px-6 py-4">
                                <ConditionsDropdown
                                    optionsData={['Include', 'Exclude']}
                                    onSelect={(selectedOption) => {
                                        // Handle the selected option here
                                    }}
                                />
                                <ConditionsDropdown
                                    // optionsData={Object.keys(groupByConditions)}
                                    optionsData={Object.values(groupByConditions).map((condition) => condition.label)}
                                    onSelect={handleSecondDropdownSelect}
                                />

                                {selectedOptions && groupByConditions[selectedOptions]?.options && (
                                    <ConditionsDropdown
                                        optionsData={groupByConditions[selectedOptions].options.map((option) => option.label)}
                                        onSelect={(selectedOption) => {
                                            const selectedGroup = groupByConditions[selectedOptions]?.options.find((option) => option.label === selectedOption)?.group;
                                            setSelectedGroup(selectedGroup || '');
                                            //console.log(selectedGroup);
                                        }}

                                    />
                                )}
                                {selectedGroup != '' && (
                                    <ConditionsDropdown
                                        optionsData={['search']}
                                        onSelect={(selectedOption) => {
                                            //console.log(selectedOption);
                                        }}
                                    />
                                )}
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
