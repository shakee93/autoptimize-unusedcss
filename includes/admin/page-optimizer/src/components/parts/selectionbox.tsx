import React, { useState } from 'react';

interface Option {
    id: number;
    label: string;
}

interface SelectionBoxProps {
    options: Option[];
}

const SelectionBox: React.FC<SelectionBoxProps> = ({ options }) => {
    const [selectedOption, setSelectedOption] = useState<Option | undefined>(undefined);

    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const selectedOption = options.find((option: Option) => option.id === parseInt(selectedValue));
        setSelectedOption(selectedOption);
    };

    return (
        <div>
            <select onChange={handleSelect}>
                <option value="">Select</option>
                {options.map((option: Option) => (
                    <option key={option.id} value={option.id}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectionBox;
