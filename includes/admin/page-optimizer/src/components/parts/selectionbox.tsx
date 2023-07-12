import React, { FC, useState, useEffect, useRef } from 'react';

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
                className={`flex px-2 py-1 bg-purple-200/[.2] rounded-lg border border-gray-200 w-36 appearance-none text-sm font-medium text-gray-900 dark:text-white focus:outline-none hover:cursor-pointer ${dropOn ? 'border-b-purple-200/[.2] rounded-b-none':'border-b-gray-200'}`}
                type="button"
            >
                {currentOption ? currentOption.label : ''}
                <svg
                    className="mt-1 right-2 absolute"
                    width="10"
                    height="13"
                    viewBox="0 0 5 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M3.93248 5C4.3564 5 4.58798 5.49443 4.31659 5.82009L2.88411 7.53907C2.68421 7.77894 2.31579 7.77894 2.11589 7.53907L0.683409 5.82009C0.412023 5.49443 0.643602 5 1.06752 5L3.93248 5Z"
                        fill="#7F54B3"
                    />
                    <path
                        d="M3.93248 3C4.3564 3 4.58798 2.50557 4.31659 2.17991L2.88411 0.460932C2.68421 0.221055 2.31579 0.221056 2.11589 0.460933L0.683409 2.17991C0.412023 2.50557 0.643602 3 1.06752 3L3.93248 3Z"
                        fill="#7F54B3"
                    />
                </svg>
            </button>

            {dropOn && (
                <div className="w-full border border-gray-200 z-10 absolute bg-white divide-y divide-gray-100 rounded-lg rounded-t-none border-t-0 dark:bg-gray-700">
                    <ul className="text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        {options.map((option: Option) => {
                            if (currentOption && option.id === currentOption.id) {
                                return null;
                            }
                            return (
                                <li
                                    className="hover:cursor-pointer block px-4 py-2 hover:bg-purple-200/[.2] rounded-lg dark:hover:bg-gray-600 dark:hover:text-white"
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
