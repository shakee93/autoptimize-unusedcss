import React, {ReactNode, useState} from "react";
import {StepType, TourProvider, components} from "@reactour/tour";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {MousePointerClick} from "lucide-react";

interface TourProviderProps {
    children: ReactNode
}

const AppTour = ({children}: TourProviderProps) => {

    const [steps, setSteps] = useState<StepType[]>([
        {
            selector: '[data-tour="switch-report-strategy"]',
            content: {
                header : 'Select Mobile or Desktop',
                body : 'Pick a device to analyze and optimize the page.'
            },
        },
        {
            selector: '[data-tour="analyze"]',
            content: {
                header : `Refresh Speed Again`,
                body : <> <MousePointerClick className='mb-2'/> Click to re-analyze the page speed using Google PageSpeed Insights.</>
            },
        },
        {
            selector: '[data-tour="speed-insights"]',
            content: {
                header : `Your Speed Insights`,
                body : 'See your overall website\'s speed rating, along with a breakdown of key metrics and performance scores.'
            },
            position: "right"
        },
        {
            selector: '[data-tour="metrics"]',
            content: {
                header : `Dive Deeper into Metrics`,
                body : <> <MousePointerClick className='mb-2'/>
                    Click on individual metrics to uncover insights and get recommendations for enhancement.
                </>
            },
            position: "right"
        },
        {
            selector: '[data-tour="audit-tabs"]',
            content: 'Your performance are organized to help you solve the issues faster! You can switch between those',
        },
    ])

    const Close = ({onClick} :{ onClick?: () => void}) => {
        return (
            <button
                onClick={onClick}
                className='absolute right-2 top-2'
            >
                <XMarkIcon className='w-5'/>
            </button>
        )
    }

     const Badge = () => {
        return <></>
    }

    const Content = ({ content, currentStep, setIsOpen }) => {
        
        console.log(steps);

        return <div className='text-md flex flex-col px-4'>
            <div className='flex justify-between items-center px-4 py-4 border-b -mx-4'>
                <span className='text-lg font-semibold leading-none tracking-tight'>
                   {content.header ? content.header :  `Let's Start`}
                </span>
                <button className='flex gap-2 items-center' onClick={e => setIsOpen(false) }>
                    <span className='text-sm text-brand-500'>{currentStep + 1}/{steps?.length}</span> <XMarkIcon className='w-5'/>
                </button>
            </div>

            {typeof content === 'string' && (
                <div className='px-2 pt-2'>{content}</div>
            )}

            {content.body && (
                <div className='px-2 pt-2'>{content.body}</div>
            )}

        </div>
    }

    const Navigation = (props) => {
        return (
            <div className='px-4 pb-4'>
                <components.Navigation  {...props}  />
            </div>
        )
    }

    return (
        <TourProvider
            maskClassName='rpo-titan-tour'
            maskId='rpo-titan-tour-mask'
            padding={{
                popover: [15,15]
            }}
            styles={{
                popover : (base) => ({
                    ...base,
                    borderRadius: '10px',
                    padding: '0',
                })
            }}
            onClickMask={({ setCurrentStep, currentStep, steps, setIsOpen }) => {
                if (steps) {
                    if (currentStep === steps.length - 1) {
                        setIsOpen(false)
                    }
                    setCurrentStep((s) => (s === steps.length - 1 ? 0 : s + 1))
                }
            }}
            components={{
                Badge : () => <></>,
                Close : () => <></>,
                Content,
                Navigation
            }}
            steps={steps}>
            {children}
        </TourProvider>
    )
}

export default AppTour