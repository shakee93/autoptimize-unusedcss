import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ArrowPathIcon, CheckCircleIcon, Cog8ToothIcon, XCircleIcon} from "@heroicons/react/24/solid";
import {
    CSSDelivery,
    JavascriptDelivery,
    ImageDeliverySVG,
    FontDelivery,
    CloudDelivery,
    PageCache,
} from '../icons/icon-svg';
import ReactDOM from 'react-dom';
// import { Dialog, Transition } from '@headlessui/react';
// import { X } from "lucide-react";


import { Checkbox } from "components/ui/checkbox";
import {ThunkDispatch} from "redux-thunk";
import {AppAction, AppState, RootState} from "../../../../store/app/appTypes";
import {useDispatch} from "react-redux";
import {updateSettings} from "../../../../store/app/appActions";

import AppButton from "components/ui/app-button"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {Circle, GanttChart, Loader, Lock, RefreshCcw, Settings, SettingsIcon, Ban} from "lucide-react";
import {Cog6ToothIcon} from "@heroicons/react/20/solid";
import {Textarea} from "components/ui/textarea";
import {JsonView} from "react-json-view-lite";
import Fields from "app/page-optimizer/components/audit/additional-inputs";
import TooltipText from "components/ui/tooltip-text";
import Mode from "app/page-optimizer/components/Mode";
import {useAppContext} from "../../../../context/app";
import Indicator from "components/indicator";
import {cn} from "lib/utils";
import InProgress from "components/in-progress";
import {Button} from "components/ui/button";
import ApiService from "../../../../services/api";
import {toast} from "components/ui/use-toast";
import SlideLeft from "components/animation/SlideLeft";
import {AnimatePresence} from "framer-motion";

interface SettingItemProps {
    updateValue: ( setting: AuditSetting, value: any, key: any ) => void
    settings?: AuditSetting;
    index: number;
    showIcons?: boolean
    hideActions?: boolean
    actionRequired: boolean
}

export const Status = React.memo(({ status } : { status: AuditSetting['status']}) => {

    if (!status) {
        return  <></>
    }

    // status.status = 'processing';

    if (status.status === 'failed') {
        return (
        <>
            <div className='flex gap-2 items-center text-xs	border border-rose-600 w-fit rounded-lg '>
                <Indicator className='fill-rose-600'>
                    <div className='flex flex-col gap-0.5'>
                        <span className='flex gap-2 items-center'>
                            <Circle className='w-2 fill-rose-500 stroke-0'/>
                            Error while optimizing {status.error?.code && `(Code: ${status.error?.code})`}
                        </span>
                        <span className='text-brand-500 ml-4'>{status.error?.message ? status.error?.message : 'Failed to Optimize'}</span>
                    </div>
                </Indicator>
                Failed
            </div>
        </>
        );
    }

    if(status.status === 'queued') {
        return (
        <>
            <div className='flex gap-2 items-center text-xs	border border-amber-500 w-fit rounded-lg '>
                <Circle className={cn(
                    'animate-pulse w-2.5 fill-amber-500 stroke-0'
                )}/>
                Waiting in the queue
            </div>
        </>
        )
    }

    if(status.status === 'processing') {
        return (
        <>
            <div className=' flex gap-2 items-center text-xs w-fit rounded-lg'>
                <Loader className='w-4 animate-spin text-brand-800'/>
                Optimization in progress
            </div>
        </>
        )
    }

    if(status.status === 'success') {
        return (
            <>
                <div className=' flex gap-1.5 items-center text-xs w-fit rounded-lg'>
                    <Circle className={cn(
                        'animate-pulse w-2.5 fill-green-600 stroke-0 -mt-[1px]'
                    )}/>Optimized
                </div>
            </>
        )
    }
    return <></>;
})


