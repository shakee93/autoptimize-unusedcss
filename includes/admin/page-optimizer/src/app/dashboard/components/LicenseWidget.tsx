import React, {Suspense, useState, useEffect} from 'react';
import Card from "components/ui/card";
import {cn} from "lib/utils";
import PerformanceIcons from "app/page-optimizer/components/performance-widgets/PerformanceIcons";
import { CheckBadgeIcon, EyeIcon, EyeSlashIcon,InformationCircleIcon  } from "@heroicons/react/24/outline";
import {Switch} from "components/ui/switch";
import {Label} from "components/ui/label";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/app/appTypes";

const LicenseWidget = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [license, setLicense] = useState<License | null>(null);

    useEffect(() => {
        const storedLicense = localStorage.getItem('RapidloadLicense');
        if (storedLicense) {
            setLicense(JSON.parse(storedLicense));
            console.log(storedLicense)
        }
        console.log(window?.uucss_global?.active_modules.general)
    }, []);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return ( <>

        <div className='w-full flex flex-col gap-4'>
            <Card data-tour='license-widget'
                  className={cn(
                      'overflow-hidden border border-transparent flex flex-col sm:flex-row lg:flex-col justify-around border-brand-200 dark:border-brand-800',
                  )}>
                <div className="content flex w-full sm:w-1/2 lg:w-full flex-col px-6 pt-6 ">
                    <div className="text-lg font-bold text-brand-400 dark:text-brand-300">Welcome back,</div>
                    <div className="text-lg font-bold pb-2">{license?.name}</div>

                    <div className="bg-green-500/10 px-2.5 py-1.5 rounded-xl w-fit">
                        <div className="flex gap-2 items-center">
                            <CheckBadgeIcon className="h-4 w-4 text-white bg-green-500 rounded-full" />
                            <span className="text-xs text-green-600">Rapidload Activated</span>
                        </div>
                    </div>
                    <div className="text-xs text-brand-500 dark:text-brand-300 font-light mt-2">Secured payments with Stripe.</div>

                </div>
                <div className="content flex flex-col px-6 py-6 dark:bg-brand-900 bg-brand-100/90 my-3 mx-6 rounded-xl">
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
                                    license?.email
                                ) : (
                                    '*'.repeat((license?.email|| '').length)
                                )}</div>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-indigo-800">Exp. date:</div>
                            <div className="text-sm font-semibold">
                                {isVisible ? (license?.next_billing ? new Date(license.next_billing * 1000).toLocaleDateString() : '') : '*'.repeat((license?.next_billing ?? '').toString().length)}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-semibold text-indigo-800">License:</div>
                            <div className="text-sm font-semibold">
                                {isVisible ? (
                                    license?.plan
                                ) : (
                                    '*'.repeat(( license?.plan || '').length)
                                )}</div>
                        </div>

                    </div>
                </div>

                <div className="content flex w-full sm:w-1/2 lg:w-full flex-col px-6 pb-6">
                    {/*<div className='flex justify-between items-center'>*/}
                    {/*    <div className='flex gap-2 items-center'>*/}
                    {/*        <div className="text-sm font-semibold dark:text-brand-300">Dev Mode</div>*/}
                    {/*        <InformationCircleIcon className="h-[18px] w-[18px]" />*/}
                    {/*    </div>*/}
                    {/*    <Switch*/}
                    {/*        checked={true}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div className="text-xs text-brand-500 dark:text-brand-300 font-light">Your personal details are secured by RapidLoad.</div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="grid grid-cols-subgrid gap-3 col-span-3 justify-end">
                            <div className="col-start-2">
                                <button
                                    className="mt-4 justify-center cursor-pointer transition duration-300 text-sm font-semibold text-brand-500 py-1.5">
                                    View My Account
                                </button>
                            </div>
                            <div className="col-start-3">
                                <button
                                    className="mt-4 justify-center cursor-pointer transition duration-300 bg-purple-750 text-sm font-semibold text-white py-1.5 px-4 border border-purple rounded-lg">
                                    Upgrade Plan
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </Card>



        </div>
    </>
    );
};

export default LicenseWidget;
