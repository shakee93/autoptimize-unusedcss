import React, {Suspense, useState} from 'react';
import Card from "components/ui/card";
import {cn} from "lib/utils";
import PerformanceIcons from "app/page-optimizer/components/performance-widgets/PerformanceIcons";
import { CheckBadgeIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const LicenseWidget = () => {
    const [isVisible, setIsVisible] = useState(true);
    const email = "azeez@freshpixl.com";

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return ( <>

        <div className='w-full flex flex-col gap-4'>
            <Card data-tour='speed-insights'
                  className={cn(
                      'overflow-hidden border border-transparent flex flex-col sm:flex-row lg:flex-col justify-around border-brand-200 dark:border-brand-800',
                  )}>
                <div className="content flex w-full sm:w-1/2 lg:w-full flex-col px-4 lg:px-4 lg:pb-0 xl:px-8 py-2.5">
                    <div className='flex justify-between'>
                        <div className="text-xl font-bold">Welcome back,</div>
                        <div className="">
                            <CheckBadgeIcon className="h-6 w-6 text-white bg-green-500 rounded-full" />
                        </div>
                    </div>
                    <div className="text-xl font-bold">Abdul Azeez</div>
                </div>
                <div className="content flex flex-col px-4 py-2.5 dark:bg-brand-900 bg-brand-200/60 m-6 rounded-3xl">
                    <div className='flex justify-end'>
                        <div className="">
                            {isVisible ? (
                                <EyeIcon
                                    className="h-6 w-6 text-violet-300 hover:cursor-pointer"
                                    onClick={toggleVisibility}
                                />
                            ) : (
                                <EyeSlashIcon
                                    className="h-6 w-6 text-violet-300 hover:cursor-pointer"
                                    onClick={toggleVisibility}
                                />
                            )}
                        </div>
                    </div>
                    <div className="text-sm font-bold text-indigo-800">Email ID:</div>
                    <div className="text-sm font-bold">
                        {isVisible ? (
                        email
                    ) : (
                        '*'.repeat(email.length)
                    )}</div>
                    <div className="text-sm font-bold text-indigo-800">Email ID:</div>
                    <div className="text-sm font-bold">
                        {isVisible ? (
                            email
                        ) : (
                            '*'.repeat(email.length)
                        )}</div>
                </div>

            </Card>



        </div>
    </>
    );
};

export default LicenseWidget;
