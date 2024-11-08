import React, { useState, useEffect } from 'react';
import Card from "components/ui/card";
import { useSelector } from "react-redux";
import { CheckBadgeIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import {optimizerData} from "../../../store/app/appSelector";

const LicenseWidget = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [licenseInfo, setLicenseInfo] = useState<License | null>(null);
    const { license } = useSelector(optimizerData);

    useEffect(() => {
        if(license){
            localStorage.setItem('rapidLoadLicense', JSON.stringify(license));
        }
        const storedLicense = localStorage.getItem('rapidLoadLicense');
        if (storedLicense) {
            try {
                const parsedLicense = JSON.parse(storedLicense);
                setLicenseInfo(parsedLicense);
            } catch (error) {
                console.error("Error parsing license data", error);
            }
        }
    }, [license]);


    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };


    return (
        <div className='w-full flex flex-col gap-4'>
            <Card data-tour='license-widget' className="border flex flex-col gap-4">
                <div className="flex flex-col p-6 pb-0 gap-2">
                    <div className="text-lg font-bold text-brand-400/50 dark:text-brand-300">Welcome back, <span
                        className="text-brand-950">{licenseInfo?.name}</span></div>

                    <div className="bg-purple-500/10 px-2.5 py-1.5 rounded-xl w-fit">
                        <div className="flex gap-2 items-center">
                            <CheckBadgeIcon className="h-4 w-4 text-white bg-purple-700 rounded-full" />
                            <span className="text-xs text-purple-800">Rapidload Activated</span>
                        </div>
                    </div>
                    {/*<div className="text-xs text-brand-500 dark:text-brand-300 font-light mt-2">Secured payments with Stripe.</div>*/}
                </div>


                <div className="grid gap-4 px-8 text-sm relative">
                    <div className="absolute right-10">
                        {isVisible ? (
                            <EyeIcon className="h-4 w-4 text-violet-300 hover:cursor-pointer"
                                     onClick={toggleVisibility}/>
                        ) : (
                            <EyeSlashIcon className="h-4 w-4 text-violet-300 hover:cursor-pointer"
                                          onClick={toggleVisibility}/>
                        )}
                    </div>
                    <div className="flex gap-1 text-sm">
                        <span>Email ID:</span>
                        <span className="font-semibold">
                                {isVisible ? (
                                    licenseInfo?.email
                                ) : (
                                    '*'.repeat((licenseInfo?.email || '').length)
                                )}
                                </span>
                    </div>

                    <div>
                        <div className="flex gap-1">
                            Exp. date:
                            <span className="text-sm font-semibold">
                                {isVisible ? (
                                    licenseInfo?.next_billing ? new Date(licenseInfo.next_billing * 1000).toLocaleDateString() : ''
                                ) : (
                                    '*'.repeat((licenseInfo?.next_billing ?? '').toString().length)
                                )}
                                </span>
                        </div>
                    </div>

                    <div>
                        <div className="flex gap-1">
                            License:
                            <span className="text-sm font-semibold">
                                 {isVisible ? (
                                     licenseInfo?.plan
                                 ) : (
                                     '*'.repeat((licenseInfo?.plan || '').length)
                                 )}
                                </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex gap-6 justify-end p-6 text-sm font-semibold relative before:absolute before:left-0 before:right-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-white before:via-brand-200 before:to-white">
                        <button
                            className="cursor-pointer text-brand-500 py-1.5"
                            onClick={() => window.open('https://app.rapidload.io/profile', 'blank')}>
                            View My Account
                        </button>
                        <button
                            className="cursor-pointer bg-brand-100/90 text-brand-950 py-1.5 px-4 rounded-lg"
                            onClick={() => window.open('https://app.rapidload.io/', 'blank')}
                        >
                            Upgrade
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default LicenseWidget;
