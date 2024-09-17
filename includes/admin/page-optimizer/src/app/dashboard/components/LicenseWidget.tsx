import React, { useState, useEffect } from 'react';
import Card from "components/ui/card";
import { cn } from "lib/utils";
import { CheckBadgeIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const LicenseWidget = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [license, setLicense] = useState<License | null>(null);

    useEffect(() => {
        // Retrieve license data from localStorage
        const storedLicense = localStorage.getItem('rapidLoadLicense');

        if (storedLicense) {
            try {
                const parsedLicense = JSON.parse(storedLicense);
                setLicense(parsedLicense[0]);
            } catch (error) {
                console.error("Error parsing license data", error);
            }
        }
    }, []);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className='w-full flex flex-col gap-4'>
            <Card data-tour='license-widget' className={cn('overflow-hidden border border-transparent flex flex-col sm:flex-row lg:flex-col justify-around border-brand-200 dark:border-brand-800')}>
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
                    <div className="grid gap-4">
                        <div>
                            <div className="flex justify-between">
                                <div className="text-sm font-semibold text-indigo-800">Email ID:</div>
                                {isVisible ? (
                                    <EyeIcon className="h-4 w-4 text-violet-300 hover:cursor-pointer" onClick={toggleVisibility} />
                                ) : (
                                    <EyeSlashIcon className="h-4 w-4 text-violet-300 hover:cursor-pointer" onClick={toggleVisibility} />
                                )}
                            </div>
                            <div className="text-sm font-semibold">
                                {isVisible ? (
                                    license?.email
                                ) : (
                                    '*'.repeat((license?.email || '').length)
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-semibold text-indigo-800">Exp. date:</div>
                            <div className="text-sm font-semibold">
                                {isVisible ? (
                                    license?.next_billing ? new Date(license.next_billing * 1000).toLocaleDateString() : ''
                                ) : (
                                    '*'.repeat((license?.next_billing ?? '').toString().length)
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-semibold text-indigo-800">License:</div>
                            <div className="text-sm font-semibold">
                                {isVisible ? (
                                    license?.plan
                                ) : (
                                    '*'.repeat((license?.plan || '').length)
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="content flex w-full sm:w-1/2 lg:w-full flex-col px-6 pb-6">
                    <div className="text-xs text-brand-500 dark:text-brand-300 font-light">Your personal details are secured by RapidLoad.</div>
                    <div className="flex gap-6 justify-end">
                        <button className="mt-4 cursor-pointer transition duration-300 text-sm font-semibold text-brand-500 py-1.5">
                            View My Account
                        </button>
                        <button className="mt-4 cursor-pointer transition duration-300 bg-purple-750 text-sm font-semibold text-white py-1.5 px-4 border border-purple rounded-lg">
                            Upgrade Plan
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default LicenseWidget;
