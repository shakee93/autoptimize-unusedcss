import React from "react";

interface SupportCardProps {
    title: string
    reasons: string[]
    learn_more?: string
}

const SupportCard = ({ title, reasons, learn_more}: SupportCardProps) => {

    return <>
        <div className='pb-0.5'>
            {title}
        </div>
        <div className='flex flex-col mt-2 gap-2 text-brand-700 dark:text-brand-300 border-t pt-3 pb-2 px-1'>
            <div className='text-sm'>
                This could be due to one or more following reasons:
            </div>

            <ul className='text-sm pl-6 kids:mb-1 list-disc'>
                {reasons.map((reason, index) =>
                    <li key={index}>{reason}</li>
                )}
            </ul>

            <div className='text-sm'>
                Please review these and try again.
                {learn_more && <>
                    Need more guidance? <a className='text-purple-750' href='#'>Learn More</a>
                </>}
            </div>
        </div>
    </>
}

export default SupportCard