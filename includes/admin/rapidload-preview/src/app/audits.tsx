import React from 'react';
import {CheckCircleIcon, ChevronRightIcon, XCircleIcon} from "@heroicons/react/24/solid";

type AuditComponentProps = {
    audit: Audit;
};

const AuditComponent: React.FC<AuditComponentProps> = ({ audit }) => {
    return (
        <li
            className="relative flex cursor-pointer gap-2 font-medium text-sm hover:bg-brand-100 dark:bg-brand-900 border w-fit rounded-xl items-center py-1.5 px-1.5 mr-2"
        >
            <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-200/50`}>
                {audit.scoreDisplayMode === 'informative' ?
                    <>
                        {/*<span className='w-2 h-2 border-2 border-brand-400/60 rounded-full'></span>*/}
                        <CheckCircleIcon className="w-5 fill-green-600" />
                    </>
                    : audit.type === 'passed_audit' ? (
                        <CheckCircleIcon className="w-5 fill-green-600" />
                    ) : <XCircleIcon className='w-5 text-red-500' />}
            </div>

            <div className="flex flex-col">
                <span className='select-none'>{audit.name}</span>
            </div>
        </li>
    );
};

export default AuditComponent;
