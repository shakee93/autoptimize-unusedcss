import React, { useRef, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
} from "components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "components/ui/button";
import { useAppContext } from "../../context/app";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/24/solid";

interface ConditionsDropdownProps {
    optionsData: string[];
    onSelect: (selectedOption: string) => void;
}

const ConditionsDropdown: React.FC<ConditionsDropdownProps> = ({ optionsData, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const refSaveButton = useRef<HTMLButtonElement | null>(null);
    const { global } = useAppContext();
    const [selectedOption, setSelectedOption] = useState(optionsData[0]); // Initialize with the first option

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <DropdownMenu>
                <DropdownMenuTrigger className='h-full px-2 pr-2.5'>
                <button
                    className='min-w-[125px] cursor-pointer flex items-center gap-2 pl-4 pr-2 py-1.5 text-sm rounded-2xl dark:hover:bg-brand-800 hover:bg-brand-100 transition-colors border whitespace-nowrap'>
                    {selectedOption === 'Include' ? (
                        <PlusCircleIcon className='w-6 h-6 dark:text-brand-500 text-brand-900' />
                    ) : selectedOption === 'Exclude' ? (
                        <MinusCircleIcon className='w-6 h-6 dark:text-brand-500 text-brand-900' />
                    ) : null}

                    {selectedOption}
                    <ChevronDown className='w-5' />
                </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent style={{
                    width: refSaveButton.current?.clientWidth || 200
                }} align='end' sideOffset={6}
                                     className='z-[110000] relative'>
                    {/*<DropdownMenuLabel>Additional Options</DropdownMenuLabel>*/}
                    {optionsData.map((action, index) => (
                        <span key={index}>
                            <DropdownMenuItem onClick={e => {
                                setTimeout(() => {
                                    handleOptionClick(action);
                                }, 100);
                            }}>{action}</DropdownMenuItem>
                        </span>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default ConditionsDropdown;
