import React from 'react';
import {setCommonState} from "../../../store/common/commonActions";
import { CheckCircleIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import {Circle} from "lucide-react";
import { cn } from 'lib/utils';
import BetaSpeedSetting from 'app/page-optimizer/components/audit/BetaSpeedSetting';
import {
    AuditsLine
} from "app/page-optimizer/components/icons/line-icons";
import useCommonDispatch from "hooks/useCommonDispatch";
import { m, AnimatePresence  } from 'framer-motion';


interface AuditSettingsItemProps {
    item: AuditSetting;
    itemIndex: number;
    updateValue: (setting: AuditSetting, value: any, key: string) => void;
    actionRequired: boolean;
}


const AuditSettingsItem: React.FC<AuditSettingsItemProps> = ({item, itemIndex, updateValue, actionRequired }) => {
    const { dispatch, openCategory } = useCommonDispatch();

    const handleAuditClick = (audit: Audit) => {

        dispatch(setCommonState('openAudits', [audit.id]));
        dispatch(
            setCommonState(
                'activeTab',
                audit.type === 'passed_audit' ? 'passed_audits' : audit.type === 'opportunity' ? 'opportunities' : audit.type
            )
        );

        setTimeout(() => {
            document.getElementById(`audit-${audit.id}`)?.scrollIntoView({ behavior: 'smooth' });
        }, 10);
    };

    return (
        <div className="w-full mb-3.5 px-2.5 py-3 rounded-2xl dark:bg-brand-950 bg-brand-0 dark:hover:border-brand-700/70 hover:border-brand-400/60">
            <BetaSpeedSetting showIcons={false} settings={item} updateValue={updateValue} actionRequired={actionRequired} index={itemIndex} />

            <ul className="flex mt-2 justify-start ml-14">

                <AuditsLine cls="w-4 mr-2  -mt-2" />
                {item.audits.map((audit, index) => (
                    <li
                        key={index}
                        onClick={() => handleAuditClick(audit)}
                        className="relative flex cursor-pointer gap-2 font-medium text-sm hover:bg-brand-100 dark:bg-brand-900 bg-white border w-fit rounded-xl items-center py-1.5 px-1.5 mr-2"
                    >
                        <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-200/50`}>
                            {audit.scoreDisplayMode === 'informative' ?
                                <>
                                    <span className='w-2 h-2 border-2 border-brand-400/60 rounded-full'></span>
                                </>
                                : audit.type === 'passed_audit' ? (
                                <CheckCircleIcon className="w-5 fill-green-600" />
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
                        </div>

                        <div className="flex flex-col ">
                            <span className='select-none'>{audit.name}</span>
                            <div className="flex items-center">
                                <div className="dark:bg-brand-950 bg-white border w-fit rounded-lg items-center py-py px-1 mr-2 text-gray-400 block font-medium text-[10px] ">
                                    {audit.type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}

                                </div>
                                <div className=" text-gray-500 text-xs block">{audit.displayValue ? audit.displayValue : ''}</div>
                            </div>
                        </div>

                        <ChevronRightIcon className="h-5" />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AuditSettingsItem;
