import React, { useEffect, useState, FC } from 'react';
import { Textarea } from 'components/ui/textarea';
import { Checkbox } from 'components/ui/checkbox';
import useCommonDispatch from 'hooks/useCommonDispatch';
import { saveGeneralSettings } from '../../../store/app/appActions';
import { useAppContext } from '../../../context/app';
import AppButton from "components/ui/app-button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from 'components/ui/select';
import {ChevronRightIcon} from "@heroicons/react/24/solid";
import Accordion from "components/accordion";
import {Label} from "components/ui/label";

const defaultSettings: GeneralSettings = {
    uucss_excluded_links: [],
    rapidload_minify_html: false,
    uucss_query_string: false,
    preload_internal_links: false,
    uucss_enable_debug: false,
    uucss_jobs_per_queue: 0,
    uucss_queue_interval: 0,
    uucss_disable_add_to_queue: false,
    uucss_disable_add_to_re_queue: false,
};

interface GeneralSettingsProps {
    onClose: (open: boolean) => void;
}

const GeneralSettings: FC<GeneralSettingsProps> = ({ onClose }) => {
    const { dispatch } = useCommonDispatch();
    const { options } = useAppContext();
    const [settingsData, setSettingsData] = useState<GeneralSettings>(defaultSettings);
    const [jobCount, setJobCount] = useState('1 Job');
    const [timeInterval, setTimeInterval] = useState('10 Minutes');

    useEffect(() => {
        const GeneralSettings = window.uucss_global?.active_modules?.general?.options;
        if (GeneralSettings) {
            setSettingsData({
                uucss_excluded_links: GeneralSettings.uucss_excluded_links || [],
                rapidload_minify_html: !!GeneralSettings.rapidload_minify_html,
                uucss_query_string: !!GeneralSettings.uucss_query_string,
                preload_internal_links: !!GeneralSettings.preload_internal_links,
                uucss_enable_debug: !!GeneralSettings.uucss_enable_debug,
                uucss_jobs_per_queue: GeneralSettings.uucss_jobs_per_queue || 0,
                uucss_queue_interval: GeneralSettings.uucss_queue_interval || 0,
                uucss_disable_add_to_queue: !!GeneralSettings.uucss_disable_add_to_queue,
                uucss_disable_add_to_re_queue: !!GeneralSettings.uucss_disable_add_to_re_queue,
            });
        }
        }, []);

    const handleCheckboxChange = (key: keyof GeneralSettings) => {
        setSettingsData(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSaveSettings = () => {
        dispatch(saveGeneralSettings(options, settingsData));
    };

    const renderCheckbox = (label: string, description: string, key: keyof GeneralSettings) => {
        const isChecked = typeof settingsData[key] === 'boolean' ? settingsData[key] : false;
        return (
            <div className="relative flex gap-2 font-medium text-base w-fit items-center py-1">
                <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => handleCheckboxChange(key)}
                />
                <div className="flex flex-col">
                    <div className="select-none cursor-pointer">{label}</div>
                    <p className="text-sm font-normal select-none">{description}</p>
                </div>
            </div>
        );
    };

    const renderTextarea = (label: string, description: string, key: keyof GeneralSettings) => {
        const value = Array.isArray(settingsData[key]) ? settingsData[key].join('\n') : '';

        return (
            <div className="grid items-center my-4">
                <div className="text-sm font-semibold dark:text-brand-300">{label}</div>
                <div className="text-xs font-normal dark:text-brand-300 text-brand-500 mt-1">
                    {description}
                </div>
                <Textarea
                    className="mt-1 focus:outline-none focus-visible:ring-0 dark:text-brand-300 rounded-2xl"
                    value={value} // Use the value derived above
                    onChange={(e) =>
                        setSettingsData({ ...settingsData, [key]: e.target.value.split('\n') })
                    }
                />
            </div>
        );
    };

    const [isOpen, setIsOpen] = useState(false);
    const toggleIsOpen = () => {
        setIsOpen(prevState => !prevState);
    }

    return (
        <>
            <div className="content flex w-full sm:w-1/2 lg:w-full flex-col px-6">

                {renderCheckbox('Minify HTML', 'Minify the HTML output of your pages.', 'rapidload_minify_html')}
                {renderCheckbox('Query String', 'Identify URLs with query strings as separate URLs.', 'uucss_query_string')}
                {renderCheckbox('Preload Links', 'Preload internal links for faster navigation.', 'preload_internal_links')}
                {renderCheckbox('Debug Mode', 'Enable debug logs for RapidLoad.', 'uucss_enable_debug')}
                {renderTextarea('Exclude URLs', 'URLs that need to be excluded from RapidLoad optimization.', 'uucss_excluded_links')}

                <div className="flex flex-col text-left w-full dark:text-brand-300 bg-brand-100/30 rounded-xl py-4 px-4 border border-brand-200/60 my-2">
                    <div className="flex items-center justify-between cursor-pointer " onClick={toggleIsOpen} >
                        <div className="flex flex-col">
                            <span>
                            Queue Options
                            </span>
                            <span className="text-sm font-normal text-gray-600 sm:max-w-[425px]">
                            More advanced options for pro users.
                        </span>
                        </div>
                        <ChevronRightIcon  className={`h-5 transition-all ${isOpen && 'rotate-[90deg]'}`} />
                    </div>

                    <Accordion
                        className="flex flex-col text-left w-full gap-1 mt-6 ml-3"
                        initialRender={true}
                        isOpen={isOpen}
                    >

                        {/* Queue Dropdowns */}
                        <div className="flex items-center space-x-4 mb-1">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Run</label>
                                <Select value={jobCount} onValueChange={(v) => setJobCount(v)}>
                                    <SelectTrigger className="w-[130px] capitalize bg-brand-0">
                                        <SelectValue placeholder="1 Job" />
                                    </SelectTrigger>
                                    <SelectContent className="z-[100001]">
                                        <SelectGroup>
                                            <SelectLabel>Jobs</SelectLabel>
                                            {['1 Job', '2 Jobs', '3 Jobs'].map((value, index) => (
                                                <SelectItem
                                                    className="capitalize cursor-pointer"
                                                    key={index}
                                                    value={value}
                                                >
                                                    {value}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Per</label>
                                <Select value={timeInterval} onValueChange={(v) => setTimeInterval(v)}>
                                    <SelectTrigger className="w-[130px] capitalize bg-brand-0">
                                        <SelectValue placeholder="10 Minutes" />
                                    </SelectTrigger>
                                    <SelectContent className="z-[100001]">
                                        <SelectGroup>
                                            <SelectLabel>Time Interval</SelectLabel>
                                            {['1 Minute', '5 Minutes', '10 Minutes', '30 Minutes', '1 Hour'].map((value, index) => (
                                                <SelectItem
                                                    className="capitalize cursor-pointer"
                                                    key={index}
                                                    value={value}
                                                >
                                                    {value}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {renderCheckbox('Disable Auto Queue', 'Disable jobs adding to queue on user visits.', 'uucss_disable_add_to_queue')}
                        {renderCheckbox('Disable Re-Queue', 'Disable jobs re-queuing on warnings.', 'uucss_disable_add_to_re_queue')}
                    </Accordion>


                </div>




            </div>
            <div className="border-t flex justify-end mt-4 px-4 pt-4 gap-2">
                <AppButton
                    onClick={handleSaveSettings}
                    className="text-sm font-semibold text-white py-1.5 px-4 rounded-lg"
                >
                    Save Changes
                </AppButton>
                <AppButton onClick={() => onClose(false)}
                           className='mr-2 text-sm text-gray-500 bg-brand-0 hover:bg-accent border border-input'>
                    Close
                </AppButton>

            </div>
        </>
    );
};

export default GeneralSettings;
