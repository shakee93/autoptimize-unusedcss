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

interface SettingItemProps {
    settings: AuditSettings;
    index: number;
}

const Setting = ({settings, index}: SettingItemProps) => {

    let icons = {
        cache : <PageCache/>,
        image : <ImageDeliverySVG/>,
        javascript : <JavascriptDelivery/>,
        font : <FontDelivery/>,
        css : <CSSDelivery/>,
    }

    return (
        <div
            key={index}
            className="flex gap-2 items-center font-medium text-sm hover:bg-zinc-100 dark:bg-zinc-900 bg-zinc-50 dark:border-zinc-700 border border-zinc-200 w-fit rounded-xl items-center px-0.5 pr-2 py-1"
        >
            {icons[settings.category as keyof typeof icons]} {settings.name} <Switch/>
        </div>
    );
};

export default Setting;
