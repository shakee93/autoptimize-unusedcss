import React, { useEffect, useState, FC } from 'react';
import { Textarea } from 'components/ui/textarea';
import { Checkbox } from 'components/ui/checkbox';
import useCommonDispatch from 'hooks/useCommonDispatch';
import { saveGeneralSettings } from '../../../store/app/appActions';
import { useAppContext } from '../../../context/app';
import AppButton from "components/ui/app-button";

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
        console.log("Saved Settings:", settingsData);
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

    return (
        <>
            <div className="content flex w-full sm:w-1/2 lg:w-full flex-col px-6">
                <div className="grid items-center mb-4">
                    <div className="text-sm font-semibold dark:text-brand-300">Exclude URLs</div>
                    <div className="text-xs font-normal dark:text-brand-300 text-brand-500 mt-1">
                        URLs that need to be excluded from RapidLoad optimization.
                    </div>
                    <Textarea
                        className="mt-1 focus:outline-none focus-visible:ring-0 dark:text-brand-300 rounded-2xl"
                        value={settingsData.uucss_excluded_links?.join('\n')}
                        onChange={(e) =>
                            setSettingsData({...settingsData, uucss_excluded_links: e.target.value.split('\n')})
                        }
                    />
                </div>

                {renderCheckbox('Minify HTML', 'Minify the HTML output of your pages.', 'rapidload_minify_html')}
                {renderCheckbox('Query String', 'Identify URLs with query strings as separate URLs.', 'uucss_query_string')}
                {renderCheckbox('Preload Links', 'Preload internal links for faster navigation.', 'preload_internal_links')}
                {renderCheckbox('Debug Mode', 'Enable debug logs for RapidLoad.', 'uucss_enable_debug')}


            </div>
            <div className="border-t flex justify-end mt-4 px-4 pt-4">
                <AppButton onClick={() => onClose(false)}
                           className='mr-2 text-sm text-gray-500 bg-brand-0 hover:bg-accent border border-input'>
                    Close
                </AppButton>
                <AppButton
                    onClick={handleSaveSettings}
                    className="bg-violet-950 text-sm font-semibold text-white py-1.5 px-4 rounded-lg hover:bg-violet-900"
                >
                    Save Settings
                </AppButton>
            </div>
        </>
    );
};

export default GeneralSettings;
