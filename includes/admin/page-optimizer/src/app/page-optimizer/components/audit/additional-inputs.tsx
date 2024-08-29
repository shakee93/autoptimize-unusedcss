import {Label} from "components/ui/label";
import React, {useMemo, useState} from "react";
import {Switch} from "components/ui/switch";
import {Textarea} from "components/ui/textarea";
import { Checkbox } from "components/ui/checkbox";
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
import ApiService from "../../../../services/api";
import {useAppContext} from "../../../../context/app";
import {CheckCircleIcon, ChevronRightIcon, XCircleIcon, ChevronDownIcon} from "@heroicons/react/24/solid";
import {toast} from "components/ui/use-toast";
import {Loader} from "lucide-react";
// import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { ToggleGroup, ToggleGroupItem } from "components/ui/toggle-group";
import Accordion from "components/accordion";

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
    const excludeCategory = ['third_party', 'plugins', 'theme'];


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

    const [activeCategory, setActiveCategory]= useState('third_party')


    const groupedData = useMemo(() => {

        return (input?.control_values as ControlValue[])?.reduce((acc: {[key: string]: ControlValue[]}, item: ControlValue) => {
            if (!acc[item.type]) {
                acc[item.type] = [];
            }
            const isValueIncluded = Array.isArray(value) ? value.includes(item.id) : value === item.id;
            // const isValueIncluded = item.exclusions.every(exclusion => value.includes(exclusion));
            acc[item.type].push({ ...item, isSelected: isValueIncluded });
            return acc;
        }, {})

    }, [input, updates]);


    const handleSwitchChange = (isChecked: boolean, itemId: string) => {
        const updatedValue = isChecked
            ? [...(value || []), itemId]
            : (value || []).filter((id: string) => id !== itemId);

        update(updatedValue, input.key);
    };


    const [textValue, setTextValue] = useState(value);

    const handleChange = (e: any) => {
        e.preventDefault();
        setTextValue(e.target.value);
        update(e.target.value, input.key);
        setTimeout(() => {
            e.target.focus();
        }, 0);
    };



    return <div className='flex flex-col justify-start items-center gap-3 normal-case' >

        {input?.control_type === 'checkbox' && input.control_accordion_name != 'uucss-misc-options' &&

            <Label
                htmlFor="name"
                className="flex flex-col text-left w-full dark:text-brand-300 bg-brand-100/30 rounded-xl py-4 px-4 border border-brand-200/60"
            >
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span>{input.control_label}</span>
                        <span className="pt-2 text-sm font-normal text-gray-600 sm:max-w-[335px]">
                            {input.control_description}
                        </span>
                    </div>
                    <Switch
                        checked={value}
                        onCheckedChange={(c: boolean) => update(c, input.key)}
                        className="self-center"
                    />
                </div>
            </Label>


        }

        {input.control_type === 'textarea' &&

            <Label
                htmlFor="name"
                className="flex flex-col text-left w-full dark:text-brand-300 bg-brand-100/30 rounded-xl py-4 px-4 border border-brand-200/60"
            >
                <span>{input.control_label}</span>
                <span className="pt-2 text-sm font-normal text-gray-600">
                            {input.control_description}
                        </span>
                <Textarea id={input.key}
                          className="focus:outline-none focus-visible:ring-0 dark:text-brand-300 focus-visible:ring-offset-0 mt-2"
                          value={textValue}
                          onChange={handleChange}
                />
            </Label>
        }

        {input.control_type === 'button' && input.control_label != 'Exclude Javascript from Delaying' &&
            <Label htmlFor="name" className="flex ml-4 text-left w-full">
                <Button disabled={loading} className='flex gap-2' onClick={e => buttonSubmit()}
                        variant='outline'>
                    {loading && <Loader className='w-4 animate-spin -ml-1'/>}
                    {input.control_label}
                </Button>
                {/*{isDev && (<JsonView data={input} shouldInitiallyExpand={e => false}/>)}*/}
            </Label>
        }

        {input.control_type === 'options' &&
            <Label
                htmlFor="name"
                className="flex flex-col text-left w-full dark:text-brand-300 bg-brand-100/30 rounded-xl py-4 px-4 border border-brand-200/60"
            >
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span>{input.control_label}</span>
                        <span className="pt-2 text-sm font-normal text-gray-600 sm:max-w-[335px]">
                            {input.control_description}
                        </span>
                    </div>
                    <Select value={value}  onValueChange={v => update(v, input.key)}>
                        <SelectTrigger className="w-[130px] capitalize bg-brand-0">
                            <SelectValue placeholder="Select action"/>
                        </SelectTrigger>
                        <SelectContent className="z-[100001]">
                            <SelectGroup>
                                <SelectLabel>Actions</SelectLabel>
                                {(input?.control_values as string[])?.map((value: string, index: number) => (
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
                </div>
            </Label>


        }

        {input.control_type === 'number-range' &&

            <Label htmlFor="name" className="flex items-center gap-4 ml-4 text-left w-full">
                <div className="flex flex-col">
                    <span>{input.control_label}</span>
                    <span className="pt-2 text-sm font-normal text-gray-600 sm:max-w-[335px]">
                            {input.control_description}
                        </span>
                </div>
                <ToggleGroup
                    className="inline-flex bg-mauve6 rounded border border-1 space-x-px "
                    type="single"
                    value={String(value)} // this has been set to string because sometimes the data value returns as number
                    onValueChange={(v) => update(v, input.key)}
                    aria-label="Select action"
                >
                    {(input?.control_values as string[])?.map((value: string, index: number) => (
                        <ToggleGroupItem
                            key={index}
                            value={String(value)}
                            aria-label={value}
                        >
                            {value}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </Label>

        }

        {/*/!*accordion*!/*/}
        {/*{input.control_type === 'checkbox' && input.control_accordion_name === 'uucss-misc-options' && (() => {*/}
        {/*    const [isOpen, setIsOpen] = useState(false);*/}

        {/*    const toggleIsOpen = () => {*/}
        {/*        setIsOpen(prevState => !prevState);*/}
        {/*    }*/}


        {/*    return (*/}

        {/*        <Label*/}
        {/*            htmlFor="name"*/}
        {/*            className="flex flex-col text-left w-full dark:text-brand-300 bg-brand-100/30 rounded-xl py-4 px-4 border border-brand-200/60"*/}
        {/*        >*/}
        {/*            <div className="flex items-center justify-between cursor-pointer " onClick={toggleIsOpen} >*/}
        {/*                <div className="flex flex-col">*/}
        {/*                    <span>*/}
        {/*                    Misc Options*/}
        {/*                    </span>*/}
        {/*                    <span className="pt-2 text-sm font-normal text-gray-600 sm:max-w-[425px]">*/}
        {/*                    This base page optimization will be used on all the other pages in the selected group.*/}
        {/*                </span>*/}
        {/*                </div>*/}
        {/*                <ChevronRightIcon  className={`h-5 transition-all ${isOpen && 'rotate-[90deg]'}`} />*/}
        {/*            </div>*/}

        {/*            <Accordion*/}
        {/*                className="flex flex-col text-left w-full mt-4"*/}
        {/*                initialRender={true}*/}
        {/*                isOpen={isOpen}*/}
        {/*            >*/}
        {/*                <div className="flex flex-col gap-2">*/}
        {/*                    <div className="flex gap-2" >*/}
        {/*                        <Checkbox*/}
        {/*                            checked={value}*/}
        {/*                            onCheckedChange={(c: boolean) => update(c, input.key)}*/}
        {/*                        />*/}
        {/*                        <div className="flex flex-col mt-1">*/}
        {/*                            <span className="cursor-pointer" onClick={() => update(!value, input.key)}>{input.control_label}</span>*/}
        {/*                            <span className="pt-1 text-sm font-normal text-gray-600 sm:max-w-[425px]">*/}
        {/*                                Remove unused CSS Variables*/}
        {/*                            </span>*/}
        {/*                        </div>*/}

        {/*                    </div>*/}

        {/*                </div>*/}
        {/*            </Accordion>*/}


        {/*        </Label>*/}


        {/*    );*/}
        {/*})()}*/}

        {input.control_type === 'button' && input.control_label === 'Exclude Javascript from Delaying' &&

            <div className="w-full">
                <div className='flex bg-brand-100/60 w-fit rounded-t-lg'>
                    {excludeCategory.map((name, index) => (
                        <button key={index} onClick={e => setActiveCategory(name)}
                                className={`flex items-center border-b-white py-2 px-4 w-fit dark:text-brand-300 ${name === "third_party" ? 'rounded-tl-lg':'' || name === "theme" ? 'rounded-tr-lg ':''} ${activeCategory === name ? 'bg-white dark:bg-brand-900 rounded-t-lg' : 'dark:bg-brand-950 bg-brand-200/60 text-slate-500'} dark:hover:border-brand-700/70 `}>
                            {name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                        </button>
                    ))}

                </div>
                <div className='flex flex-wrap gap-2 overflow-y-auto scrollbar-stable max-h-[300px] w-full bg-white dark:border-brand-900 rounded-md rounded-tl-none px-4 py-4 dark:bg-brand-900 '>
                    {Array.isArray(groupedData[activeCategory]) && groupedData[activeCategory] && (
                        activeCategory == 'third_party' && (
                            <>
                                {groupedData[activeCategory].map((item, index: number) => (
                                    <div key={index} className='flex gap-2 cursor-pointer font-medium text-sm bg-purple-50/60 dark:text-brand-300 dark:bg-brand-950 border border-brand-200/60 dark:border-brand-950 w-fit rounded-xl items-center py-1.5 px-2'>
                                        {item?.name}
                                        <Switch
                                            checked={item?.isSelected}
                                            onCheckedChange={(checked) => handleSwitchChange(checked, item.id)}
                                        />
                                    </div>
                                ))}
                            </>
                        )
                    )}
                    {Array.isArray(groupedData[activeCategory]) && groupedData[activeCategory] && (
                        activeCategory == 'plugins' && (
                            <>
                                {groupedData[activeCategory].map((item, index: number) => (
                                    <div key={index}
                                         className='flex gap-2 cursor-pointer font-medium text-sm bg-purple-50/60 dark:text-brand-300 dark:bg-brand-950 border border-brand-200/60 dark:border-brand-950 w-fit rounded-xl items-center py-1.5 px-2'>
                                        {item?.name}
                                        <Switch
                                            checked={item?.isSelected}
                                            onCheckedChange={(checked) => handleSwitchChange(checked, item.id)}
                                        />
                                    </div>
                                ))}
                            </>
                        )
                    )}
                    {Array.isArray(groupedData[activeCategory]) && groupedData[activeCategory] && (
                        activeCategory == 'theme' && (
                            <>
                                {groupedData[activeCategory].map((item, index: number) => (
                                    <div key={index}
                                         className=' flex gap-2 cursor-pointer font-medium text-sm bg-purple-50/60 dark:text-brand-300 dark:bg-brand-950 border border-brand-200/60 dark:border-brand-950 w-fit rounded-xl items-center py-1.5 px-2'>
                                        {item?.name}
                                        <Switch
                                            checked={item?.isSelected}
                                            onCheckedChange={(checked) => handleSwitchChange(checked, item.id)}
                                        />

                                    </div>
                                ))}
                            </>
                        )
                    )}
                </div>
            </div>
        }
    </div>
}

export default React.memo(Fields)