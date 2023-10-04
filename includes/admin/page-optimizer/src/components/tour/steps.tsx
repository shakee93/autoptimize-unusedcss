import {StepType, useTour} from "@reactour/tour";
import React, {useEffect, useMemo, useState} from "react";
import {MousePointerClick} from "lucide-react";
import useCommonDispatch from "hooks/useCommonDispatch";
import {setCommonState} from "../../store/common/commonActions";
import {useSelector} from "react-redux";
import {optimizerData} from "../../store/app/appSelector";
import {transformFileType} from "lib/utils";


const TourAuditOpen = ({audit}: { audit: Audit }) => {

    const {dispatch, openAudits} = useCommonDispatch()
    const {activeReport} = useSelector(optimizerData)

    useEffect(() => {

        const isAuditOpen = openAudits.includes(audit.id);

        dispatch(setCommonState('activeTab',
            audit.type === 'opportunity' ? 'opportunities' : audit.type
        ));

        if (!isAuditOpen) {
            setTimeout(() => {
                dispatch(setCommonState('openAudits', [...openAudits, audit.id]));
            }, 0)
        }


    }, [activeReport, openAudits])


    return <>
        <MousePointerClick className='mb-2'/>
        Click the <span className='text-purple-750'>"Show Actions"</span> button to view detailed information on each
        performance audit and dive deeper.
    </>
}

export const AuditSteps = (audit: Audit): StepType[] => {

    let key = audit.id

    const hasControls = !!audit.files?.headings?.find(h => h.valueType === 'controls')

    let remainingSettings = audit
        .settings
        // @ts-ignore
        .filter(s => !audit.files?.grouped_items?.map(group => transformFileType(audit, group.type))
            .includes(s.category))


    return [
        {
            selector: `[data-tour="audit-${key}"]`,
            content: {
                // @ts-ignore
                header: `Explore Individual Audits`,
                body: <TourAuditOpen audit={audit}/>
            },
            position: "left",
            resizeObservables:
                [
                    `[data-tour="audit-${key}"]`,
                    `[data-tour="audit-${key}-group-0"]`,
                    `[data-tour="audit-${key}"] .audit-content`,
                ],
        },
        ...((audit.settings.length > 0 && remainingSettings.length > 0) ? [
            {
                selector: `[data-tour="${key}-recommended-settings"]`,
                content: {
                    // @ts-ignore
                    header: `Tailored Recommendations`,
                    body: <>
                        Discover our suggestions for features. Toggle them on or off to fit your preferences seamlessly.
                    </>
                },
                position: "top",
            },

        ] : []),
        ...(audit.files.items.length > 0 ? [
            {
                selector: `[data-tour="${key}-group-0"]`,
                content: {
                    // @ts-ignore
                    header: `Streamlined Audit Insights`,
                    body: <>
                        Within every audit, discover thoughtfully arranged details and actions. Clarity, made
                        simple.
                    </>
                },
                position: "left",
                resizeObservables: [`[data-tour="${key}-group-0"]`]
            },

        ] : []),
        ...((audit.settings.length > 0 && remainingSettings.length === 0) ? [
            {
                selector: `[data-tour="${key}-group-0-settings"]`,
                content: {
                    // @ts-ignore
                    header: `Tailored Recommendations`,
                    body: <>
                        Discover our suggestions for features. Toggle them on or off to fit your preferences
                        seamlessly.
                    </>
                },
                position: "top",
            },
        ] : []),
        ...[
            {
                selector: `[data-tour="${key}-group-0-table"]`,
                content: {
                    // @ts-ignore
                    header: `Organizing Your Assets`,
                    body: <>
                        Explore the table to find resources and their associated actions.
                        Properly organized to help improve your page performance.
                    </>
                },
                position: "top",
            }
        ],
        ...(hasControls ? [
            {
                selector: `[data-tour="${key}-file-action-0"]`,
                content: {
                    // @ts-ignore
                    header: `Adjusting File Actions`,
                    body: <>
                        <MousePointerClick className='mb-2'/>
                        Click on the actions dropdown to change how each file behave.
                        Adjust as needed to fine-tune your page's performance.
                    </>
                },
                position: "top",
                resizeObservables: [`[data-radix-popper-content-wrapper]`, `[data-tour="${key}-file-action-0"]`],
                highlightedSelectors: [`[data-radix-popper-content-wrapper]`, `[data-tour="${key}-file-action-0"]`],
            },
        ] : [])
    ]
}

let getElement = (selector: string) => {

    return document.querySelector('[data-tour="switch-report-strategy"]')
}

const Steps: StepType[] = [
    {
        selector: '[data-tour="switch-report-strategy"]',
        content: {
            // @ts-ignore
            header: 'Select Mobile or Desktop',
            body: 'Pick a device to analyze and optimize the page.'
        },
    },
    {
        selector: '[data-tour="analyze"]',
        content: {
            // @ts-ignore
            header: `Refresh Speed Again`,
            body: <> <MousePointerClick className='mb-2'/> Click to re-analyze the page speed using Google PageSpeed
                Insights.</>
        },
    },
    {
        selector: '[data-tour="speed-insights"]',
        content: {
            // @ts-ignore
            header: `Your Speed Insights`,
            body: 'See your overall website\'s speed rating, along with a breakdown of key metrics and performance scores.'
        },
        position: "right"
    },
    {
        selector: '[data-tour="metrics"]',
        content: {
            // @ts-ignore
            header: `Dive Deeper into Metrics`,
            body: <> <MousePointerClick className='mb-2'/>
                Click on individual metrics to uncover insights and get recommendations for enhancement.
            </>
        },
        position: "right"
    },
    {
        selector: '[data-tour="audits"]',
        content: {
            // @ts-ignore
            header: `Performance Audits & Actions`,
            body: <>
                Discover the top audits needing attention and follow our recommended actions to enhance your page's
                performance.
            </>
        },
        position: "left"
    },
    {
        selector: '[data-tour="audit-groups"]',
        content: {
            // @ts-ignore
            header: `Dive into Audit Groups`,
            body:
                <div className='flex flex-col gap-2 '>
                    <MousePointerClick/>
                    <div className='text-md border-b pb-4'>
                        Click on each audit group to explore detailed insights and actions.
                    </div>
                    <div className='text-sm text-brand-600'>
                        <ul className='dark:text-brand-200 text-brand-800 flex flex-col gap-2 [&>*]:flex [&>*]:flex-col [&>*]:gap-1'>
                            <li><span className='font-bold '>Opportunities</span> Recommendations from
                                Google to enhance your page's speed and efficiency.
                            </li>
                            <li><span className='font-bold d'>Diagnostics</span> In-depth feedback about
                                your site's performance and potential issues.
                            </li>
                            <li><span className='font-bold '>Passed Audits</span> Areas where your website
                                meets or exceeds performance standards.
                            </li>
                        </ul>
                    </div>
                </div>
        },
        position: "left",
    }
]


export const FinalSteps: StepType[] = [
    {
        selector: '[data-tour="save-changes"]',
        content: {
            // @ts-ignore
            header: `Saving Your Optimizations`,
            body: <>
                <MousePointerClick className='mb-2'/>
                After making changes, remember to save. Tap the <span
                className='text-purple-750'>"Save Changes"</span> button to
                ensure all your tweaks are updated.
            </>
        },
        position: "bottom",
        padding: {
            popover: [100, 25]
        }
    },
]

export default Steps