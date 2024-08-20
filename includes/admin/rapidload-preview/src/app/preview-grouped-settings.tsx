import React, { useState } from 'react';
import Card from "components/ui/card";
import {ChevronDown, Circle} from "lucide-react";
import {CheckCircleIcon, ChevronRightIcon, XCircleIcon} from "@heroicons/react/24/solid";
import AuditComponent from './audits';
import Accordion from "components/accordion";
import {cn} from "lib/utils";

type GroupedSettingsComponentProps = {
    groupedSettings: Record<string, any>;
    icons: Record<string, JSX.Element>;
};

const GroupedSettingsComponent: React.FC<GroupedSettingsComponentProps> = ({ groupedSettings, icons }) => {

    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

    const toggleCategory = (category: string) => {
        setOpenCategories({
            ...openCategories,
            [category]: !openCategories[category]
        });
    };

    const countWarnings = (category: string) => {
        return groupedSettings[category].reduce((count, setting) => {
            return count + setting.audits.filter((audit: any) => audit.type !== 'passed_audit').length;
        }, 0);
    };

    const countSuccesses = (category) => {
        return groupedSettings[category].reduce((count, setting) => {
            return count + setting.audits.filter(audit => audit.type === 'passed_audit').length;
        }, 0);
    };

    return (
        <div className="audits flex">
            <div className='w-full'>
                {Object.keys(groupedSettings).map((category: string) => (

                    <div key={category}>
                        <Card
                            className='cursor-pointer dark:bg-brand-950 bg-gray-200/60 border-gray-300 border mb-3'
                        >
                            <div id={`audit-${category}`} className="w-full scroll-m-28">
                                <div className="relative w-full">
                                    <div className="w-full">
                                        <div className="dark:bg-brand-950 bg-brand-0 rounded-3xl relative mb-0 z-10 overflow-hidden w-full flex justify-center flex-col items-center p-0 dark:hover:border-brand-700/70 hover:border-brand-400/60">
                                            <div className="min-h-[46px] relative flex justify-between w-full py-2.5 px-2.5 min-w-32 gap-10" onClick={() => toggleCategory(category)}>
                                                <div className="flex gap-3 font-normal items-center text-base">
                                                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-200/50">
                                                        {icons[category]}
                                                    </div>
                                                    <div className="flex flex-col justify-around">
                                                        <div className="flex gap-1.5 items-center font-semibold">
                                                            {(category === 'css' || category === 'cdn')
                                                                ? category.toUpperCase()
                                                                : category.charAt(0).toUpperCase() + category.slice(1)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 items-center">
                                                    {countWarnings(category) > 0 && (
                                                        <div className='text-xs dark:text-brand-600 border border-red-300 bg-red-100 flex gap-1 items-center pr-2 pl-1 py-0.5 rounded-full'>
                                                            {countWarnings(category)} warnings
                                                            <XCircleIcon className='w-5 text-red-500' />
                                                        </div>
                                                    )}
                                                    {countSuccesses(category) > 0 && (
                                                        <div className='text-xs dark:text-brand-600 border border-green-300 bg-green-100 flex gap-1 items-center pr-2 pl-1 py-0.5 rounded-full'>
                                                            {countSuccesses(category)} successes
                                                            <CheckCircleIcon className='w-5 text-green-500' />
                                                        </div>
                                                    )}

                                                    <ChevronDown
                                                        className={`w-5 ${openCategories[category] ? 'transform rotate-180' : ''}`}/>
                                                </div>
                                            </div>
                                            {openCategories[category] && (
                                                <div
                                                    className="settings-container w-full text-left flex flex-col divide-y">
                                                {groupedSettings[category].map((setting: any, index: number) => (
                                                        <div key={`${category}-${index}`} className="setting">

                                                            {setting.audits.map((audit: Audit, index: number) => (
                                                                <AuditComponent key={index} audit={audit} />
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupedSettingsComponent;
