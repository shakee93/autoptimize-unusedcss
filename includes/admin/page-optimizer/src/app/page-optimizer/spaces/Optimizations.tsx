import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import AppButton from "components/ui/app-button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../../components/ui/accordion";
import { useCompletion, experimental_useObject as useObject } from 'ai/react'
import { AnimatePresence, m, motion } from "framer-motion"
import useCommonDispatch from "hooks/useCommonDispatch";
import { changeGear, fetchReport, fetchSettings, setDiagnosticResults } from '../../../store/app/appActions';
import { LoaderIcon, ChevronDown, GaugeCircle, RefreshCw, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import { optimizerData } from "../../../store/app/appSelector";
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import OptimizationsProgress from '../../../components/optimizations-progress';
import { useAppContext } from "../../../context/app";
import ApiService from "../../../services/api";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "components/ui/collapsible";
import { Button } from "components/ui/button";
import { toast } from "components/ui/use-toast";
import { cn } from "lib/utils";
import { z } from 'zod';
import { AnimatedLogo } from "components/animated-logo";
import ProgressTracker from '../../../components/ProgressTracker';
import { compareVersions } from 'compare-versions';
import { AnalysisResults } from '../../../components/analysis-results';
import { setCommonState } from "../../../store/common/commonActions";

const DiagnosticSchema = z.object({
    AnalysisSummary: z.string(),
    PluginConflicts: z.array(
        z.object({
            plugin: z.string(),
            recommendedAction: z.string(),
        })
    ),
    CriticalIssues: z.array(
        z.object({
            issue: z.string(),
            description: z.string(),
            howToFix: z.array(z.object({
                step: z.string(),
                description: z.string(),
                type: z.enum(['rapidload_fix', 'wordpress_fix', 'code_fix', 'other']),
                substeps: z.array(z.object({
                    step: z.string(),
                    description: z.string(),
                })).optional().describe('Substeps to fix the issue.'),
            })),
            resources: z.array(z.object({
                name: z.string(),
                url: z.string(),
                type: z.enum(['javascript', 'css', 'image', 'html', 'other']),
                relatedAudit: z.string().optional().describe('Related audit from PageSpeed Insights.'),
                reason: z.string().optional().describe('Reason why this resource is related to the issue.'),
            })),
            pagespeed_insight_audits: z.array(z.string()),
            pagespeed_insight_metrics: z.array(z.string()),
            anyAdditionalTips: z.array(z.string()).optional().describe('Any additional tips to fix the issue.'),
        })
    ),
});

// TODO: create an env variable for this
// const AIBaseURL = "http://localhost:3000/api"
const AIBaseURL = "https://ai.rapidload.io/api"

const Optimizations = ({ }) => {
    const { settings, data, activeReport, diagnosticResults } = useSelector(optimizerData);
    const [diagnosticsLoading, setDiagnosticsLoading] = useState(false);
    const [diagnosticComplete, setDiagnosticComplete] = useState(false);
    const [loadingText, setLoadingText] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState<number | null>(null);
    const [stepProgress, setStepProgress] = useState(0);
    const [isFlushingProgress, setIsFlushingProgress] = useState(0);
    const [settingsProgress, setSettingsProgress] = useState(0);
    const [pageSpeedProgress, setPageSpeedProgress] = useState(0);
    const [serverInfoProgress, setServerInfoProgress] = useState(0);
    const [diagnosticsProgress, setDiagnosticsProgress] = useState(0);
    const { headerUrl, diagnosticLoading } = useCommonDispatch();
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        console.log('diagnosticLoading', diagnosticLoading)
    }, [diagnosticLoading])

    const relatedAudits = useMemo(() => {
        if (!data?.grouped) return [];
        
        return [
            ...(data.grouped as Record<AuditTypes, Audit[] | undefined>)["opportunities"] || [],
            ...(data.grouped as Record<AuditTypes, Audit[] | undefined>)["diagnostics"] || []
        ];
    }, [data?.grouped]);
    

    const { object, submit, isLoading, error } = useObject({
        api: `${AIBaseURL}/diagnosis`,
        schema: DiagnosticSchema,
        onFinish: (diagnostic: any) => {
            console.log(diagnostic)
            setDiagnosticsLoading(false)
            setLoadingText(null)
            setDiagnosticComplete(true)
            setDiagnosticsProgress(100);
            resetDiagnosticResults();
            toast({
                title: "AI Diagnostic Complete",
                description: "AI analysis of your page has been completed successfully.",
                variant: "default",
            });
        }
    });

    const { dispatch } = useCommonDispatch()
    const { options } = useAppContext()
    const optimizerUrl = options?.optimizer_url;
    const [showIframe, setShowIframe] = useState(false);

    const progressSteps = [
        { duration: '15s', label: 'Flush Cache', progress: isFlushingProgress },
        { duration: '5s', label: 'Optimizations', progress: settingsProgress },
        { duration: '10s', label: 'Server Info', progress: serverInfoProgress },
        { duration: '40s', label: 'New Page Speed', progress: pageSpeedProgress },
        { duration: '10s', label: 'Page Diagnostics', progress: diagnosticsProgress },
    ];

    const handleRemainingTimeUpdate = (time: number) => {
        setRemainingTime(time);
    };

    useEffect(() => {
       // console.log("diagnosticResults Available in app state", diagnosticResults)

        if(object?.AnalysisSummary && object.AnalysisSummary.length) {
            dispatch(setDiagnosticResults(object as DiagnosticResults));
        }
    }, [object])

    // useEffect(() => {
    //     if (diagnosticsLoading) {
    //         const timer = setInterval(() => {
    //             setRemainingTime(prev => Math.max(0, prev - 1));
    //         }, 1000);

    //         return () => clearInterval(timer);
    //     } else {
    //         setRemainingTime(progressSteps.reduce((total, step) => 
    //             total + parseInt(step.duration), 0
    //         ));
    //     }
    // }, [diagnosticsLoading]);

    const doAnalysis = useCallback(async (diagnostics: any) => {
        setLoadingText('Collecting active plugins...')
        const api = new ApiService(options);
        const plugins = await api.getActivePlugins();


        const _diagnostics = Object.entries(diagnostics).map(([key, value]) => value)
       // console.log(_diagnostics)

        const input = {
            settings: settings.map((s: any) => ({
                ...s,
                inputs: s.inputs.map((i: any) => ({
                    ...i,
                    diagnostics: i.value ? _diagnostics.filter((d: any) => d.key === i.key).map(({ key, ...rest }: any) => rest) : []
                })),
            })),
            plugins: plugins.data,
            report: {
                url: options?.optimizer_url,
                performance: data?.performance,
                metrics: data?.metrics.map((m: any) => ({
                    metric: m.refs.acronym,
                    displayValue: m.displayValue,
                    score: m.score,
                })),
                opportunities: data?.grouped?.opportunities.map((o: Audit) => ({
                    name: o.name,
                    score: o.score,
                    metrics: o.metrics.map((m: any) => m.refs.acronym),
                    settings: o.settings.map((s: any) => s.name),
                    files: o.files.items.map((f: AuditTableResource) => f?.url),
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

        setLoadingText('Hermes AI is analyzing your page...')
        

        try {

          //  console.log(input)
            submit(input)
            setDiagnosticsProgress(95);

        } catch (error: any) {
            console.error('AI Diagnosis Error:', error);
            setDiagnosticsLoading(false);
            setLoadingText(null);

            // Show error toast
            toast({
                title: "AI Diagnostic Failed",
                description: error?.message || "Failed to complete AI analysis. Please try again.",
                variant: "destructive",
            });

            // Show error in loading area
            setLoadingText(`❌ ${error?.message || "Failed to complete AI analysis. Please try again."}`);
        }
    }, [loadingText])

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === "RAPIDLOAD_CHECK_RESULTS") {
               // console.log("Received data from iframe:", event.data);

                setLoadingText('Collected data from your page...')
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

              //  console.log(event.data.data)
                doAnalysis(event.data.data)
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

    const renderOptimizationStep = useCallback((step: string, index: number) => (
        <div key={index} className="flex items-start gap-2 py-1 relative">
            <div className=" bg-gray-100 rounded-full flex items-center justify-center p-1">
                <LoaderIcon className="h-4 w-4 text-gray-600 animate-spin" />
            </div>
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <span className={`text-sm transition-colors text-gray-900`}>{step.name}</span>
        </div>
    ), []);


    const startDiagnostics = async () => {
        
        let progressInterval: NodeJS.Timeout | undefined = undefined;

        try {
            setDiagnosticsProgress(25);
            
            // progressInterval = setInterval(() => {
            //     setDiagnosticsProgress(prev => Math.min(prev + 10, 90));
            // }, 1000);

            if (diagnosticComplete) {
                setDiagnosticComplete(false)
                setShowIframe(false);
                // setDiagnosticsLoading(true);
                setLoadingText('Refreshing diagnostics...');
                await new Promise(resolve => setTimeout(resolve, 200));
                setShowIframe(true);
            } else {
                setLoadingText('Collecting Diagnostics from your page...')
                // setDiagnosticsLoading(true)
                setShowIframe(true)
            }
            
            // Clear interval when AI analysis is complete
            setDiagnosticsProgress(50);
           // return () => clearInterval(progressInterval);
           
        } catch (error) {
            setDiagnosticsProgress(0);
           // console.error('❌ Diagnostics failed:', error);
            toast({
                title: "Diagnostics Failed",
                description: error?.message || "Failed to run diagnostics",
                variant: "destructive",
            });
        } 
        //  finally {
        //     if ( diagnosticsProgress > 94) {
        //         clearInterval(progressInterval);
        //     }
        // }
    };


    const preloadPage = async (previewUrl: string)=> {
        const USER_AGENTS = {
            mobile: 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.133 Mobile Safari/537.36',
            desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        };

        const api = new ApiService(options);

        if (compareVersions(options?.rapidload_version, '2.2.11') > 0) {
         //   console.log('Preloading page with URL:', previewUrl);
            await api.post(`preload_page`, {
                url: previewUrl,
                user_agent: activeReport === 'mobile' ? USER_AGENTS.mobile : USER_AGENTS.desktop,
                nonce: options.nonce as string,
                job_id: data?.job_id as string,
            });
        } else {
            const rest = api.rest();
            await rest.request('/ping', {
                'url': previewUrl,
                'user_agent': activeReport === 'mobile' ? USER_AGENTS.mobile : USER_AGENTS.desktop,
                'nonce': options?.nonce as string,
                'job_id': data?.job_id as string,
            });
        }
    };

    const handleFlushCache = async () => {
       
        setCurrentStep(0);
        setIsFlushingProgress(0);
        const api = new ApiService(options);
        const previewUrl = optimizerUrl + '?rapidload_preview'
        
        try {
            // Clear page cache - 40% of progress
            setIsFlushingProgress(10);
            await api.post('clear_page_cache', {
                url: optimizerUrl
            });
            setIsFlushingProgress(40);

            setIsFlushingProgress(60);
            await preloadPage(previewUrl);
            setIsFlushingProgress(100);

            toast({
                title: "Cache Flushed",
                description: "Page cache has been cleared successfully.",
                variant: "default",
            });

        } catch (error: any) {
            setIsFlushingProgress(0);
            toast({
                title: "Cache Flush Failed",
                description: error.message || "Failed to clear page cache",
                variant: "destructive",
            });
        } finally {
           // console.log('Cache flush complete');
            setCurrentStep(1);
            runParallelSteps();
           // handleFetchSettings();
        }
    };

    const resetDiagnosticResults = () => {
        setCurrentStep(0);
        setSettingsProgress(0);
        setServerInfoProgress(0);
        setPageSpeedProgress(0);
        setDiagnosticsProgress(0);
       // dispatch(setDiagnosticResults(null));
    }


    const runParallelSteps = async () => {
        try {
            setCurrentStep(1); // Start all steps simultaneously
            
            await Promise.all([
                // Fetch Settings
                (async () => {
                    try {
                        setSettingsProgress(25);
                        const progressInterval = setInterval(() => {
                            setSettingsProgress(prev => Math.min(prev + 15, 90));
                        }, 500);
                        
                        await dispatch(fetchSettings(options, headerUrl ? headerUrl : options.optimizer_url, true));
                        
                        clearInterval(progressInterval);
                        setSettingsProgress(100);
                        
                      //  console.log('✅ Settings fetch completed');
                    } catch (error) {
                       // console.error('❌ Settings fetch failed:', error);
                        throw error;
                    }
                })(),

                // Server Info Check
                (async () => {
                    try {
                        setServerInfoProgress(25);
                        const progressInterval = setInterval(() => {
                            setServerInfoProgress(prev => Math.min(prev + 15, 90));
                        }, 500);

                        const api = new ApiService(options);
                        await api.post('titan_checklist_cron');
                        
                        clearInterval(progressInterval);
                        setServerInfoProgress(100);
                        
                       // console.log('✅ Server info check completed');
                    } catch (error) {
                       // console.error('❌ Server info check failed:', error);
                        throw error;
                    }
                })(),

                // New Page Speed
                (async () => {
                    try {
                        dispatch(setCommonState('diagnosticLoading', true));
                        setPageSpeedProgress(25);
                        
                        const progressInterval = setInterval(() => {
                            setPageSpeedProgress(prev => Math.min(prev + 5, 90));
                        }, 2000);

                        await dispatch(fetchReport(options, headerUrl ? headerUrl : options.optimizer_url, true));
                        
                        clearInterval(progressInterval);
                        setPageSpeedProgress(100);
                        
                       // console.log('✅ PageSpeed fetch completed');
                    } catch (error) {
                       // console.error('❌ PageSpeed fetch failed:', error);
                        throw error;
                    } finally {
                        dispatch(setCommonState('diagnosticLoading', false));
                    }
                })()
            ]);

            // All steps completed successfully
            toast({
                title: "All Steps Completed",
                description: "Settings, server info, and PageSpeed data updated successfully.",
                variant: "default",
            });

            // // Move to diagnostics step

            setTimeout(async() => {
                setCurrentStep(4); 
                startDiagnostics();
                
            }, 1000);

        } catch (error: any) {
            toast({
                title: "Process Failed",
                description: error?.message || "One or more steps failed to complete",
                variant: "destructive",
            });
        }
    };

    
    return (
        <AnimatePresence>
            <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className='bg-[#F0F0F1] dark:bg-brand-800'
            >
                
                <div className='px-6 py-6 bg-white rounded-3xl'>
                <div className="flex gap-4 w-full items-start">
                    {/* Logo Column */}
                    <div className="flex justify-start items-center gap-2 w-10">
                        <AnimatedLogo size="lg" isPlaying={diagnosticsLoading} />
                    </div>

                    {/* Content Column */}
                    <div className="flex flex-col gap-1 flex-grow">
                        <span className="text-base font-normal text-zinc-900 dark:text-zinc-100">
                        {diagnosticsLoading ? (
                            <>
                            {currentStep === 0 && "Clearing all cached data to ensure fresh analysis..."}
                            {currentStep === 1 && "Gathering current optimization settings..."}
                            {currentStep === 2 && "Analyzing server configuration and performance..."}
                            {currentStep === 3 && "Running comprehensive PageSpeed diagnostics..."}
                            {currentStep === 4 && (loadingText ? loadingText : "Processing data through AI for insights...")}
                            </>
                            ) : (
                                "Do you need any AI assistance?"
                            )}
                        </span>
                        <span className="font-normal text-sm text-zinc-600 dark:text-brand-300 max-w-[600px]">
                            {diagnosticsLoading ? (
                                remainingTime === 0 ? 
                                    "It's taking a bit longer than expected, hang tight..." :
                                    `Looks like I'll need to wait ${remainingTime}s more...`
                            ) : (
                                object?.AnalysisSummary ? 
                                    object.AnalysisSummary : 
                                    "Let's check if your optimizations are working properly. Things might not update right away due to caching or conflicts. We should test everything to make sure it's running well."
                            )}
                        
                        </span>
                    </div>

                    {/* Button Column */}
                    {!diagnosticsLoading &&
                    <div className="flex justify-end items-center mt-2">
                        <AppButton
                            disabled={diagnosticsLoading}
                            className="rounded-xl px-8 py-6 whitespace-nowrap"
                            onClick={() => {
                                handleFlushCache();
                                setDiagnosticsLoading(true);
                                // dispatch(setDiagnosticResults({
                                //     AnalysisSummary: ''
                                // }));
                            }}
                        >
                            {/* {diagnosticsLoading && <LoaderIcon className="h-4 w-4 text-white animate-spin" />} */}
                            {diagnosticResults?.AnalysisSummary?.length ? 'Run Diagnostics Test Again' : 'Run Diagnostics Test '}
                            {/* Run Diagnostics Test  */}
                        </AppButton>
                    </div>
                    }
                </div>
                    
                    {/* diagnosticsLoading */}
                    {diagnosticsLoading && (
                    <m.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ 
                        duration: 0.3,
                        ease: "easeOut"
                        }}
                    >                         
                    {/* <ProgressTracker steps={progressSteps} currentStep={0} /> */}
                
                    <div className="border-b border-zinc-200 dark:border-zinc-800 -mx-6 my-6"/>
                    
                    <div className="flex flex-col gap-4">
                        <ProgressTracker 
                            steps={progressSteps} 
                            currentStep={currentStep ?? undefined}
                            onTimeUpdate={handleRemainingTimeUpdate}
                        />
                        </div>
                    </m.div>
                    )}
                    
                    {/* {object?.AnalysisSummary?.length &&
                        <div className="grid grid-cols-5 gap-4 mb-6">
                            <div className={cn('relative col-span-5 bg-brand-0 rounded-2xl p-10 flex flex-col gap-4 text-center', !object?.CriticalIssues?.length && 'items-center justify-center')}>
                                


                            </div>
                        </div>
                    } */}


                    

                    {showIframe && (
                        <div
                            className="h-0 overflow-hidden"
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
                                    // src={showIframe ? `${optimizerUrl}/?rapidload_preview` : ''}
                                     src={showIframe ? 'http://rapidload.local/?rapidload_preview': ''} 
                                    className="w-full h-[600px] border-0"
                                    title="Optimization Test"
                                />
                            </div>
                        </div>
                    )}
                </div>
                
                {diagnosticResults?.AnalysisSummary?.length && <AnalysisResults object={diagnosticResults} relatedAudits={relatedAudits} />}
            </m.div>
        </AnimatePresence>
    )
}

export default Optimizations;   