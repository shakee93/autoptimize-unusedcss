import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "components/ui/select";
import React from "react";

interface AuditColumnDropdownProps {
    heading: AuditHeadings
}

const AuditColumnDropdown = ({ heading } : AuditColumnDropdownProps) => {

    return (
        <Select>
            <SelectTrigger className="w-[180px] capitalize">
                <SelectValue placeholder="Select action"/>
            </SelectTrigger>
            <SelectContent className='z-[100001]'>
                <SelectGroup>
                    <SelectLabel>Actions</SelectLabel>
                    {heading.control_values.map(value => (
                        <SelectItem className='capitalize cursor-pointer' key={value}
                                    value={value}>{value}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default AuditColumnDropdown