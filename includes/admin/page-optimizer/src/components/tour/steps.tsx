import {StepType, useTour} from "@reactour/tour";
import React, {useEffect, useMemo, useState} from "react";
import {MousePointerClick} from "lucide-react";
import useCommonDispatch from "hooks/useCommonDispatch";
import {setCommonState} from "../../store/common/commonActions";
import {useSelector} from "react-redux";
import {optimizerData} from "../../store/app/appSelector";
import {transformFileType} from "lib/utils";
import {position} from "html2canvas/dist/types/css/property-descriptors/position";


const TourAuditOpen = ({audit}: { audit: Audit }) => {

    const {dispatch, openAudits, activeTab} = useCommonDispatch()

    useEffect(() => {
        const isAuditOpen = openAudits.includes(audit.id);

        if (!isAuditOpen) {
            dispatch(setCommonState('openAudits', [...openAudits, audit.id]));
        }

        let activeAuditTab = audit.type === 'opportunity' ? 'opportunities' : audit.type

        if (activeAuditTab !== activeTab) {
            dispatch(setCommonState('activeTab',
                audit.type === 'opportunity' ? 'opportunities' : audit.type
            ));
        }

    }, [])



    return <>
        <MousePointerClick
            onClick={() => {
            }}
            className='mb-2'/>
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

    ];

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
        selector: '[data-tour="current-url"]',
        content: {
            // @ts-ignore
            header: `Current URL`,
            body: <> <MousePointerClick className='mb-2'/> This is the URL currently selected to configure, optimize, and analyze your site's performance.</>
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
        selector: '[data-tour="test-mode"]',
        content: {
            // @ts-ignore
            header: `Test-Mode`,
            body: <> <MousePointerClick className='mb-2'/> Enable this to keep RapidLoad changes from going live.</>
        },
    },
    {
        selector: '[data-tour="preview-button"]',
        content: {
            // @ts-ignore
            header: `Preview`,
            body: <> <MousePointerClick className='mb-2'/> Click to see how the page looks after applying RapidLoad optimization before going live.</>
        },
    },
    {
        selector: '[data-tour="speed-settings"]',
        content: {
            // @ts-ignore
            header: `Speed Settings`,
            body: <> <MousePointerClick className='mb-2'/> Configure the RapidLoad plugin with one-click gears.</>
        },
    },
    {
        selector: '[data-tour="settings-gear"]',
        content: {
            // @ts-ignore
            header: `Performance gears`,
            body: <> <MousePointerClick className='mb-2'/> Select your Performance Mode: Starter, Accelerate, TurboMax, or Customize, to fine-tune your site's speed.
            </>
        },
        position: "right"
    },
    {
        selector: '[data-tour="customize-settings"]',
        content: {
            // @ts-ignore
            header: `Customize Settings`,
            body: <> <MousePointerClick className='mb-2'/> Tailor your site's performance settings to your specific requirements.
            </>
        },
        position: "right"
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
        selector: '[data-tour="expand-metrics"]',
        content: {
            // @ts-ignore
            header: `Metrics`,
            body: <> <MousePointerClick className='mb-2'/>
                Click on ”Expand Metrics” to identify individual metrics to uncover insights and get recommendations for enhancement.
            </>
        },
        position: "right"
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
        position: (postionsProps, prevRect) => {
            let shadowRoot  =
                document.getElementById('rapidload-optimizer-shadow-dom')
            let el = shadowRoot?.shadowRoot?.querySelector('[data-tour="save-changes"]')


            if (el) {
                let rect = el.getBoundingClientRect()

                return [Number(rect.x + rect.width) - postionsProps.width , rect.y - postionsProps.height - 25 ];
            }

            return "top"
        },
        padding: {
            popover: [100, 25]
        },
    },
]



export default Steps