import {Label} from "components/ui/label";
import {Input} from "components/ui/input";
import React, {useState} from "react";
import {Switch} from "components/ui/switch";
import {InputProps, Textarea} from "components/ui/textarea";
import {JsonView} from "react-json-view-lite";


interface AdditionalInputsProps {
    data: AuditSettingInput[]
    updates: {
        key: string,
        value: any
    }[]
    update: (v: any, key: string ) => void
}

const AdditionalInputs = ({ data, updates, update }: AdditionalInputsProps) => {


    const fields = (input: AuditSettingInput) => {

        switch (input.control_type) {
            case "checkbox":
                return (
                    <Label htmlFor="name" className="flex gap-2 items-center ml-4 text-left w-full">
                        <span>{input.key}</span> <Switch checked={updates.find(i => i.key === input.key)?.value} onCheckedChange={(c: boolean) => update(c, input.key)}/>
                    </Label>
                )
            case "textarea":
                return(
                    <>
                        <Label htmlFor="name" className="flex ml-4 text-left w-full">
                            <span>{input.key}</span>
                        </Label>
                        <Textarea value={updates.find(i => i.key === input.key)?.value} onChange={e => update(e.target.value, input.key)}/>
                    </>
                )
            default:
               return (
                   <Label htmlFor="name" className="flex flex-col gap-1 ml-4 text-left w-full">
                       {input.key} <span className='text-xs opacity-50 mt'>unsupported input field - {input.control_type}</span>
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