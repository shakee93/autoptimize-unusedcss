import {StepType, useTour} from "@reactour/tour";
import React, {useEffect, useState} from "react";
import {MousePointerClick} from "lucide-react";
import useCommonDispatch from "hooks/useCommonDispatch";
import {setCommonState} from "../../store/common/commonActions";


const TourAuditOpen = () => {

    const { dispatch, openAudits } = useCommonDispatch()

    useEffect(() => {

        const isAuditOpen = openAudits.includes('unused-javascript');

        if (!isAuditOpen) {
            dispatch(setCommonState('openAudits', [...openAudits, 'unused-javascript']));
        }
        
    }, [])

    
    return  <>
        <MousePointerClick className='mb-2'/>
        Click the <span className='text-purple-750'>"Show Actions"</span> button to view detailed information on each performance audit and dive deeper.
    </>
}


const Steps: StepType[] =[
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
                body : <TourAuditOpen/>
            },
            position: "left",
            resizeObservables: ['[data-tour="audit-unused-javascript"]'],
            actionAfter: () => {




            }
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
    ]

export default Steps