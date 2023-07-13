import React, { FC, useState, useEffect, useRef } from 'react';
import {
    SelectionBoxIcon
} from '../parts/icon-svg';
interface Option {
    id: number;
    label: string;
}

interface SelectionBoxProps {
    options: Option[];
}

const SelectionBox: FC<SelectionBoxProps> = ({ options }) => {
    const [currentOption, setCurrentOption] = useState<Option | null>(options[0] || null);
    const [dropOn, setDropOn] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropOn(false);
            }
        };

        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const selectOption = (option: Option) => {
        setDropOn(false);
        setCurrentOption(option);
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                id="dropdownDefaultButton"
                onClick={() => setDropOn(!dropOn)}
                data-dropdown-toggle="dropdown"
                className={`flex px-1 py-1 text-purple-900 rounded-lg border border-gray-200 w-36 appearance-none text-sm font-medium text-gray-900 dark:text-white focus:outline-none hover:cursor-pointer ${dropOn ? 'border-b-white dark:border-b-gray-700 rounded-b-none':'border-b-gray-200'}`}
                type="button"
            >
                <span className={'flex px-[2px] py-[2px] bg-purple-200/[.2] w-full rounded pl-2 pt-1 pb-1'}> {currentOption ? currentOption.label : ''}</span>
            <SelectionBoxIcon/>

            </button>

            {dropOn && (
                <div className="w-full border border-gray-200 z-10 absolute bg-white rounded-lg rounded-t-none border-t-0 dark:bg-gray-700">
                    <ul className="text-sm text-gray-700 text-purple-900 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        {options.map((option: Option) => {
                            if (currentOption && option.id === currentOption.id) {
                                return null;
                            }
                            return (
                                <li
                                    className="m-1 hover:cursor-pointer block px-2 py-1 font-medium hover:bg-purple-200/[.2] rounded dark:hover:bg-gray-600 dark:hover:text-white"
                                    key={option.id}
                                    value={option.id}
                                    onClick={() => selectOption(option)}
                                >
                                    {option.label}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SelectionBox;
