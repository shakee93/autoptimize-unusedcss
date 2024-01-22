import {Label} from "components/ui/label";
import {Input} from "components/ui/input";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Switch} from "components/ui/switch";
import {InputProps, Textarea} from "components/ui/textarea";
import {JsonView} from "react-json-view-lite";
import FocusLock from "react-focus-lock";

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
import {cn, isDev} from "lib/utils";
import api from "../../../../services/api";
import ApiService from "../../../../services/api";
import {useAppContext} from "../../../../context/app";
import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/24/solid";
import {toast} from "components/ui/use-toast";
import {Loader} from "lucide-react";
import {m} from "framer-motion";

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

    useEffect(() => {
        console.log(activeCategory)
    },[activeCategory])


    const filteredValues = input?.control_values?.filter(
        (value) => value.type === activeCategory

    );

   return <div className='flex flex-col justify-start items-center gap-3 normal-case' >

        {input?.control_type === 'checkbox' &&

            <Label htmlFor="name" className="flex gap-2 items-center ml-4 text-left w-full">
                <span>{input.control_label}</span>
                <Switch
                    checked={value}
                    onCheckedChange={(c: boolean) => update(c, input.key)}/>

            </Label>

        }

       {input.control_type === 'textarea' &&


           <>
               <Label htmlFor="name" className="flex ml-4 text-left w-full">
                   <span>{input.control_label}</span>
               </Label>
               <FocusLock>
               <Textarea className="focus:outline-none focus-visible:ring-0" value={value} onChange={e =>  {
                   e.preventDefault()
                   update(e.target.value, input.key)
                   e.target.focus()
               }} />
               </FocusLock>
           </>

       }

       {input.control_type === 'button' && input.control_label != 'Exclude Files' &&
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

       }


       {input.control_type === 'button' && input.control_label === 'Exclude Files' &&
       <Label htmlFor="name" className="flex ml-4 text-left w-full">
           <div className="bg-white">
               <div className='flex gap-3'>
                   {excludeCategory.map((name, index) => (
                       <button key={index} onClick={e => setActiveCategory(name)}
                               className='flex gap-2 transition-all items-center border border-transparent py-[6px] pr-3 pl-[7px] rounded-2xl w-fit mb-4 hover:bg-brand-50 dark:bg-brand-950 bg-brand-0 dark:hover:border-brand-700/70 hover:shadow-md'>
                           {name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                       </button>
                   ))}

               </div>
               <div className='overflow-auto max-h-[200px]'>
                   {filteredValues.map((value: string, index: number) => (
                       <button key={index} className=' flex cursor-pointer gap-2 font-medium text-sm hover:bg-brand-100 dark:bg-brand-900 bg-white border w-fit rounded-xl items-center py-1.5 px-1.5 mr-2'>
                           {value?.name}
                       </button>
                   ))}
               </div>
                   

           </div>

           {/*{isDev && (<JsonView data={input} shouldInitiallyExpand={e => false}/>)}*/}
       </Label>
       }
    </div>
}

export default React.memo(Fields)