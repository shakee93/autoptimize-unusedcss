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
    const [isVisible, setIsVisible] = useState(true);
    const email = "azeez@freshpixl.com";
    const expdate = "Oct 24";
    const license = "Professional";

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return ( <>

        <div className='w-full flex flex-col gap-4'>
            <Card data-tour='license-widget'
                  className={cn(
                      'overflow-hidden border border-transparent flex flex-col sm:flex-row lg:flex-col justify-around border-brand-200 dark:border-brand-800',
                  )}>

                <div className="content flex w-full sm:w-1/2 lg:w-full flex-col px-6 py-6">
                    <div className='flex gap-2 items-center'>
                        <div className="text-base font-semibold dark:text-brand-300">Usage Summary</div>
                        <InformationCircleIcon className="h-[18px] w-[18px]" />
                    </div>

                    <div className='my-2 mb-4'>


                    <div className='flex items-center py-2'>
                        <div className="text-sm dark:text-brand-300 gap-2 flex">
                            <span className="font-semibold">CDN</span>
                            <span className="text-brand-400">2.2GB / 10GB</span>
                        </div>
                    </div>
                    <div className='relative w-full mx-auto h-2.5 bg-violet-100 overflow-hidden rounded'>
                        <div className='will-change absolute  h-2.5 w-40 bg-[#7F54B3] rounded'></div>
                    </div>
                    <div className="text-xs font-normal dark:text-brand-300 text-brand-500 mt-1">Limits will be updated on July 5</div>

                    <div className='flex justify-between items-center py-2'>
                        <div className="text-sm dark:text-brand-300 gap-2 flex">
                            <span className="text-brand-400">Additional Usage</span>
                        </div>
                        <div className='flex gap-2.5 items-center'>
                            <div className='flex items-center gap-1'>
                                <div className="text-sm font-semibold dark:text-brand-300">Metering</div>
                                <InformationCircleIcon className="h-[18px] w-[18px]" />
                            </div>

                            <Switch
                                checked={true}
                            />
                        </div>

                    </div>
                    <div className='relative w-full mx-auto h-2.5 bg-violet-100 overflow-hidden rounded'>
                        <div className='will-change absolute  h-2.5 w-24 bg-[#7F54B3] rounded'></div>
                    </div>

                    </div>
                    {/*<div className='flex gap-2 items-center mt-5'>*/}
                    {/*    <div className="text-sm font-semibold dark:text-brand-300">Images</div>*/}
                    {/*    <InformationCircleIcon className="h-[18px] w-[18px]" />*/}
                    {/*</div>*/}
                    <div className='my-2 mb-4'>
                    <div className='flex justify-between items-center py-2'>
                        <div className="text-sm dark:text-brand-300 gap-2 flex">
                            <span className="font-semibold">Images</span>
                            <span className="text-brand-400">2.2GB / 10GB</span>
                        </div>

                    </div>
                    <div className='relative w-full mx-auto h-2.5 bg-violet-100 overflow-hidden rounded'>
                        <div className='will-change absolute  h-2.5 w-52 bg-[#7F54B3] rounded'></div>
                    </div>
                    <div className="text-xs font-normal dark:text-brand-300 text-brand-500 mt-1">Limits will be updated on July 5</div>

                    <div className='flex justify-between items-center py-2'>
                        <div className="text-sm dark:text-brand-300 gap-2 flex">
                            <span className="text-brand-400">Additional Usage</span>
                        </div>
                        <div className='flex gap-2.5 items-center'>
                            <div className='flex items-center gap-1'>
                                <div className="text-///sm font-semibold dark:text-brand-300">Metering</div>
                                <InformationCircleIcon className="h-[18px] w-[18px]" />
                            </div>

                            <Switch
                                checked={true}
                            />
                        </div>

                    </div>
                    <div className='relative w-full mx-auto h-2.5 bg-violet-100 overflow-hidden rounded'>
                        <div className='will-change absolute  h-2.5 w-24 bg-[#7F54B3] rounded'></div>
                    </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            className="mt-2 justify-center cursor-pointer transition duration-300 bg-violet-950 text-sm font-semibold text-white py-1.5 px-4 border border-violet-950  rounded-lg">
                            Manage your usage
                        </button>
                    </div>

                </div>

            </Card>



        </div>
    </>
    );
};

export default CDNSummary;
