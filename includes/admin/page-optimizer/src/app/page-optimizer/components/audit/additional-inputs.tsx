import {Label} from "components/ui/label";
import {Input} from "components/ui/input";
import React, {useCallback, useEffect, useMemo, useState} from "react";
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
import {Button} from "components/ui/button";
import {isDev} from "lib/utils";
import api from "../../../../services/api";
import ApiService from "../../../../services/api";
import {useAppContext} from "../../../../context/app";
import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/24/solid";
import {toast} from "components/ui/use-toast";
import {Loader} from "lucide-react";

interface AdditionalInputsProps {
    input?: AuditSettingInput
    data?: AuditSettingInput[]
    updates: {
        key: string,
        value: any
    }[]
    update: (v: any, key: string ) => void
}

const Fields = ({input, updates, update}: AdditionalInputsProps) => {

    const [loading, setLoading] = useState(false)
    const { options } = useAppContext()

    const value = useMemo(() => {

        if (!input) {
            return '';
        }

        return updates.find(i => i.key === input.key)?.value;
    }, [input, updates])

    if (!input) {
        return <></>
    }

    const buttonSubmit = async () => {
        if (input.action) {
            setLoading(true)

            try {

                const api = new ApiService(options, input.action)
                await api.post()

                toast({
                    description: <div className='flex w-full gap-2 text-center'>Your action is successful <CheckCircleIcon className='w-5 text-green-600'/></div>,
                })

            } catch (error: any) {

                toast({
                    description: <div className='flex w-full gap-2 text-center'>{error.message} <XCircleIcon className='w-5 text-red-600'/></div>,
                })


            }
            setLoading(false)
        }
    }

    switch (input.control_type) {
        case "checkbox":
            return (
                <Label htmlFor="name" className="flex gap-2 items-center ml-4 text-left w-full">
                    <span>{input.control_label}</span>
                    <Switch
                        checked={value}
                        onCheckedChange={(c: boolean) => update(c, input.key)}/>

                </Label>
            );
        case "textarea":
            return(
                <>
                    <Label htmlFor="name" className="flex ml-4 text-left w-full">
                        <span>{input.control_label}</span>
                    </Label>
                    <textarea value={value} onChange={e => update(e.target.value, input.key)} >

                    </textarea>
                </>
            );
        case "button":
            return(
                <>
                    <Label htmlFor="name" className="flex ml-4 text-left w-full">
                        <Button disabled={loading} className='flex gap-2' onClick={e => buttonSubmit()}
                                variant='outline'>
                            {loading && <Loader className='w-4 animate-spin -ml-1'/>}
                            {input.control_label}
                        </Button>
                        {/*{isDev && (<JsonView data={input} shouldInitiallyExpand={e => false}/>)}*/}
                    </Label>
                </>
            );
        case "options":
            return(
                <>
                    <Label htmlFor="name" className="flex items-center gap-4 ml-4 text-left w-full">
                        <span>{input.control_label}</span>
                        <Select value={value}  onValueChange={v => update(v, input.key)}>
                            <SelectTrigger className="w-[180px] capitalize">
                                <SelectValue placeholder="Select action"/>
                            </SelectTrigger>
                            <SelectContent className="z-[100001]">
                                <SelectGroup>
                                    <SelectLabel>Actions</SelectLabel>
                                    {input?.control_values?.map((value: string, index: number) => (
                                        <SelectItem
                                            className="capitalize cursor-pointer"
                                            key={index}
                                            value={value}
                                        >
                                            {value}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Label>
                </>
            );
        default:
            return (
                <Label htmlFor="name" className="flex flex-col gap-1 ml-4 text-left w-full">
                    {input.control_label ? input.control_label : input.key} <span className='text-xs opacity-50 mt'>unsupported input field - {input.control_type}</span>
                    <p>
                        {/*{JSON.stringify(input)}*/}
                    </p>
                </Label>
            );
    }
}

const AdditionalInputs = ({ data, updates, update }: AdditionalInputsProps) => {

    const value = useCallback((input: AuditSettingInput) => {

        if (!input) {
            return '';
        }

        return updates.find(i => i.key === input.key)?.value;
    }, [updates])

    return <>
        {
            data?.map((input, index) => (
                    <div key={index} className="flex flex-col justify-start items-center gap-3 normal-case">
                        {/*<Fields input={input} updates={updates} update={update}/>*/}

                        {/*{input.control_type === 'checkbox' &&*/}

                        {/*    <Label htmlFor="name" className="flex gap-2 items-center ml-4 text-left w-full">*/}
                        {/*        <span>{input.control_label}</span>*/}
                        {/*        <Switch*/}
                        {/*            checked={value(input)}*/}
                        {/*            onCheckedChange={(c: boolean) => update(c, input.key)}/>*/}

                        {/*    </Label>*/}

                        {/*}*/}
                    </div>
                ))
        }

        {/*<JsonView data={updates}  shouldInitiallyExpand={e => false} />*/}
    </>
}

export default AdditionalInputs