import React, {ReactNode, useState} from "react";
import {StepType, TourProvider, components} from "@reactour/tour";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {MousePointerClick} from "lucide-react";
import {Button} from "components/ui/button";

interface TourProviderProps {
    children: ReactNode
}

const AppTour = ({children}: TourProviderProps) => {

    const [steps, setSteps] = useState<StepType[]>([
        {
            selector: '[data-tour="switch-report-strategy"]',
            content: {
                // @ts-ignore
                header : 'Select Mobile or Desktop',
                body : 'Pick a device to analyze and optimize the page.'
            },
        },
        {
            selector: '[data-tour="analyze"]',
            content: {
                // @ts-ignore
                header : `Refresh Speed Again`,
                body : <> <MousePointerClick className='mb-2'/> Click to re-analyze the page speed using Google PageSpeed Insights.</>
            },
        },
        {
            selector: '[data-tour="speed-insights"]',
            content: {
                // @ts-ignore
                header : `Your Speed Insights`,
                body : 'See your overall website\'s speed rating, along with a breakdown of key metrics and performance scores.'
            },
            position: "right"
        },
        {
            selector: '[data-tour="metrics"]',
            content: {
                // @ts-ignore
                header : `Dive Deeper into Metrics`,
                body : <> <MousePointerClick className='mb-2'/>
                    Click on individual metrics to uncover insights and get recommendations for enhancement.
                </>
            },
            position: "right"
        },
        {
            selector: '[data-tour="audits"]',
            content: {
                // @ts-ignore
                header : `Performance Audits & Actions`,
                body : <>
                    Discover the top audits needing attention and follow our recommended actions to enhance your page's performance.
                </>
            },
            position: "left"
        },
        {
            selector: '[data-tour="audit-groups"]',
            content: {
                // @ts-ignore
                header : `Dive into Audit Groups`,
                body :
                    <div className='flex flex-col gap-2 '>
                        <MousePointerClick/>
                        <div className='text-md border-b pb-4'>
                            Click on each audit group to explore detailed insights and actions.
                        </div>
                        <div className='text-sm text-brand-600'>
                            <ul className='flex flex-col gap-2 [&>*]:flex [&>*]:flex-col [&>*]:gap-1'>
                                <li><span className='font-bold text-brand-800'>Opportunities</span> Recommendations from Google to enhance your page's speed and efficiency. </li>
                                <li><span className='font-bold text-brand-800'>Diagnostics</span> In-depth feedback about your site's performance and potential issues.</li>
                                <li><span className='font-bold text-brand-800'>Passed Audits</span> Areas where your website meets or exceeds performance standards.</li>
                            </ul>
                        </div>
                    </div>
            },
            position: "left",
            actionAfter: () => {
                alert('ok')
            }
        },
        {
            selector: '[data-tour="audits"]',
            content: {
                // @ts-ignore
                header : `Performance Audits & Actions`,
                body : <>
                    Discover the top audits needing attention and follow our recommended actions to enhance your page's performance.
                </>
            },
            position: "left"
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

    const Content = ({ content, currentStep, setIsOpen }: any) => {
        
        return <div className='text-md flex flex-col px-4'>
            <div className='flex justify-between items-center px-4 py-4 border-b -mx-[22px]'>
                <span className='text-lg font-semibold leading-none tracking-tight'>
                   {content.header ? content.header :  `Let's Start`}
                </span>
                <button className='flex gap-2 items-center' onClick={e => setIsOpen(false) }>
                    <span className='text-sm text-brand-500'>{currentStep + 1} of {steps?.length}</span> <XMarkIcon className='w-5'/>
                </button>
            </div>

            {typeof content === 'string' && (
                <div className='px-2 pt-2'>{content}</div>
            )}

            {content.body && (
                <div className='pt-4'>{content.body}</div>
            )}

        </div>
    }

    const Navigation = (props: any) => {
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
                    padding: '0 8px',
                })
            }}
            onClickMask={({ setCurrentStep, currentStep, steps, setIsOpen }) => {

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