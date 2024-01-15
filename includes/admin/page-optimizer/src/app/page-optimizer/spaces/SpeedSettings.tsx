import {useSelector} from "react-redux";
import { debounce } from 'lodash';
import {optimizerData} from "../../../store/app/appSelector";
import React, {ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {CheckCircle2, Circle} from "lucide-react";
import Audit from "app/page-optimizer/components/audit/Audit";
import {
    CloudDelivery, CSSDelivery, FontDelivery,
    ImageDeliverySVG,
    JavascriptDelivery,
    PageCache,
    AuditsLine, SettingsLine
} from "app/page-optimizer/components/icons/icon-svg";
import BetaSpeedSetting from "app/page-optimizer/components/audit/BetaSpeedSetting";
import {cn} from "lib/utils";
import {setCommonState} from "../../../store/common/commonActions";
import useCommonDispatch from "hooks/useCommonDispatch";
import {BoltIcon, CheckCircleIcon, ChevronRightIcon, ChevronDownIcon  } from "@heroicons/react/24/solid";
import {updateSettings} from "../../../store/app/appActions";
import PerformanceIcons from "app/page-optimizer/components/performance-widgets/PerformanceIcons";
import { m, AnimatePresence  } from 'framer-motion';
import AuditSettingsItem from './AuditSettingsItem'; // Import the new component


interface SettingsProps {
    audit: Audit
}
type GroupedSettings = Record<string, AuditSetting[]>;

const SpeedSettings = ({audit}: SettingsProps) => {

    const {settings, data } = useSelector(optimizerData);
    const [activeCategory, setActiveCategory]= useState('css')
    const [groupedSettings, setGroupedSettings] = useState<GroupedSettings>({});
    const {dispatch, openCategory} = useCommonDispatch()
    const categoryOrder = [ 'css', 'javascript', 'image', 'font', 'cdn', 'cache'];

    const [sortedSettings, setSortedSettings] = useState<AuditSetting[]>([]);
    const [sortedStatus, setSortedStatus] = useState(true)
    const [firstItem, setFirstItem] = useState<number | null>(null);


    const icons = useMemo(() => ( {
        cache : <PageCache/>,
        cdn : <CloudDelivery/>,
        image : <ImageDeliverySVG/>,
        javascript : <JavascriptDelivery/>,
        js : <JavascriptDelivery/>,
        font : <FontDelivery/>,
        css : <CSSDelivery/>,
    }), [])

    const groupByCategory = (settings: AuditSetting[]) => {
        const grouped = {} as GroupedSettings;
        settings.forEach((setting) => {
            if (!grouped[setting.category]) {
                grouped[setting.category] = [];
            }
            grouped[setting.category].push({
                ...setting,
                // audits: data.audits.filter(audit => audit.settings.find(s => s.name === setting.name))
                audits: (data?.audits || []).filter(audit => audit.settings.find(s => s.name === setting.name))

            });
        });
        return grouped;
    };


    useEffect(() => {
        const grouped = groupByCategory(settings || []);
        const sortedCategories = Object.keys(grouped).sort((a, b) => {
            const indexA = categoryOrder.indexOf(a);
            const indexB = categoryOrder.indexOf(b);
            return indexA - indexB;
        });

        const sortedGroupedSettings: GroupedSettings = {};
        sortedCategories.forEach((category) => {
            sortedGroupedSettings[category] = grouped[category as keyof typeof grouped];
            //sortedGroupedSettings[category] = grouped[category];
        });

        setGroupedSettings(sortedGroupedSettings);

       // console.log(openCategory);
        if (openCategory && openCategory!=='') {
        //    setSortedStatus(true);
            setActiveCategory(openCategory);
            console.log(activeCategory);
        }

    }, [data, settings, openCategory]);


    const updateValue = useCallback( (setting: AuditSetting, value: any, key: string) => {
        dispatch(updateSettings(
            audit,
            setting,
            key,
            value
        ));
    }, [settings]);

    const getWidthForCategory = (category) => {
        switch (category) {
            case 'cdn':
                return 625;
            case 'font':
                return 515;
            case 'css':
                return 130;
            case 'javascript':
                return 255;
            case 'image':
                return 395;
            case 'cache':
                return 740;
            default:
                return 395;
        }
    };


    useEffect(() => {
       // console.log("trailer")

        if (groupedSettings && groupedSettings[activeCategory] && sortedStatus) {
            const sorted = groupedSettings[activeCategory].slice().sort((a, b) => {
                const aValue = a.inputs[0].value;
                const bValue = b.inputs[0].value;

                if (aValue && !bValue) return -1;
                if (!aValue && bValue) return 1;

                const aHasFailedAudit = a.audits.some((audit) => audit.type !== 'passed_audit');
                const bHasFailedAudit = b.audits.some((audit) => audit.type !== 'passed_audit');
                if (aHasFailedAudit && !bHasFailedAudit) return -1;
                if (!aHasFailedAudit && bHasFailedAudit) return 1;

                return 0;

            });

            setSortedSettings(sorted);
            setSortedStatus(false);

            const lowestItemIndex = sorted.findIndex(item => !actionRequired(item));
            setFirstItem(lowestItemIndex);



        }
    }, [groupedSettings, activeCategory]);



    const actionRequired = (item) => {
        const hasPassedAudit = item.inputs[0].value && item.audits.some((a) => a.type === 'passed_audit');
        const hasFailedAudit = item.audits.some((a) => a.type !== 'passed_audit');
        return hasPassedAudit || hasFailedAudit ;
    };

    const [categoryStates, setCategoryStates] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const initialCategoryStates: Record<string, boolean> = {};
        Object.keys(groupedSettings).forEach((category) => {
            initialCategoryStates[category] = false;
        });
        setCategoryStates(initialCategoryStates);
    }, [groupedSettings]);

    const setShowHideState = (category: string) => {
        setCategoryStates((prevStates) => ({
            ...prevStates,
            [category]: !prevStates[category],
        }));
    };


    return <div>
        <SettingsLine cls='mb-2 -mt-2 -ml-9' width={getWidthForCategory(activeCategory)|| 220}  />
        <ul className='flex gap-4 ml-12'>
            {Object.keys(groupedSettings).map((category, index) => (
                <li className='cursor-pointer' key={index} onClick={e => {
                    setSortedStatus(true);
                    setActiveCategory(category);
                }}>
                    <m.div
                        id={category}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }} className={cn(
                        'flex gap-2 transition-all items-center border border-transparent py-2 px-3.5 pl-2 rounded-2xl w-fit mb-4 hover:bg-brand-50 dark:bg-brand-950 bg-brand-0 dark:hover:border-brand-700/70 hover:border-brand-400/60',
                        activeCategory === category ? 'shadow-md transition-all' : '' && ''
                    )}>
                        {icons[category]}
                        <span>
                        {category}
                        </span>

                    </m.div>

                </li>
            ))}


        </ul>

        <m.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
        <ul>
            {sortedSettings.map((item: AuditSetting, itemIndex) => (
                <li key={itemIndex} >
                    {item.audits.length > 0 && (

                    <div>

                        {firstItem === itemIndex  && (
                            <div
                            onClick={() => setShowHideState(activeCategory)}
                            className={cn(
                            `hover:bg-slate-100 transition-all dark:bg-brand-930/90 bg-slate-50 border-2 border-transparent rounded-[20px] cursor-pointer w-[217px]  flex items-center gap-2 px-5 py-3 text-sm font-medium mb-4 mt-4`,
                                categoryStates[activeCategory] ? "bg-slate-100" : ""
                            )}
                            >Show Disabled Settings <ChevronDownIcon className='w-4 rounded-[15px]'/></div>
                        )}

                        {(actionRequired(item) || (categoryStates[activeCategory] && !actionRequired(item))) && (
                            <AuditSettingsItem key={`${activeCategory}-${itemIndex}`} item={item} itemIndex={itemIndex} updateValue={updateValue} actionRequired={actionRequired(item)} />
                        )}


                    </div>
                    )}

                </li>

            ))}
        </ul>
        </m.div>
    </div>
}

export default SpeedSettings