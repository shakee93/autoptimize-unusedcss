import React, { useState, useEffect } from 'react';
import Card from "components/ui/card";
import { useSelector } from "react-redux";
import { CheckBadgeIcon, EyeIcon, EyeSlashIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { optimizerData } from "../../../store/app/appSelector";
import { Input } from "components/ui/input";
import { updateLicense } from "../../../store/app/appActions";
import { useAppContext } from "../../../context/app";
import useCommonDispatch from "hooks/useCommonDispatch";
import { AnimatePresence, motion } from 'framer-motion';
import { Loader } from "lucide-react";

type InputChangeHandler = React.ChangeEventHandler<HTMLInputElement>;

const LicenseWidget = () => {
    const [isVisible, setIsVisible] = useState(true);

    const [licenseMessage, setLicenseMessage] = useState("");
    const { license } = useSelector(optimizerData);
    const { options } = useAppContext();
    const { dispatch, rapidload_license_data_dummy } = useCommonDispatch();

    const [licenseInfo, setLicenseInfo] = useState<License | null>(() => rapidload_license_data_dummy);
    const [inputLicense, setInputLicense] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [loading, setLoading] = useState(false);
   
   


    useEffect(() => setLicenseMessage(""), [inputLicense]);

    const handleLicenseInputChange: InputChangeHandler = (event) => {
        setInputLicense(event.target.value);
    };

    const connectRapidloadLicense = async () => {
        setLoading(true);
        const response = await dispatch(updateLicense(options, inputLicense));
        setLoading(false);

        if (response.success) {
            dispatch(updateLicense(options));
            setTimeout(() => (window.location.hash = '#/'), 300);
        } else {
            setLicenseMessage(response.error || '');
        }
    };

    useEffect(() => {
        if (license && !licenseInfo) {
            setLicenseInfo(license);
        }
    }, [license]);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const renderLicenseStatus = () => {
        const isActivated = !!licenseInfo;
        const Icon = isActivated ? CheckBadgeIcon : XCircleIcon;
        const textColor = isActivated ? "text-purple-900/90  dark:text-brand-300" : "text-red-600  dark:text-brand-300";
        const bgColor = isActivated ? "text-purple-900/80 dark:text-brand-300" : "text-red-600  dark:text-brand-300";
        const statusText = isActivated ? "Rapidload Activated" : "Rapidload Deactivated";

        return (
            <div className="flex gap-2 items-center">
                <Icon className={`h-4 w-4 ${bgColor}`} />
                <span className={`text-xs ${textColor}`}>{statusText}</span>
            </div>
        );
    };

    const licenseFields = [
        { label: 'Email', value: licenseInfo?.email },
        {
            label: 'Next Billing',
            value: licenseInfo?.next_billing
                ? new Date(licenseInfo.next_billing * 1000).toLocaleDateString()
                : ''
        },
        { label: 'Plan', value: licenseInfo?.plan },
        { label: 'Active Domain', value: licenseInfo?.licensedDomain? licenseInfo?.licensedDomain : options.optimizer_url}
    ];

    const renderLicenseDetails = () => (
        <div className="relative space-y-3">
            {/* <button 
                onClick={toggleVisibility}
                className="absolute right-0 -top-4 p-1.5 rounded-full transition-colors"
                aria-label={isVisible ? "Hide details" : "Show details"}
            >
                {isVisible ? (
                    <EyeIcon className="h-4 w-4 text-violet-400" />
                ) : (
                    <EyeSlashIcon className="h-4 w-4 text-violet-400" />
                )}
            </button> */}

           

            {licenseFields.map(({ label, value }, index) => (
                <div
                    key={label}
                    className="flex gap-2 items-center text-sm"
                >
                    <span className="font-medium text-brand-950 dark:text-brand-300">{label}:</span>
                    <span className="text-brand-850 dark:text-brand-300">
                        {isVisible
                            ? value
                            : '•'.repeat((value || '').toString().length)}
                    </span>
                </div>
            ))}
        </div>
    );

    const renderLicenseInput = () => (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative"
        >
            {licenseMessage && (
                <h3 className="text-sm font-medium text-amber-700 absolute -top-6 right-0">{licenseMessage}</h3>
            )}
            <Input
                id="licenseKey"
                type="text"
                placeholder="Enter your license key"
                className="text-sm h-8 flex-grow focus:outline-none focus-visible:ring-0 dark:text-brand-300 focus-visible:ring-offset-0"
                value={inputLicense}
                onChange={handleLicenseInputChange}
            />

        </motion.div>
    );

    const renderConnectButton = () => (
        <button
            className="flex gap-2 items-center cursor-pointer bg-brand-100/90 text-brand-950 px-4 rounded-lg"
            onClick={() => (showInput ? connectRapidloadLicense() : window.open('https://app.rapidload.io/', '_blank'))}
        >
            {loading && <Loader className='w-4 animate-spin' />} Connect
        </button>
    );

    return (
        <AnimatePresence mode="wait">
            <div className="w-full flex flex-col gap-4">
                <Card data-tour="license-widget" className="border flex flex-col gap-4">
               
                    <div className="flex flex-col p-6 pb-0 gap-2">
                        <div className="text-lg font-bold">
                            {licenseInfo ? (
                                <span className="text-brand-400/50 dark:text-brand-300">Welcome back, <span className="text-brand-950">{licenseInfo?.name}</span></span>
                            ) : (
                                <span className="text-brand-400/90 dark:text-brand-300">Connect your license</span>
                            )}
                        </div>
                        <div className="bg-purple-800/10 px-2.5 py-1.5 rounded-xl w-fit dark:bg-brand-700">{renderLicenseStatus()}</div>
                    </div>

                    <div className="grid gap-4 px-8 text-sm relative">
                        {/* Stored License:
                        {JSON.stringify(parsedStoredLicense?.licensedDomain)}
                        <div className="h-1 bg-brand-950 border-b border-brand-950 border-2" />
                        License Info:
                        {JSON.stringify(licenseInfo?.licensedDomain)} */}
                        {!licenseInfo ? (
                            <>
                                <span>Slow load times are the #1 reason for high bounce rates and one of the root causes of poor Google Rankings.</span>
                                {showInput ? renderLicenseInput() : (
                                    <motion.div
                                        key="getRapidloadButton"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex flex-col items-center"
                                    >
                                        <button
                                            className="text-sm font-semibold cursor-pointer bg-brand-100/90 text-brand-950 py-1.5 px-4 rounded-lg"
                                            onClick={() => window.open('https://rapidload.io/', 'blank')}
                                        >
                                            Get Rapidload
                                        </button>
                                    </motion.div>

                                )}
                            </>
                        ) : renderLicenseDetails()}
                    </div>

                    <div className="flex flex-col gap-2">
                        <div
                            className="flex gap-6 justify-end p-6 text-sm font-semibold relative before:absolute before:left-0 before:right-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-white before:via-brand-200 before:to-white dark:before:bg-gradient-to-r dark:before:from-brand-950 dark:before:via-brand-900 dark:before:to-brand-950">
                            {licenseInfo ? (
                                <>
                                    <button className="cursor-pointer text-brand-500 py-1.5" onClick={() => window.open('https://app.rapidload.io/', 'blank')}>View My Account</button>
                                    <button className="cursor-pointer bg-brand-100/90 text-brand-950 py-1.5 px-4 rounded-lg dark:text-brand-300 dark:bg-brand-800/40 dark:hover:bg-brand-800/50" onClick={() => window.open('https://app.rapidload.io/subscription', 'blank')}>Upgrade</button>
                                </>
                            ) : (
                                <>
                                    {/*<button className="cursor-pointer text-brand-500 py-1.5" onClick={() => setShowInput(!showInput)}>{showInput ? "Cancel" : "Connect with License key"}</button>*/}
                                    <button
                                        className="cursor-pointer text-brand-500 py-1.5"
                                        onClick={() => setShowInput(!showInput)}
                                    >
                                        <motion.span
                                            key={showInput.toString()}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="inline-block"
                                        >
                                            {showInput ? "Cancel" : "Connect with License key"}
                                        </motion.span>
                                    </button>
                                    {renderConnectButton()}
                                </>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </AnimatePresence>
    );
};

export default LicenseWidget;
