import React, { FC, useState } from 'react';

interface Option {
    id: number;
    label: string;
}

interface SelectionBoxProps {
    options: Option[];
}

const SelectionBox: FC<SelectionBoxProps> = ({ options }) => {
    const [selectedOption, setSelectedOption] = useState<Option | undefined>(undefined);

    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const selectedOption = options.find((option: Option) => option.id === parseInt(selectedValue));
        setSelectedOption(selectedOption);
    };

    return (
        <div className="relative inline-block">
            <select
                className="px-2 py-1 bg-purple-200/[.2] rounded-lg border border-gray-200 w-36 appearance-none text-sm font-medium text-gray-900 dark:text-white focus:outline-none hover:cursor-pointer"
                onChange={handleSelect}>
                {/*<option value="">Select</option>*/}
                {options.map((option: Option) => (
                    <option className="text-sm font-medium text-gray-900 " key={option.id} value={option.id}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg width="10" height="13" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.93248 5C4.3564 5 4.58798 5.49443 4.31659 5.82009L2.88411 7.53907C2.68421 7.77894 2.31579 7.77894 2.11589 7.53907L0.683409 5.82009C0.412023 5.49443 0.643602 5 1.06752 5L3.93248 5Z" fill="#7F54B3"/>
                    <path d="M3.93248 3C4.3564 3 4.58798 2.50557 4.31659 2.17991L2.88411 0.460932C2.68421 0.221055 2.31579 0.221056 2.11589 0.460933L0.683409 2.17991C0.412023 2.50557 0.643602 3 1.06752 3L3.93248 3Z" fill="#7F54B3"/>
                </svg>

            </div>
        </div>
    );
};

export default SelectionBox;
