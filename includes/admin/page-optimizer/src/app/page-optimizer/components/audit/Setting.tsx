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
import {fetchData, updateSettings} from "../../../../store/app/appActions";

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

    const updateValue = (checked: boolean) => {

        dispatch(updateSettings(
            audit,
            settings,
             0,
            checked
        ));
    }

    return (
        <div
            key={index}
            className="flex gap-2 font-medium text-sm hover:bg-zinc-100 dark:bg-zinc-900 bg-zinc-50 dark:border-zinc-700 border border-zinc-200 w-fit rounded-xl items-center px-0.5 pr-2 py-1"
        >
            {icons[settings.category as keyof typeof icons]} {settings.name}
            {mainInput && (
                <Switch name={mainInput.key} checked={mainInput.value} onCheckedChange={c => updateValue(c)}/>
            )}
        </div>
    );
};

export default Setting;
