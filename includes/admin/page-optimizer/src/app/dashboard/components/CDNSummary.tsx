import React, {Suspense, useState} from 'react';
import Card from "components/ui/card";
import {cn} from "lib/utils";
import PerformanceIcons from "app/page-optimizer/components/performance-widgets/PerformanceIcons";
import { CheckBadgeIcon, EyeIcon, EyeSlashIcon,InformationCircleIcon  } from "@heroicons/react/24/outline";
import {Switch} from "components/ui/switch";
import {Label} from "components/ui/label";
import {Skeleton} from "components/ui/skeleton"
import PerformanceProgressBar from "components/performance-progress-bar";

const CDNSummary = () => {
    const SectionHeader = ({ title }) => (
        <div className="flex gap-2 items-center">
            <div className="text-base font-semibold dark:text-brand-300">{title}</div>
            <InformationCircleIcon className="h-[18px] w-[18px]" />
        </div>
    );

    const UsageBar = ({ label, usage, progressWidth, note }) => (
        <div className="flex flex-col gap-1 py-2">

                <div className="flex items-center text-sm dark:text-brand-300 justify-between">
                    <div className="flex gap-2 items-baseline">
                        <span className="font-semibold">{label}</span>
                        <span className="text-brand-400 text-xs">{usage}</span>
                    </div>
                    <div className="text-[10px] font-normal dark:text-brand-300 text-brand-500">
                        {note}
                    </div>
                </div>
            <div className="relative w-full h-2.5 bg-brand-100 overflow-hidden rounded outline outline-1 outline-brand-200">
                <div
                    className="absolute h-2.5 bg-brand-950 rounded"
                    style={{width: progressWidth}}
                ></div>
            </div>

        </div>
    );

    const UsageNote = ({note}) => (
        <div className="text-xs font-normal dark:text-brand-300 text-brand-500">
            {note}
        </div>
    );


    return (
        <Card data-tour="license-widget" className="border flex flex-col">
            <div className="p-6">
                <SectionHeader title="Usage Summary" />

                <UsageBar label="CDN" usage="2.2GB / 10GB" progressWidth="40%" note="Limits will be updated on July 5"/>

                <UsageBar label="Additional Usage" progressWidth="24%" />
            </div>

            <div className="p-6 pt-4 relative before:absolute before:left-0 before:right-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-white before:via-brand-200 before:to-white">
                <UsageBar label="Images" usage="2.2GB / 10GB" progressWidth="52%" note="Limits will be updated on July 5"/>

                <UsageBar label="Additional Usage" progressWidth="24%" />
            </div>

            <div className="flex justify-end p-6 pt-0 text-sm font-semibold">
                <button className="cursor-pointer bg-brand-100/90 text-brand-950 py-1.5 px-4 rounded-lg">
                    Manage your usage
                </button>
            </div>
        </Card>

    );
};

export default CDNSummary;
