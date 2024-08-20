import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { ThunkDispatch } from "redux-thunk";
import { AppAction, RootState } from "./store/app/appTypes";
import { useAppContext } from "./context/app";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "./store/app/appActions";
import {
    CSSDelivery,
    JavascriptDelivery,
    ImageDeliverySVG,
    FontDelivery,
    CloudDelivery,
    PageCache,
} from './components/icons/icon-svg';
import GroupedSettingsComponent from './app/preview-grouped-settings';
import { optimizerData } from "./store/app/appSelector";
import { ChevronDown } from "lucide-react";

type GroupedSettings = Record<string, AuditSetting[]>;

function App() {
    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const { options, setShowInprogress } = useAppContext();
    const { settings, data } = useSelector(optimizerData);
    const [groupedSettings, setGroupedSettings] = useState<GroupedSettings>({});
    const categoryOrder: SettingsCategory[] = ['css', 'javascript', 'image', 'font', 'cdn', 'cache'];

    const icons = useMemo(() => ({
        cache: <PageCache />,
        cdn: <CloudDelivery />,
        image: <ImageDeliverySVG />,
        javascript: <JavascriptDelivery />,
        js: <JavascriptDelivery />,
        font: <FontDelivery />,
        css: <CSSDelivery />,
    }), []);

    useEffect(() => {
        dispatch(fetchData(options, options.optimizer_url, false));
        setShowInprogress(false);
    }, [dispatch]);

    const groupByCategory = (settings: AuditSetting[]) => {
        const grouped = {} as GroupedSettings;
        settings.forEach((setting) => {
            if (!grouped[setting.category]) {
                grouped[setting.category] = [];
            }
            grouped[setting.category].push({
                ...setting,
                audits: (data?.audits || []).filter(audit => audit.settings.find(s => s.name === setting.name))
            });
        });
        return grouped;
    };

    useEffect(() => {
        const grouped = groupByCategory(settings || []);
        const sortedCategories = Object.keys(grouped).sort((a, b) => {
            const indexA = categoryOrder.indexOf(a as SettingsCategory);
            const indexB = categoryOrder.indexOf(b as SettingsCategory);
            return indexA - indexB;
        });

        const sortedGroupedSettings: GroupedSettings = {};
        sortedCategories.forEach((category) => {
            sortedGroupedSettings[category] = grouped[category as keyof typeof grouped];
        });

        setGroupedSettings(sortedGroupedSettings);
    }, [data, settings]);

    useEffect(() => {
        console.log(groupedSettings)
    }, [groupedSettings]);

    return (
        <>
            <div className='absolute top-5 left-5 bg-gray-200/30 p-5 rounded-3xl'>
                <div className="min-h-[56px] relative flex justify-between w-full py-2 px-4 min-w-32 gap-10 mb-4">
                    <div className="flex gap-3 items-end">
                        <img className='w-36' src={options?.page_optimizer_base ? (options?.page_optimizer_base + `/logo.svg`) : '/logo.svg'} alt='RapidLoad - #1 to unlock breakneck page speed' />
                        <div className="font-semibold text-2xl">Preview</div>
                    </div>
                    <div className="flex gap-3 items-end">
                        <ChevronDown className='w-10' />
                    </div>
                </div>
                <GroupedSettingsComponent groupedSettings={groupedSettings} icons={icons} />
            </div>
        </>
    );
}

export default App;