const Setting = ({updateValue, settings, index, hideActions, showIcons = true, actionRequired}: SettingItemProps) => {

    if (!settings) {
        return <></>
    }

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const { mode , options} = useAppContext()
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = useState(false)

    const [mainInput, ...additionalInputs] = useMemo(() => settings.inputs, [settings])

    const [updates, setUpdates] = useState<{
        key: string,
        value: any
    }[]>(additionalInputs.map(({ key, value }) => ({ key, value })))

    const update = useCallback( (val: any, key: string) => {
        let changed = updates.find(i => i.key === key);

        if (changed) {
            setUpdates(
                updates.map(_i => {
                    if (_i.key === key) {
                        _i.value = val
                    }
                    return _i;
                })
            )
        } else {
            setUpdates([...updates, {
                key: key,
                value: val
            }])
        }
    }, [updates, settings, additionalInputs])

    let icons = useMemo(() => ( {
        cache : <PageCache/>,
        cdn : <CloudDelivery/>,
        image : <ImageDeliverySVG/>,
        javascript : <JavascriptDelivery/>,
        js : <JavascriptDelivery/>,
        font : <FontDelivery/>,
        css : <CSSDelivery/>,
    }), [])

    const showPopover = useMemo(() => additionalInputs.length > 0, [additionalInputs])

    const saveAdditionalSettings = useCallback( () => {

        updates.forEach(({key, value}) => {
            updateValue(settings, value, key)
        })

        setOpen(false);
    }, [updates, open])

    const buttonAction = async (input: AuditSettingInput) => {
        setLoading(true)

        try {
            let api = new ApiService(options, undefined, input.action || input.value || undefined )
            await api.post()

            toast({
                description: <div className='flex w-full gap-2 text-center'>Your action is successful <CheckCircleIcon className='w-5 text-green-600'/></div>,
            })
        } catch (error: any) {

            setLoading(false)
            toast({
                description: <div className='flex w-full gap-2 text-center'>{error.message} <XCircleIcon className='w-5 text-red-600'/></div>,
            })
        }
        setLoading(false);
    }

    const [checkboxState, setCheckboxState] = useState(mainInput.value);

    const handleCheckboxClick = () => {
        if (!actionRequired || ['onboard', 'preview'].includes(mode)) {
            return;
        }
        const newCheckboxState = !checkboxState;
        setCheckboxState(newCheckboxState);

        updateValue(settings, newCheckboxState, mainInput.key);
    };

    const [showStatus, setShowStatus] = useState(false);
    useEffect(() => {
        if(settings.status && mainInput.value){
            setShowStatus(true)
        }
      //  console.log(settings, ' : ', settings.status ,' : ' ,mainInput.value);
    },[]);

    return (
        <>
        <div
            key={index}
            className={cn(
                'relative flex  gap-2 font-medium text-base w-fit items-center pr-2 py-1',
                showIcons ? 'px-0.5': 'px-2'
            )}
        >
            {showIcons && icons[settings.category as keyof typeof icons]}
            {!hideActions && (
                <>
                    {mainInput && (
                        <>
                            {mainInput.control_type === 'checkbox' && (
                                <>
                                {!actionRequired &&
                                    <div className="absolute">
                                        <TooltipText text={<>No Action Required</>}>
                                            <Ban className='w-6 cursor-not-allowed absolute opacity-0 z-50 ml-1.5'/>
                                        </TooltipText>
                                    </div>

                                }

                                <Checkbox disabled={!actionRequired || ['onboard', 'preview'].includes(mode)}
                                          className={actionRequired ? '' : 'border-dashed'}
                                          checked={mainInput.value}
                                          onCheckedChange={(c: boolean) =>{
                                              setCheckboxState(c);
                                              updateValue(settings, c, mainInput.key);

                                          }}/>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
            <div className='flex flex-col'>
                <div className='relative flex gap-2 font-medium text-base w-fit items-center pr-2 py-0.5'>
                    <div className='select-none cursor-pointer' onClick={handleCheckboxClick}>{settings.name}</div>
                    {!hideActions && (
                        <>
                            {mainInput && (
                                <>
                                    {mainInput.control_type === 'button' && (
                                        <Button loading={loading} disabled={loading} onClick={e => buttonAction(mainInput)}
                                                className='flex -mr-0.5 gap-1 py-1 px-2.5 h-auto rounded-[8px]'>
                                            <span className='text-xs py-1 px-0.5'>{mainInput.control_label}</span>
                                        </Button>
                                    )}
                                </>
                            )}

                            <Mode>
                                {showPopover && settings.name != 'Delay Javascript' && (
                                    <Dialog open={open} onOpenChange={setOpen}>
                                        <DialogTrigger disabled asChild>
                                            <div >
                                                <TooltipText text={`${settings.name} Settings`}>
                                                    <Cog6ToothIcon className='w-5 text-brand-400'/>
                                                </TooltipText>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent asChild className="sm:max-w-[450px] cursor-auto">

                                            <DialogHeader className='border-b px-6 py-7'>
                                                <DialogTitle>{settings.name} Settings</DialogTitle>
                                                <DialogDescription>
                                                    Make changes to your <span className='lowercase'>{settings.name}</span> settings here. Click save when you're done.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="grid gap-4 px-6 py-4">
                                                {additionalInputs.map((input, index) =>
                                                    <div key={index} >
                                                        <Fields input={input} updates={updates} update={update} />
                                                    </div>
                                                )}
                                            </div>

                                            <DialogFooter className='px-6 py-3 border-t'>
                                                <AppButton onClick={e => saveAdditionalSettings()} className='text-sm'>Save changes</AppButton>
                                                <AppButton onClick={e => setOpen(false)} variant='outline' className='text-sm'>Close</AppButton>
                                            </DialogFooter>

                                        </DialogContent>
                                    </Dialog>
                                )}
                            </Mode>

                            {showStatus && (
                                <div className='px-1'>
                                    <Status status={settings.status}/>
                                </div>
                            )}

                            <Mode mode='onboard'>
                                <TooltipText text={<><span className='text-purple-750 font-medium'>PRO</span> feature</>}>
                                    <Lock className='w-4 text-brand-400'/>
                                </TooltipText>
                            </Mode>
                        </>

                    )}
                </div>

                <p className={`text-sm font-normal select-none ${settings.status? '': '-mt-1'}`} >{settings.description? settings.description : settings.name}</p>

            </div>


        </div>
        </>
    );
};

export default Setting;
