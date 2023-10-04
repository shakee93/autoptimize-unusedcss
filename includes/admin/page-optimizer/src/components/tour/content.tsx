import {XMarkIcon} from "@heroicons/react/24/outline";
import {Button} from "components/ui/button";
import React from "react";
import {useTour} from "@reactour/tour";

const Content = ({  content, currentStep, setIsOpen, setCurrentStep } : any) => {

    const { steps } = useTour()

    return <div className='text-md flex flex-col px-4 pb-4'>
        <div className='flex justify-between items-center px-4 py-4 border-b dark:border-b-brand-700/40 -mx-[22px]'>
                <span className='text-lg font-semibold leading-none tracking-tight'>
                   {content.header ? content.header :  `Let's Start`}
                </span>
            <button className='flex gap-2 items-center' onClick={e => setIsOpen(false) }>

                <XMarkIcon className='w-5'/>
            </button>
        </div>

        {typeof content === 'string' && (
            <div className='px-2 pt-2'>{content}</div>
        )}

        {content.body && (
            <div className='pt-4'>{content.body}</div>
        )}

        <div className='flex items-center justify-between pt-4'>
            <span className='text-sm text-brand-500'>{currentStep + 1} of {steps.length}</span>
            <Button onClick={e => {


                setCurrentStep((p: number) => {
                    if (p < steps.length - 1) {
                        return p + 1
                    } else {
                        setIsOpen(false)
                        return 0
                    }
                });

            }} size='sm' >
                {currentStep < steps.length - 1 ? 'Next' : 'Finish'}</Button>
        </div>
    </div>
}


export default Content