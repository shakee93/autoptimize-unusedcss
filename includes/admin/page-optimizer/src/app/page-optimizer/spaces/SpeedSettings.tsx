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
import {CheckCircleIcon, ChevronRightIcon} from "@heroicons/react/24/solid";
import {updateSettings} from "../../../store/app/appActions";
import PerformanceIcons from "app/page-optimizer/components/performance-widgets/PerformanceIcons";
import { m, AnimatePresence  } from 'framer-motion';

interface SettingsProps {
    audit: Audit
    auditSettings?: AuditSetting[]
    max?: number
    type?: string
    className?: string
    hideActions?: boolean
    children?: ReactNode
}
type GroupedSettings = Record<string, AuditSetting[]>;

const SpeedSettings = ({ audit }: SettingsProps) => {

    const {settings, data} = useSelector(optimizerData);
    const [activeCategory, setActiveCategory]= useState('css')
    const [groupedSettings, setGroupedSettings] = useState({})
    const {dispatch, openAudits, activeTab} = useCommonDispatch()
    const categoryOrder = [ 'css', 'javascript', 'image', 'font', 'cdn', 'cache'];

    let icons = useMemo(() => ( {
        cache : <PageCache/>,
        cdn : <CloudDelivery/>,
        image : <ImageDeliverySVG/>,
        javascript : <JavascriptDelivery/>,
        js : <JavascriptDelivery/>,
        font : <FontDelivery/>,
        css : <CSSDelivery/>,
    }), [])

    const groupByCategory = (settings) => {
        const grouped = {};
        settings.forEach((setting) => {
            if (!grouped[setting.category]) {
                grouped[setting.category] = [];
            }
            grouped[setting.category].push({
                ...setting,
                audits: data.audits.filter(audit => audit.settings.find(s => s.name === setting.name))
            });
        });
        return grouped;
    };


    useEffect(() => {
        const grouped = groupByCategory(settings);
        const sortedCategories = Object.keys(grouped).sort((a, b) => {
            const indexA = categoryOrder.indexOf(a);
            const indexB = categoryOrder.indexOf(b);
            return indexA - indexB;
        });

        const sortedGroupedSettings: GroupedSettings = {};
        sortedCategories.forEach((category) => {
            //sortedGroupedSettings[category] = grouped[category as keyof typeof grouped];
            sortedGroupedSettings[category] = grouped[category];
        });

        setGroupedSettings(sortedGroupedSettings);
    }, [data, settings]);

    const updateValue = useCallback( (setting: AuditSetting, value: any, key: string) => {

        dispatch(updateSettings(
            audit,
            setting,
            key,
            value
        ));
    }, [settings])

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



    const actionRequired = (item) => {
        const hasPassedAudit = item.inputs[0].value && item.audits.some((a) => a.type === 'passed_audit');
        const hasFailedAudit = item.audits.some((a) => a.type !== 'passed_audit');
        return hasPassedAudit || hasFailedAudit;
    };

    const [sortedSettings, setSortedSettings] = useState([]);
    const [sortedStatus, setSortedStatus] = useState(true)

    // useEffect(() => {
    //     if (groupedSettings && groupedSettings[activeCategory] && sortedStatus) {
    //         const sorted = groupedSettings[activeCategory].slice().sort((a, b) => {
    //             const aValue = a.inputs[0].value;
    //             const bValue = b.inputs[0].value;
    //             return aValue ? -1 : bValue ? 1 : 0;
    //         });
    //
    //         setSortedSettings(sorted);
    //         setSortedStatus(false)
    //     }
    // }, [groupedSettings, activeCategory]);

    useEffect(() => {
        if (groupedSettings && groupedSettings[activeCategory] && sortedStatus) {
            const sorted = groupedSettings[activeCategory].slice().sort((a, b) => {
                const aValue = a.inputs[0].value;
                const bValue = b.inputs[0].value;

                // Sort by checked value first
                if (aValue && !bValue) return -1;
                if (!aValue && bValue) return 1;

                // Then sort by not passed audits
                const aHasFailedAudit = a.audits.some((audit) => audit.type !== 'passed_audit');
                const bHasFailedAudit = b.audits.some((audit) => audit.type !== 'passed_audit');
                if (aHasFailedAudit && !bHasFailedAudit) return -1;
                if (!aHasFailedAudit && bHasFailedAudit) return 1;

                // Finally, sort by passed audits
                return 0;
            });

            setSortedSettings(sorted);
            setSortedStatus(false);
        }
    }, [groupedSettings, activeCategory]);

    const [firstItemRendered, setFirstItemRendered] = useState("Test");

    useEffect(() => {
        setFirstItemRendered(false);
    }, [activeCategory]);


    return <div>
        <SettingsLine cls='mb-2 -mt-2 -ml-9' width={getWidthForCategory(activeCategory)|| 220}  />
        <ul className='flex gap-4 ml-12'>
            {Object.keys(groupedSettings).map((category, index) => (
                <li className='cursor-pointer' key={index} onClick={e => {
                    setSortedStatus(true);
                    setActiveCategory(category);
                }}>
                    <m.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }} className={cn(
                        'flex gap-2 transition-all items-center border border-transparent py-2 px-3.5 pl-2 bg-white rounded-2xl w-fit mb-4 hover:bg-brand-50',
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

                        {firstItemRendered === "Test" && !actionRequired(item) && (
                            <>

                                <div className="text-lg font-bold mb-2">
                                    {console.log("printed ")}
                                    Passed Opportunities and Diagnostics
                                </div>
                                {setFirstItemRendered("Hello")}

                            </>
                        )}



                        <div className='bg-white border mb-2 px-2.5 py-3 rounded-2xl'>
                            <BetaSpeedSetting showIcons={false} settings={item} updateValue={updateValue} actionRequired={actionRequired(item)} index={itemIndex}/>

                            <ul className='flex mt-2 justify-start ml-14 items-baseline	'>
                                <AuditsLine cls='w-4 mr-2  -mt-1'/>
                                {item.audits.map((audit: Audit, index) =>
                                    <li
                                        onClick={e => {
                                            dispatch(setCommonState('openAudits', [audit.id]));
                                            dispatch(setCommonState('activeTab',
                                                audit.type === 'passed_audit' ? 'passed_audits': audit.type === 'opportunity' ? 'opportunities' : audit.type
                                            ));

                                            setTimeout(() => {
                                                document.getElementById(`audit-${audit.id}`)?.scrollIntoView({ behavior: 'smooth'})
                                            }, 100)
                                        }}
                                        className='relative flex cursor-pointer gap-2 font-medium text-sm hover:bg-brand-100 dark:bg-brand-900 bg-white border w-fit rounded-xl items-center py-1.5 px-1.5 mr-2' key={index}>
                                        <div

                                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-200/50`}>
                                            {audit.type === 'passed_audit' ? (
                                                <CheckCircleIcon className='w-5 fill-green-600' />
                                            ) : audit.type === 'opportunity' ? (
                                                <>
                                                <Circle className={cn('w-2 stroke-0 fill-orange-600 animate-ping absolute inline-flex opacity-75')} />
                                                <Circle className={cn('w-2 stroke-0 fill-orange-600 relative inline-flex')} />
                                                </>
                                            ) : audit.type === 'diagnostics' ? (
                                                <>
                                                <Circle className={cn('w-2 stroke-0 fill-yellow-400 animate-ping absolute inline-flex opacity-75')} />
                                                <Circle className={cn('w-2 stroke-0 fill-yellow-400 relative inline-flex')} />
                                                </>
                                            ) : null}
                                            {/*{audit.type === 'passed_audit' ?*/}
                                            {/*    <CheckCircleIcon className='w-5 fill-green-600'/> :*/}
                                            {/*    <Circle className={cn(*/}
                                            {/*        'w-2 stroke-0',*/}
                                            {/*        audit.type === 'opportunity' && 'fill-orange-600',*/}
                                            {/*        audit.type === 'diagnostics' && 'fill-yellow-400',*/}
                                            {/*    )} />*/}
                                            {/*}*/}
                                        </div>

                                        <div className="flex flex-col">
                                            {audit.name}
                                            <div className="flex items-center">
                                                <div className="dark:bg-brand-900 bg-white border w-fit rounded-lg items-center py-py px-1 mr-2 text-gray-400 block font-medium text-[10px] ">Opportunity</div>

                                                <div className=" text-gray-500 text-xs block">{audit.displayValue ? audit.displayValue : ''}</div>

                                            </div>

                                        </div>

                                        <ChevronRightIcon className='h-5'/>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    )}

                </li>

            ))}
        </ul>
        </m.div>
    </div>
}

export default SpeedSettings