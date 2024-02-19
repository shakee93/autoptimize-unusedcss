import React, { Suspense, useState } from 'react';
import Card from "components/ui/card";
import { cn } from "lib/utils";
import PerformanceIcons from "app/page-optimizer/components/performance-widgets/PerformanceIcons";
import { CheckBadgeIcon, EyeIcon, EyeSlashIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { Switch } from "components/ui/switch";
import { Label } from "components/ui/label";
import { Skeleton } from "components/ui/skeleton"
import PerformanceProgressBar from "components/performance-progress-bar";

const UnusedCSSSummary = ({ settings }) => {


    return (
        <>
            <div className='w-full flex flex-col gap-4'>
                <Card data-tour='license-widget'
                      className={cn(
                          'overflow-hidden border border-transparent flex flex-col sm:flex-row lg:flex-col justify-around border-brand-200 dark:border-brand-800',
                      )}>

                    <div className="content flex w-full sm:w-1/2 lg:w-full flex-col px-6 py-6">
                        <div className='flex gap-2 items-center'>
                            <div className="text-sm font-semibold dark:text-brand-300">{settings.title}</div>
                            <InformationCircleIcon className="h-[18px] w-[18px]" />
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className="text-sm font-semibold dark:text-brand-300 text-brand-500">Total job count:</div>
                            <div className="text-sm font-semibold dark:text-brand-300">{settings.total_jobs}</div>
                        </div>
                        {settings.items.map((item, index) => (
                            <div key={index} className='flex justify-between items-center py-2'>
                                <div className='flex gap-2 items-center'>
                                    <div className="text-sm font-semibold dark:text-brand-300 text-brand-500">{item.label}:</div>
                                    <div className="text-sm font-semibold dark:text-brand-300">{item.value}</div>
                                </div>
                                <div className="px-1">
                                    <PerformanceProgressBar stroke={10} className={"max-h-[25px] text-sm"} scoreClassName={"text-[10px]"}
                                                            performance={item.performance}>
                                    </PerformanceProgressBar>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </>
    );
};

export default UnusedCSSSummary;
