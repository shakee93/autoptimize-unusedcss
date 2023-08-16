import {Label} from "components/ui/label";
import {Input} from "components/ui/input";
import React, {useState} from "react";
import {Switch} from "components/ui/switch";
import {InputProps, Textarea} from "components/ui/textarea";
import {JsonView} from "react-json-view-lite";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "components/ui/select";

interface AdditionalInputsProps {
    data: AuditSettingInput[]
    updates: {
        key: string,
        value: any
    }[]
    update: (v: any, key: string ) => void
}

const AdditionalInputs = ({ data, updates, update }: AdditionalInputsProps) => {


    const renderSelectItems = (values: string[]) => {

        return values?.map((value: string) => (
            <SelectItem
                className="capitalize cursor-pointer"
                key={value}
                value={value}
            >
                {value}
            </SelectItem>
        ));
    };



    const fields = (input: AuditSettingInput) => {

        switch (input.control_type) {
            case "checkbox":
                return (
                    <Label htmlFor="name" className="flex gap-2 items-center ml-4 text-left w-full">
                        <span>{input.control_label}</span> <Switch checked={updates.find(i => i.key === input.key)?.value} onCheckedChange={(c: boolean) => update(c, input.key)}/>
                    </Label>
                )
            case "textarea":
                return(
                    <>
                        <Label htmlFor="name" className="flex ml-4 text-left w-full">
                            <span>{input.control_label}</span>

                        </Label>
                        <Textarea value={updates.find(i => i.key === input.key)?.value} onChange={e => update(e.target.value, input.key)}/>
                    </>
                )
            case "options":
                return(
                    <>
                        <Label htmlFor="name" className="flex items-center gap-4 ml-4 text-left w-full">
                            <span>{input.control_label}</span>
                            <Select value={updates.find(i => i.key === input.key)?.value}  onValueChange={v => update(v, input.key)}>
                                <SelectTrigger className="w-[180px] capitalize">
                                    <SelectValue placeholder="Select action"/>
                                </SelectTrigger>
                                <SelectContent className="z-[100001]">
                                    <SelectGroup>
                                        <SelectLabel>Actions</SelectLabel>
                                        {renderSelectItems(input.control_values)}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Label>
                    </>
                )
            default:
               return (
                   <Label htmlFor="name" className="flex flex-col gap-1 ml-4 text-left w-full">
                       {input.control_label ? input.control_label : input.key} <span className='text-xs opacity-50 mt'>unsupported input field - {input.control_type}</span>
                       <p>
                           {JSON.stringify(input)}
                       </p>
                   </Label>
               )
        }
    }


    return <>
        {
            data.map((input, index) => (
                    <div key={index} className="flex flex-col justify-start items-center gap-3">
                        {fields(input)}
                    </div>
                ))
        }

        {/*<JsonView data={updates}  shouldInitiallyExpand={e => false} />*/}
    </>
}

export default AdditionalInputs