import {XIcon} from "lucide-react";
import React, {Dispatch, SetStateAction, useState} from "react";

interface SupportCardProps {
    audit: Audit
    setHelpOpen: Dispatch<SetStateAction<boolean>>
}

const SupportCard = ({audit, setHelpOpen}: SupportCardProps) => {

    return <>
        <div
            className='absolute flex flex-col gap-3 bottom-0 w-full h-fit px-6 py-4 bg-brand-50 border z-50 rounded-3xl'>
            <div className='flex items-center justify-between border-b pb-2'>
                <h2 className='font-normal'>Why this audit is still not being resolved?</h2>
                <button onClick={e => setHelpOpen(false)}><XIcon className='text-brand-500 w-5 h-5'/></button>
            </div>

            <div className='py-2 px-2 text-sm'>
                This could be due to one or more of the following reasons

                <ul className='list-disc pl-6 mt-1 text-brand-700/80'>
                    <li>You have server-side caching on your website. Clear the server-side cache.</li>
                </ul>
            </div>
        </div>
    </>
}

export default SupportCard