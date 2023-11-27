import {useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";
import React, {useEffect, useMemo, useState} from "react";
import {CheckCircle2, Circle} from "lucide-react";
import Audit from "app/page-optimizer/components/audit/Audit";
import {
    CloudDelivery, CSSDelivery, FontDelivery,
    ImageDeliverySVG,
    JavascriptDelivery,
    PageCache
} from "app/page-optimizer/components/icons/icon-svg";
import Setting from "app/page-optimizer/components/audit/Setting";
import {cn} from "lib/utils";
import {setCommonState} from "../../../store/common/commonActions";
import useCommonDispatch from "hooks/useCommonDispatch";
import {CheckCircleIcon} from "@heroicons/react/24/solid";

const Configurations = () => {

    const {settings, data} = useSelector(optimizerData);
    const [activeCategory, setActiveCategory]= useState('image')
    const [groupedSettings, setGroupedSettings] = useState({})
    const {dispatch, openAudits, activeTab} = useCommonDispatch()

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
        setGroupedSettings(groupByCategory(settings))
    }, [data, settings])

    return <div>
        <ul className='flex gap-4'>
            {Object.keys(groupedSettings).map((category, index) => (
                <li className='cursor-pointer' key={index} onClick={e => setActiveCategory(category)}>
                    <div className={cn(
                        'flex gap-2 items-center border border-transparent py-2 px-3.5 pl-2 bg-white rounded-2xl w-fit mb-4 hover:bg-brand-50',
                        activeCategory === category && ''
                    )}>
                        {icons[category]}
                        <span>
                        {category}
                        </span>
                        {groupedSettings[category].filter((s: AuditSetting) => s.inputs[0].value ).length > 0 &&

                            <div className={
                                cn(
                                    'flex text-xxs items-center justify-center rounded-full w-6 h-6 bg-brand-200',
                                )}>
                            <span className={cn(
                                ''
                            )}>
                                {groupedSettings[category].filter((s: AuditSetting) => s.inputs[0].value ).length}
                            </span>
                            </div>
                        }

                    </div>

                </li>
            ))}


        </ul>
        <ul>
            {groupedSettings[activeCategory]?.map((item: AuditSetting, itemIndex) => (
                <li key={itemIndex} >
                    {(item.audits.length > 0
                            &&
                            (
                                item.inputs[0].value
                                && item.audits.filter((a: Audit) => a.type === 'passed_audit').length > 0
                            )
                        ||
                            (
                                item.audits.filter((a: Audit) => a.type !== 'passed_audit').length > 0
                            )
                        ) &&
                        <div className='bg-white border mb-2 px-2.5 py-3 rounded-2xl'>

                            <Setting showIcons={false} settings={item} updateValue={() => {}} index={itemIndex}/>

                            <ul className='flex mt-2 justify-start'>
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
                                        className='flex cursor-pointer items-center gap-1.5 text-sm px-2 py-1 rounded-xl' key={index}>
                                        {audit.type === 'passed_audit' ?
                                            <CheckCircleIcon className='w-5 fill-green-600'/> :
                                            <Circle className={cn(
                                                'w-2 stroke-0',
                                                audit.type === 'passed_audit' && 'fill-green-600',
                                                audit.type === 'opportunity' && 'fill-orange-600',
                                                audit.type === 'diagnostics' && 'fill-yellow-400',
                                            )} />
                                        }


                                        {audit.name}
                                    </li>
                                )}
                            </ul>
                        </div>
                    }

                </li>
            ))}
        </ul>
    </div>
}

export default Configurations