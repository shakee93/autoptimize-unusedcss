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
        },
        {
            selector: '[data-tour="audit-unused-javascript"]',
            content: {
                // @ts-ignore
                header : `Explore Individual Audits`,
                body : <>
                    <MousePointerClick className='mb-2'/>
                    Click the <span className='text-purple-750'>"Show Actions"</span> button to view detailed information on each performance audit and dive deeper.
                </>
            },
            position: "left",
            resizeObservables: ['[data-tour="audit-unused-javascript"]'],
        },
        {
            selector: '[data-tour="unused-javascript-group-0"]',
            content: {
                // @ts-ignore
                header: `Resources are Grouped`,
                body: <>
                    <MousePointerClick className='mb-2'/>
                    Click the <span className='text-purple-750'>"Show Actions"</span> button to view detailed
                    information on each performance audit and dive deeper.
                </>
            },
            position: "left",
        },
        {
            selector: '[data-tour="unused-javascript-group-0-settings"]',
            content: {
                // @ts-ignore
                header: `Settings for Each resource type`,
                body: <>
                    <MousePointerClick className='mb-2'/>
                    Click the <span className='text-purple-750'>"Show Actions"</span> button to view detailed
                    information on each performance audit and dive deeper.
                </>
            },
            position: "top",
        },
        {
            selector: '[data-tour="unused-javascript-group-0-table"]',
            content: {
                // @ts-ignore
                header: `Your files`,
                body: <>
                    <MousePointerClick className='mb-2'/>
                    Click the <span className='text-purple-750'>"Show Actions"</span> button to view detailed
                    information on each performance audit and dive deeper.
                </>
            },
            position: "top",
        },
        {
            selector: '[data-tour="unused-javascript-group-0-table-action"]',
            content: {
                // @ts-ignore
                header: `Your action`,
                body: <>
                    <MousePointerClick className='mb-2'/>
                    Click the <span className='text-purple-750'>"Show Actions"</span> button to view detailed
                    information on each performance audit and dive deeper.
                </>
            },
            position: "top",
        },
    ])


    const Content = ({ content, currentStep, setIsOpen, setCurrentStep, }: any) => {
        
        return <div className='text-md flex flex-col px-4 pb-4'>
            <div className='flex justify-between items-center px-4 py-4 border-b -mx-[22px]'>
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

    const opositeSide = {
        top: "bottom",
        bottom: "top",
        right: "left",
        left: "right",
        custom: 'custom'
    };

    function doArrow(position:  keyof typeof opositeSide, verticalAlign: any, horizontalAlign : keyof typeof opositeSide ) {
        if (!position || position === "custom") {
            return {};
        }

        const width = 18;
        const height = 10;
        const color = "white";
        const isVertical = position === "top" || position === "bottom";
        const spaceFromSide = 10;

        const obj = {
            [`--rtp-arrow-${
                isVertical ? opositeSide[horizontalAlign] : verticalAlign
            }`]: height + spaceFromSide + "px",
            [`--rtp-arrow-${opositeSide[position]}`]: -height + 2 + "px",
            [`--rtp-arrow-border-${isVertical ? "left" : "top"}`]: `${
                width / 2
            }px solid transparent`,
            [`--rtp-arrow-border-${isVertical ? "right" : "bottom"}`]: `${
                width / 2
            }px solid transparent`,
            [`--rtp-arrow-border-${position}`]: `${height}px solid ${color}`
        };
        return obj;
    }

    return (
        <TourProvider
            showDots={true}
            maskClassName='rpo-titan-tour'
            maskId='rpo-titan-tour-mask'
            padding={{
                popover: [25,25]
            }}
            styles={{
                popover : (base, state: any) => ({
                    ...base,
                    borderRadius: '10px',
                    padding: '0 8px',
                    zIndex: 150000,
                    ...doArrow(state.position, state.verticalAlign, state.horizontalAlign)
                }),
                maskArea: (base) => ({ ...base,
                    rx: 6,
                }),
                maskWrapper: (base) => ({
                    ...base,
                    color: 'rgb(0,0,0,0.02)',
                    opacity: 1
                }),
                highlightedArea: (base, { x, y, width, height } : any) => ({
                    ...base,
                    display: "block",
                    stroke: "#0e172a",
                    strokeWidth: 2,
                    width: width,
                    height: height,
                    rx: 6,
                    pointerEvents: "none"
                })
            }}
            onClickMask={({ setCurrentStep, currentStep, steps, setIsOpen }) => {

            }}
            components={{
                Badge : () => <></>,
                Close : () => <></>,
                Content,
                Navigation : () => <></>
            }}
            steps={steps}>
            {children}
        </TourProvider>
    )
}

export default AppTour