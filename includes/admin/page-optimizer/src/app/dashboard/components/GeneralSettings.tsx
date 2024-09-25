import React, {Suspense, useEffect, useState} from 'react';
import {Textarea} from "components/ui/textarea";
import {Checkbox} from "components/ui/checkbox";
import {getTestModeStatus, saveGeneralSettings} from "../../../store/app/appActions";
import useCommonDispatch from "hooks/useCommonDispatch";
import {useAppContext} from "../../../context/app";

interface GeneralOptions {
    uucss_excluded_links?: string[];
    rapidload_minify_html?: boolean;
    uucss_query_string?: boolean;
    preload_internal_links?: boolean;
    uucss_enable_debug?: boolean;
    uucss_jobs_per_queue?: string;
    uucss_queue_interval?: string;
    uucss_disable_add_to_queue?: boolean;
    uucss_disable_add_to_re_queue?: boolean;
}

interface ActiveModules {
    general: {
        options: GeneralOptions;
    };
}

interface UucssGlobal {
    active_modules?: ActiveModules;
}

declare global {
    interface Window {
        uucss_global?: UucssGlobal;
    }
}

const GeneralSettings = () => {
    const { dispatch } = useCommonDispatch();
    const {options} = useAppContext();
    const [settingsData, setSettingsData] = useState<GeneralSettings>({
        excludeUrl: [],
        minifyHtml: false,
        queryString: false,
        preloadLinks: false,
        debugMode: false,
        queueRunJob: 0,
        queueRunJobInterval: 0,
        disableAutoQueue: false,
        disableReQueue: false,
    });

    // Function to handle checkbox state change
    const handleCheckboxChange = (key: keyof GeneralSettings) => {
        setSettingsData(prevSettings => ({
            ...prevSettings,
            [key]: !prevSettings[key]
        }));
    };

// Function to handle "Save Settings" button click
    const handleSaveSettings = () => {
        console.log("Saved Settings:", settingsData);
        dispatch(saveGeneralSettings(options,settingsData));
    };

    useEffect(() => {
        console.log("General Settings: ", window.uucss_global?.active_modules?.general)
        // const GeneralSettings = window.uucss_global?.active_modules?.general.options;

        if (window.uucss_global?.active_modules?.general) {
            const GeneralSettings = window.uucss_global.active_modules.general.options;
            setSettingsData({
                excludeUrl: GeneralSettings.uucss_excluded_links || [],
                minifyHtml: !!GeneralSettings.rapidload_minify_html,
                queryString: !!GeneralSettings.uucss_query_string,
                preloadLinks: !!GeneralSettings.preload_internal_links,
                debugMode: !!GeneralSettings.uucss_enable_debug,
                queueRunJob: parseInt(GeneralSettings.uucss_jobs_per_queue || '0'),
                queueRunJobInterval: parseInt(GeneralSettings.uucss_queue_interval || '0'),
                disableAutoQueue: !!GeneralSettings.uucss_disable_add_to_queue,
                disableReQueue: !!GeneralSettings.uucss_disable_add_to_re_queue,
            });
        }
    }, []);

    return ( <>


                <div className="content flex w-full sm:w-1/2 lg:w-full flex-col px-6">

                    <div className='grid items-center'>
                        <div className="text-sm font-semibold dark:text-brand-300">Exclude URLs</div>
                        <div className="text-xs font-normal dark:text-brand-300 text-brand-500 mt-1">URLs that needs to be excluded from the whole RapidLoad optimization.</div>
                        <Textarea className="mt-1 focus:outline-none focus-visible:ring-0 dark:text-brand-300 focus-visible:ring-offset-0 rounded-2xl" />
                    </div>

                        <div className='relative flex gap-2 font-medium text-base w-fit items-center py-1'>
                            <Checkbox
                                      checked={settingsData.minifyHtml}
                                      onCheckedChange={(c: boolean) =>{
                                          handleCheckboxChange('minifyHtml')
                                      }}
                                      />
                            <div className='flex flex-col'>
                                <div className='select-none cursor-pointer'>Minify Html</div>
                                <p className={`text-sm font-normal select-none`} >Minify the html output of your pages.</p>
                            </div>
                        </div>
                        <div className='relative flex gap-2 font-medium text-base w-fit items-center py-1'>
                            <Checkbox
                                checked={settingsData.queryString}
                                onCheckedChange={(c: boolean) =>{
                                    handleCheckboxChange('queryString')
                                }}
                            />
                            <div className='flex flex-col'>
                                <div className='select-none cursor-pointer'>Query String</div>
                                <p className={`text-sm font-normal select-none`} >Identify URLs with query strings as separate URLs.</p>
                            </div>
                        </div>
                        <div className='relative flex gap-2 font-medium text-base w-fit items-center py-1'>
                            <Checkbox
                                checked={settingsData.preloadLinks}
                                onCheckedChange={(c: boolean) =>{
                                    handleCheckboxChange('preloadLinks')
                                }}
                            />
                            <div className='flex flex-col'>
                                <div className='select-none cursor-pointer'>Preload Links</div>
                                <p className={`text-sm font-normal select-none`} >Preload Links</p>
                            </div>
                        </div>
                        <div className='relative flex gap-2 font-medium text-base w-fit items-center py-1'>
                            <Checkbox
                                checked={settingsData.debugMode}
                                onCheckedChange={(c: boolean) =>{
                                    handleCheckboxChange('debugMode')
                                }}
                            />
                            <div className='flex flex-col'>
                                <div className='select-none cursor-pointer'>Debug Mode</div>
                                <p className={`text-sm font-normal select-none`} >Enable debug logs for RapidLoad.</p>
                            </div>
                        </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSaveSettings}
                            className="mt-2 justify-center cursor-pointer transition duration-300 bg-violet-950 text-sm font-semibold text-white py-1.5 px-4 border border-violet-950  rounded-lg">
                            Save Settings
                        </button>
                    </div>

                </div>

    </>
    );
};

export default GeneralSettings;
