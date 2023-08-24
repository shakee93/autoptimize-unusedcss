import React, {useRef, useState} from 'react';
import {ArrowPathIcon, Cog8ToothIcon} from "@heroicons/react/24/solid";
import {
    CSSDelivery,
    JavascriptDelivery,
    ImageDeliverySVG,
    FontDelivery,
    CloudDelivery,
    PageCache,
} from '../icons/icon-svg';

import { Switch } from "components/ui/switch"
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

import {Settings, SettingsIcon} from "lucide-react";
import {Cog6ToothIcon} from "@heroicons/react/20/solid";
import {Textarea} from "components/ui/textarea";
import {JsonView} from "react-json-view-lite";
import AdditionalInputs from "app/page-optimizer/components/audit/additional-inputs";
import TooltipText from "components/ui/tooltip-text";

interface SettingItemProps {
    audit: Audit
    settings?: AuditSetting;
    index: number;
}

const Setting = ({audit, settings, index}: SettingItemProps) => {

    if (!settings) {
        return <></>
    }

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [mainInput, ...additionalInputs] = settings.inputs
    const [updates, setUpdates] = useState<{
        key: string,
        value: any
    }[]>(additionalInputs.map(({ key, value }) => ({ key, value })))

    const update = (val: any, key: string) => {
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
    }

    let icons = {
        cache : <PageCache/>,
        image : <ImageDeliverySVG/>,
        javascript : <JavascriptDelivery/>,
        js : <JavascriptDelivery/>,
        font : <FontDelivery/>,
        css : <CSSDelivery/>,
    }


    const updateValue = (value: any, key: string) => {

        dispatch(updateSettings(
            audit,
            settings,
            key,
            value
        ));
    }

    // temporarily show this popup on render blocking resources audit
    const showPopover = additionalInputs.length > 0

    const saveAdditionalSettings = () => {

        updates.forEach(({key, value}) => {
            updateValue(value, key)
        })

        setOpen(false);
    }

    return (
        <div
            key={index}
            className="flex cursor-pointer gap-2 font-medium text-sm hover:bg-zinc-100 dark:bg-zinc-900 bg-zinc-50 border w-fit rounded-xl items-center px-0.5 pr-2 py-1"
        >
            {icons[settings.category as keyof typeof icons]} {settings.name}
            {mainInput && (
                // @ts-ignore
                <Switch checked={mainInput.value} onCheckedChange={(c: boolean) => updateValue(c, mainInput.key)}/>
            )}

            {showPopover && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <div className='cursor-pointer'>
                            <TooltipText text={`${settings.name} Settings`}>
                                <Cog6ToothIcon className='w-[1.15rem] text-zinc-400'/>
                            </TooltipText>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px]">
                        <DialogHeader className='border-b px-6 py-7'>
                            <DialogTitle>{settings.name} Settings</DialogTitle>
                            <DialogDescription>
                                Make changes to your <span className='lowercase'>{settings.name}</span> settings here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 px-6 py-4">
                            <AdditionalInputs updates={updates} update={update} data={additionalInputs}/>
                        </div>
                        <DialogFooter className='px-6 py-3 border-t'>
                            <AppButton onClick={e => saveAdditionalSettings()} className='text-sm'>Save changes</AppButton>
                            <AppButton onClick={e => setOpen(false)} dark={false} className='text-sm'>Close</AppButton>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

        </div>
    );
};

export default Setting;
