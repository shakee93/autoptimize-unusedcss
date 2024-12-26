import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import AppButton from "components/ui/app-button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../../components/ui/accordion";

import { AnimatePresence, m, motion } from "framer-motion"
import useCommonDispatch from "hooks/useCommonDispatch";
import { changeGear } from '../../../store/app/appActions';
import { LoaderIcon, ChevronDown, GaugeCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { optimizerData } from "../../../store/app/appSelector";
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import OptimizationsProgress from '../../../components/optimizations-progress';
import { useAppContext } from "../../../context/app";
import ApiService from "../../../services/api";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "components/ui/collapsible";

const Steps = [
    "Analyze with Google PageSpeed",
    "Change performance gear to TurboMax",
    "Apply DOM optimizations",
    "Generate Critical CSS",
    "Generate Unused CSS",
    "Optimize Images",
    "All Optimizations are completed",
];


interface Metric {
    score: number;
    potentialGain: number;
    displayValue: string;
    metric: string;
}

interface Audit {
    name: string;
    score?: number;
    metrics?: string[];
    displayValue?: string;
}

interface Audits {
    opportunities: any[];
    diagnostics: any[];
}

const Optimizations = ({ }) => {
    const { activeGear, settings, data } = useSelector(optimizerData);
    const [activeLevel, setActiveLevel] = useState<PerformanceGear>('accelerate');
    const [isAccordionOpen, setIsAccordionOpen] = useState(true);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [aiDiagnosisResult, setAiDiagnosisResult] = useState<any>(null);

    const [diagnostics, setDiagnostics] = useState([]);

    const [OptimizationSteps, setOptimizationSteps] = useState(Steps);
    const { dispatch } = useCommonDispatch()
    const { options } = useAppContext()
    const optimizerUrl = options?.optimizer_url;
    const [showIframe, setShowIframe] = useState(false);

    // useEffect(() => {
    //         console.log('window', window)
    //         window.addEventListener("message", (event) => {
    //             console.log('event', event.data)
    //             if (event.data.type === "RAPIDLOAD_CHECK_RESULTS") {
    //                 console.log("Received data from iframe:", event.data);
    //             }
    //         });
    // }, [window]);

    // useEffect(() => {
    //     const handleMessage = (event: MessageEvent) => {
    //         if (event.data.type === "RAPIDLOAD_CHECK_RESULTS") {
    //             console.log("Received data from iframe:", event.data);

    //             // Compare received data with settings
    //             const receivedData = event.data.data;
    //             settings.forEach((setting: AuditSetting) => {

    //                 const mainInput = setting.inputs[0];
    //                 if (!mainInput) return;

    //                 Object.entries(receivedData).forEach(([category, data]: [string, any]) => {
    //                     if (data.key === mainInput.key) {
    //                         console.log(`Match found for ${category}:`, {
    //                             optimizerSettings: {
    //                                 settingName: setting.name,
    //                                 settingKey: mainInput.key,
    //                                 settingValue: mainInput.value,
    //                                 status: setting.status,
    //                             },
    //                             receivedData: {
    //                                 key: data.key,
    //                                 status: data.status,
    //                                 nonOptimizedItems: data.non_optimized_css || data.non_minified_css || data.non_minified_js || data.non_deferred_js || data.non_delayed_js
    //                             }
    //                         });
    //                     }
    //                 });
    //             });
    //         }
    //     };

    const doAnalysis = async () => {
        setShowIframe(true)
        const api = new ApiService(options);
        const plugins = await api.getActivePlugins();

        const metricsWithAudits = transformMetrics({
            opportunities: data?.grouped?.opportunities.map((o: any) => ({
                name: o.name,
                score: o.score,
                metrics: o.metrics.map((m: any) => m.refs.acronym),
                settings: o.settings.map((s: any) => s),
            })),
            diagnostics: data?.grouped?.diagnostics.map((d: any) => ({
                name: d.name,
                score: d.score,
                metrics: d.metrics.map((m: any) => m.refs.acronym),
                settings: d.settings.map((s: any) => s),
            })),
        }, data?.metrics.map((m: any) => ({
            metric: m.refs.acronym,
            potentialGain: m.potentialGain,
            score: m.score,
            weight: m.weight,
            displayValue: m.displayValue,
        })));

        const _diagnostics = Object.entries(diagnostics).map(([key, value]) => value)
        console.log()

        const input = {
            settings: settings.map((s: any) => ({
                ...s,
                inputs: s.inputs.map((i: any) => ({
                    ...i,
                    diagnostics: i.value ? _diagnostics.filter((d: any) => d.key === i.key) : []
                })),
            })),
            plugins: plugins.data,
            report: {
                opportunities: data?.grouped?.opportunities.map((o: any) => ({
                    name: o.name,
                    score: o.score,
                    metrics: o.metrics.map((m: any) => m.refs.acronym),
                    settings: o.settings.map((s: any) => s.name),
                })),
                diagnostics: data?.grouped?.diagnostics.map((d: any) => ({
                    name: d.name,
                    score: d.score,
                    metrics: d.metrics.map((m: any) => m.refs.acronym),
                    settings: d.settings.map((s: any) => s.name),
                })),
            },
            // diagnostics: Object.entries(diagnostics).map(([key, value]) => value),
        }

        const result = await api.getAIDiagnosis(input)
        setAiDiagnosisResult(result.data.diagnostics)
        console.log(result)

    }

    function transformMetrics(
        audits: Audits,
        metrics: Metric[],
    ): MetricWithAudits[] {
        // Helper function to get all audits related to a specific metric
        const getAuditsForMetric = (metricName: string): Audit[] => {
            const relatedAudits = [
                ...audits.opportunities.filter(audit => audit.metrics?.includes(metricName)),
                ...audits.diagnostics.filter(audit => audit.metrics?.includes(metricName))
            ];
            return relatedAudits;
        };

        // Get audits with no metrics
        const getAuditsWithNoMetrics = (): Audit[] => {
            return [
                ...audits.opportunities.filter(audit => !audit.metrics || audit.metrics.length === 0),
                ...audits.diagnostics.filter(audit => !audit.metrics || audit.metrics.length === 0)
            ];
        };

        // Group audits by metrics
        const metricsWithAudits: MetricWithAudits[] = [
            ...metrics.map(metric => ({
                ...metric,
                audits: getAuditsForMetric(metric.metric)
            })),
            {
                metric: 'NOMETRIC',
                potentialGain: 0,
                score: 100,
                displayValue: '-',
                audits: getAuditsWithNoMetrics()
            }
        ];


        return metricsWithAudits;
    }

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === "RAPIDLOAD_CHECK_RESULTS") {
                console.log("Received data from iframe:", event.data);

                // Compare received data with settings
                const receivedData = event.data.data;
                const matches: any[] = [];

                settings.forEach((setting: AuditSetting) => {
                    const mainInput = setting.inputs[0];
                    if (!mainInput) return;
                    Object.entries(receivedData).forEach(([category, data]: [string, any]) => {
                        if (data.key === mainInput.key) {
                            matches.push({
                                key: category,
                                optimizerSettings: {
                                    settingName: setting.name,
                                    settingKey: mainInput.key,
                                    settingValue: mainInput.value,
                                    status: setting.status,
                                },
                                receivedData: {
                                    key: data.key,
                                    status: data.status,
                                    nonOptimizedItems: data.non_optimized_css || data.non_minified_css || data.non_minified_js || data.non_deferred_js || data.non_delayed_js
                                }
                            });
                        }
                    });
                });

                setDiagnostics(event.data.data)
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [settings]);

    const getFilteredSettings = (settings: any) => {
        return settings.filter((setting: any) => setting.inputs.some((input: any) => input.value === true));
    };
    ;

    const renderOptimizationStep = useCallback((step: string, index: number) => (
        <div key={index} className="flex items-start gap-2 py-1 relative">
            <div className=" bg-gray-100 rounded-full flex items-center justify-center p-1">
                <LoaderIcon className="h-4 w-4 text-gray-600 animate-spin" />
            </div>
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <span className={`text-sm transition-colors text-gray-900`}>{step.name}</span>
        </div>
    ), []);

    return (
        <AnimatePresence>
            <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className=''
            >
                <div className='px-11 py-4'>
                    <div className="pb-4">
                        {false &&
                            <div>loading...</div>
                        }
                        <h3 className="font-semibold text-lg">Optimizations Summary</h3>
                        <span className="font-normal text-sm text-zinc-600 dark:text-brand-300">Let’s confirm that all optimizations are working as expected...</span>
                    </div>

                    <div className="grid grid-cols-5 gap-4">
                        <div className='col-span-2 bg-brand-0 rounded-2xl p-4'>

                            <div className="flex flex-col pt-1 gap-2 w-full">
                                {/* {getFilteredSettings(settings).map(renderOptimizationStep)} */}

                                <OptimizationsProgress />
                            </div>

                        </div>

                        <div className='col-span-3 bg-brand-0 rounded-2xl p-10 items-center justify-center flex flex-col gap-4 text-center'>
                            <h3 className="font-semibold text-lg">Test Your Optimizations</h3>
                            <span className="font-normal text-sm text-zinc-600 dark:text-brand-300">Your optimizations are complete! However, changes might not take effect due to factors like caching, conflicts with plugins or themes, or dynamic content. Let's test to ensure everything is working smoothly and identify any bottlenecks.</span>
                            <AppButton
                                className="rounded-xl px-8 py-4"
                                onClick={() => doAnalysis()}
                            >
                                Run Optimization Test
                            </AppButton>
                            <span className="font-normal text-xs text-zinc-600 dark:text-brand-300">Disabled: All Optimizations needs to be completed to run the test</span>
                        </div>
                    </div>


                    <div className="mt-4 bg-brand-0 rounded-2xl p-4 py-6">
                        <h3 className="font-semibold text-lg">AI Diagnosis</h3>
                        <div className="mt-4">

                            {aiDiagnosisResult?.CriticalIssues?.map((result: any) => (
                                <Accordion key={result?.issue} type="single" collapsible>
                                    <AccordionItem value={result?.issue}>
                                        <AccordionTrigger className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                            {result?.issue}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-4">
                                                <p className="text-sm text-zinc-600 dark:text-zinc-300">{result?.description}</p>
                                                <div>
                                                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-2">How to fix</p>
                                                    <ul className="list-disc list-inside space-y-2">
                                                        {result?.howToFix?.map((fix: any) => (
                                                            <li key={fix} className="text-sm text-zinc-600 dark:text-zinc-300">{fix}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <Collapsible>
                                                <CollapsibleTrigger className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-2">
                                                    View Raw Data
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <pre className="mt-2 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg overflow-auto">
                                                        {JSON.stringify(result, null, 2)}
                                                    </pre>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ))}
                        </div>
                    </div>

                    {/* Iframe Section */}
                    <AnimatePresence>
                        {showIframe && (
                            <m.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-6"
                            >
                                <div className="relative w-full rounded-xl overflow-hidden bg-white shadow-lg">
                                    <div className="absolute top-4 right-4 z-10">
                                        <button
                                            onClick={() => setShowIframe(false)}
                                            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                    <iframe
                                        src={`${optimizerUrl}/?rapidload_preview`}
                                        // src={`${window.uucss_global.home_url}/?rapidload_preview`} 
                                        className="w-full h-[600px] border-0"
                                        title="Optimization Test"
                                    />
                                </div>
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            </m.div>
        </AnimatePresence>
    )
}

export default Optimizations;   