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

    let icons = {
        cache : <PageCache/>,
        image : <ImageDeliverySVG/>,
        javascript : <JavascriptDelivery/>,
        font : <FontDelivery/>,
        css : <CSSDelivery/>,
    }

    let [mainInput, ...additionalInputs] = settings.inputs

    
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

    return (
        <div
            key={index}
            className="flex gap-2 font-medium text-sm hover:bg-zinc-100 dark:bg-zinc-900 bg-zinc-50 dark:border-zinc-700 border border-zinc-200 w-fit rounded-xl items-center px-0.5 pr-2 py-1"
        >
            {icons[settings.category as keyof typeof icons]} {settings.name}
            {mainInput && (
                // @ts-ignore
                <Switch checked={mainInput.value} onCheckedChange={(c: boolean) => updateValue(c, mainInput.key)}/>
            )}

            {showPopover && (
                <Dialog open={open} onOpenChange={setOpen}>
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
                            <AdditionalInputs update={updateValue} data={additionalInputs}/>
                            {/*<JsonView data={additionalInputs} shouldInitiallyExpand={e => false}/>*/}
                        </div>
                        <DialogFooter>
                            <AppButton className='text-sm'>Save changes</AppButton>
                            <AppButton onClick={e => setOpen(false)} dark={false} className='text-sm'>Close</AppButton>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

        </div>
    );
};

export default Setting;
