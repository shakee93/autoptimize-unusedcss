import React from 'react';
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
import {AppAction, AppState} from "../../../../store/app/appTypes";
import {useDispatch} from "react-redux";
import {updateSettings} from "../../../../store/app/appActions";

import Button from "@/components/ui/button"

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
import SettingSwitch from "./option-elements/switch";
import SettingInput from "app/page-optimizer/components/audit/option-elements/input";

interface SettingItemProps {
    audit: Audit
    settings?: AuditSetting;
    index: number;
}

const Setting = ({audit, settings, index}: SettingItemProps) => {

    if (!settings) {
        return <></>
    }

    const dispatch: ThunkDispatch<AppState, unknown, AppAction> = useDispatch();

    let icons = {
        cache : <PageCache/>,
        image : <ImageDeliverySVG/>,
        javascript : <JavascriptDelivery/>,
        font : <FontDelivery/>,
        css : <CSSDelivery/>,
    }

    let mainInput = settings.inputs[0]
    let additionalSettings = settings.inputs

    const updateValue = (checked: boolean) => {

        dispatch(updateSettings(
            audit,
            settings,
            0,
            checked
        ));
    }

    // temporarily show this popup on render blocking resources audit
    const showPopover = audit.id === "render-blocking-resources"

    return (
        <div
            key={index}
            className="flex gap-2 font-medium text-sm hover:bg-zinc-100 dark:bg-zinc-900 bg-zinc-50 dark:border-zinc-700 border border-zinc-200 w-fit rounded-xl items-center px-0.5 pr-2 py-1"
        >
            {icons[settings.category as keyof typeof icons]} {settings.name}
            {mainInput && (
                // @ts-ignore
                <SettingSwitch checked={mainInput.value} onCheckedChange={(c: boolean) => updateValue(c)}/>
            )}

            {showPopover && (
                <Dialog>
                    <DialogTrigger asChild>
                        <button>
                            <Cog6ToothIcon className='w-[1.15rem] text-zinc-400'/>
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{settings.name} Settings</DialogTitle>
                            <DialogDescription>
                                Make changes to your <span className='lowercase'>{settings.name}</span> settings here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-5 pb-2">
                            {/* Let's have dynamic input's over here*/}
                            {/* use the option-element to create each type of control */}
                            <div className="flex flex-col justify-start items-center gap-3">
                                <SettingInput/>
                            </div>
                            <div className="flex flex-col justify-start items-center gap-3">
                                {/* extract this as a separate component */}
                                <Label htmlFor="name" className="ml-4 text-left w-full">
                                    Mobile Critical CSS
                                </Label>
                                <Input type='text' id="name" value="hello" className="col-span-4" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className='text-sm'>Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

        </div>
    );
};

export default Setting;
