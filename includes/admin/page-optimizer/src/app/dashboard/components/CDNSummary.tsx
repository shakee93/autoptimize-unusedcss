import React, {Suspense, useEffect, useState} from 'react';
import Card from "components/ui/card";
import {cn} from "lib/utils";
import PerformanceIcons from "app/page-optimizer/components/performance-widgets/PerformanceIcons";
import { CheckBadgeIcon, EyeIcon, EyeSlashIcon,InformationCircleIcon  } from "@heroicons/react/24/outline";
import {Switch} from "components/ui/switch";
import {Label} from "components/ui/label";
import {Skeleton} from "components/ui/skeleton"
import PerformanceProgressBar from "components/performance-progress-bar";
import {getSummary, saveGeneralSettings} from "../../../store/app/appActions";
import useCommonDispatch from "../../../hooks/useCommonDispatch";
import {useAppContext} from "../../../context/app";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/app/appTypes";
import {optimizerData} from "../../../store/app/appSelector";

interface SectionHeaderProps {
    title: string;
}

interface UsageBarProps {
    label: string;
    usage?: number;
    allowedUsage?: number;
    note?: string;
    used_gb_formatted?: string;
}

const CDNSummary = () => {

    const {dispatch} = useCommonDispatch();
    const {options} = useAppContext();
    const {cdnUsage, imageUsage, cacheUsage} = useSelector(optimizerData);

    const SectionHeader = ({title}: SectionHeaderProps) => (
        <div className="flex gap-2 items-center">
            <div className="text-base font-semibold dark:text-brand-300">{title}</div>
            <InformationCircleIcon className="h-[18px] w-[18px]"/>
        </div>
    );

    const UsageBar = ({label, usage = 0, allowedUsage = 0, note, used_gb_formatted}: UsageBarProps) => {

    const progressWidth = allowedUsage ? `${(usage / allowedUsage) * 100}` : "0";

    return (
        <div className="flex flex-col gap-1 py-2">

            <div className="flex items-center text-sm dark:text-brand-300 justify-between">
                <div className="flex gap-2 items-baseline">
                    <span className={`font-semibold ${label === 'Additional Usage' && 'text-brand-400'}`}>{label}</span>
                    <span
                        className="text-brand-400 text-xs">{usage < 1 ? used_gb_formatted? used_gb_formatted : 0 + ' MB' : usage} / {allowedUsage ? allowedUsage : 30} GB</span>
                </div>
                <div className="text-[10px] font-normal dark:text-brand-300 text-brand-400">
                    {note}
                </div>
            </div>
            <div
                className="relative w-full h-2.5 bg-brand-100 overflow-hidden rounded outline outline-1 outline-brand-200">
                <div
                    className="absolute h-2.5 bg-brand-950 rounded"
                    style={{width: progressWidth}}
                ></div>
            </div>

        </div>
    );

    };

    useEffect(() => {
        dispatch(getSummary(options, 'get_rapidload_cdn_usage'));
        dispatch(getSummary(options, 'get_rapidload_image_usage'));
        dispatch(getSummary(options, 'get_cache_file_size'));

    }, [dispatch]);

    // useEffect(() => {
    //     cdnUsage && console.log('CDN Summary', cdnUsage)
    //     imageUsage && console.log('Image Usage', imageUsage)
    //     cacheUsage && console.log('Cache Usage', cacheUsage)
    // }, [cdnUsage, imageUsage, cacheUsage]);

    return (
        <Card data-tour="license-widget" className="border flex flex-col">
            <div className="p-6">
                <SectionHeader title="Usage Summary"/>

                <UsageBar label="CDN" usage={cdnUsage.used_gb} allowedUsage={cdnUsage.allowed_gb} note="Limits will be updated on July 5" used_gb_formatted={cdnUsage.used_gb_formatted}/>
                {cdnUsage.additional_usage_gb > 0 &&
                    <UsageBar label="Additional Usage" usage={cdnUsage.additional_usage_gb} />
                }
            </div>

            <div
                className="p-6 pt-4 relative before:absolute before:left-0 before:right-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-white before:via-brand-200 before:to-white">
                <UsageBar label="Images" usage={imageUsage.used_gb} allowedUsage={imageUsage.allowed_gb} note="Limits will be updated on July 5" used_gb_formatted={imageUsage.used_gb_formatted}/>
                {imageUsage.additional_usage_gb > 0 &&
                    <UsageBar label="Additional Usage" usage={imageUsage.additional_usage_gb}/>
                }
            </div>

            <div className="flex justify-end p-6 pt-0 text-sm font-semibold">
                <button className="cursor-pointer bg-brand-100/90 text-brand-950 py-1.5 px-4 rounded-lg">
                    Manage usage
                </button>
            </div>
        </Card>

    );
};

export default CDNSummary;
