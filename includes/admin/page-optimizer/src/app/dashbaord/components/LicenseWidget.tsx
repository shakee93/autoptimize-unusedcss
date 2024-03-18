import React, {Suspense, useState} from 'react';
import Card from "components/ui/card";
import {cn} from "lib/utils";
import PerformanceIcons from "app/page-optimizer/components/performance-widgets/PerformanceIcons";
import { CheckBadgeIcon, EyeIcon, EyeSlashIcon,InformationCircleIcon  } from "@heroicons/react/24/outline";
import {Switch} from "components/ui/switch";
import {Label} from "components/ui/label";

const LicenseWidget = () => {
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
                <div className="content flex w-full sm:w-1/2 lg:w-full flex-col px-6 pt-6">
                    <div className='flex justify-between items-center'>
                        <div className="text-lg font-bold text-brand-400 dark:text-brand-300">Welcome back,</div>
                        <div className="">
                            <CheckBadgeIcon className="h-6 w-6 text-white bg-green-500 rounded-full" />
                        </div>
                    </div>
                    <div className="text-lg font-bold">Abdul Azeez</div>
                </div>
                <div className="content flex flex-col px-6 py-6 dark:bg-brand-900 bg-brand-100/90 m-6 rounded-3xl">
                    <div className='flex justify-end'>

                    </div>
                    <div className="grid gap-4 ">
                        <div>
                            <div className="flex justify-between">
                                <div className="text-sm font-semibold text-indigo-800">Email ID:</div>
                                {isVisible ? (
                                    <EyeIcon
                                        className="h-4 w-4 text-violet-300 hover:cursor-pointer"
                                        onClick={toggleVisibility}
                                    />
                                ) : (
                                    <EyeSlashIcon
                                        className="h-4 w-4 text-violet-300 hover:cursor-pointer"
                                        onClick={toggleVisibility}
                                    />
                                )}
                            </div>

                            <div className="text-sm font-semibold">
                                {isVisible ? (
                                    email
                                ) : (
                                    '*'.repeat(email.length)
                                )}</div>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-indigo-800">Exp. date:</div>
                            <div className="text-sm font-semibold">
                                {isVisible ? (
                                    expdate
                                ) : (
                                    '*'.repeat(expdate.length)
                                )}</div>
                        </div>

                        <div>
                            <div className="text-sm font-semibold text-indigo-800">License:</div>
                            <div className="text-sm font-semibold">
                                {isVisible ? (
                                    license
                                ) : (
                                    '*'.repeat(license.length)
                                )}</div>
                        </div>

                    </div>
                </div>

                <div className="content flex w-full sm:w-1/2 lg:w-full flex-col px-6 pb-6">
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-2 items-center'>
                            <div className="text-sm font-semibold dark:text-brand-300">Dev Mode</div>
                            <InformationCircleIcon className="h-[18px] w-[18px]" />
                        </div>
                        <Switch
                            checked={true}
                        />
                    </div>
                    <div className="text-xs text-brand-500 dark:text-brand-300 font-light">Explore Rapidload's Developer Mode without disrupting your
                        visitors' browsing encounters.
                    </div>
                    <button
                        className="mt-4 justify-center cursor-pointer transition duration-300 bg-purple-750 text-sm font-semibold text-white py-1.5 px-4 border border-purple rounded-lg">
                        View My Account
                    </button>

                </div>

            </Card>



        </div>
    </>
    );
};

export default LicenseWidget;
