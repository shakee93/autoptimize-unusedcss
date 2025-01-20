import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import AppButton from "components/ui/app-button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../../components/ui/accordion";
import { useCompletion, experimental_useObject as useObject } from 'ai/react'
import { AnimatePresence, m, motion } from "framer-motion"
import useCommonDispatch from "hooks/useCommonDispatch";
import { changeGear, fetchReport, fetchSettings, setDiagnosticResults, setDiagnosticProgress } from '../../../store/app/appActions';
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
import AIDemoMessage from "../components/AIDemoMessage";
import ErrorFetch from "components/ErrorFetch";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

const DiagnosticSchema = z.object({
    // active_settings_inputs: z.array(z.object({
    //     name: z.string(),
    //     value: z.string().nullable(),
    // })),
    AnalysisTitle: z.string().optional(),
    AnalysisSummary: z.string(),
    // PluginConflicts: z.array(
    //     z.object({
    //         plugin: z.string(),
    //         recommendedAction: z.string(),
    //     })
    // ),
    CriticalIssues: z.array(
        z.object({
            issue: z.string(),
            description: z.string(),
            solutions: z.object({
                solutions_reasoning: z.array(z.object({
                    block_type: z.enum(['observation', 'analysis', 'hypothesis', 'validation', 'conclusion']),
                    thought: z.string(),
                    reasoning: z.string(),
                    confidence_level: z.number().min(0).max(100),
                    supporting_evidence: z.array(z.string()),
                    related_blocks: z.array(z.string()).optional(),
                })),
                solutions_list: z.array(z.object({
                    type: z.enum(['rapidload_fix', 'wordpress_fix', 'theme_fix', 'another_plugin_fix', 'code_fix', 'server_config_fix', 'server_upgrade_fix']),
                    title: z.string(),
                    description: z.string(),
                    steps: z.array(z.object({
                        step: z.number(),
                        action: z.string(),
                        details: z.string(),
                        verification: z.string().optional()
                    })),
                })),
            }),
            resources: z.array(z.object({
                name: z.string(),
                url: z.string(),
                type: z.enum(['javascript', 'css', 'image', 'html', 'other']),
                relatedAudit: z.string().optional().describe('Related audit from PageSpeed Insights.'),
                reason: z.string().optional().describe('Reason why this resource is related to the issue.'),
            })).optional(),
            pagespeed_insight_audits: z.array(z.string()),
            pagespeed_insight_metrics: z.array(z.string()),
            anyAdditionalTips: z.array(z.string()).optional().describe('Any additional tips to fix the issue.'),
        })
    ),
});

// TODO: create an env variable for this
// const AIBaseURL = "http://localhost:3000/api"
const AIBaseURL = window.rapidload_optimizer.ai_root || "https://ai.rapidload.io/api"

const Optimizations = ({ }) => {
    const { settings, data, activeReport, diagnosticResults, diagnosticProgress } = useSelector(optimizerData);
    const [diagnosticComplete, setDiagnosticComplete] = useState(false);
    const [loadingText, setLoadingText] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [isFlushingProgress, setIsFlushingProgress] = useState(0);
    const [settingsProgress, setSettingsProgress] = useState(0);
    const [pageSpeedProgress, setPageSpeedProgress] = useState(0);
    const [serverInfoProgress, setServerInfoProgress] = useState(0);
    const [diagnosticsProgress, setDiagnosticsProgress] = useState(0);
    
    const { headerUrl, diagnosticLoading } = useCommonDispatch();
    const [remainingTime, setRemainingTime] = useState(0);
    const [serverDetails, setServerDetails] = useState(null);
    const [input, setInput] = useState(null);
    const [diagnosticError, setDiagnosticError] = useState<string | null>(null);

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
            //console.log(diagnostic)
            aiResultsComplete();

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
        if (object?.AnalysisSummary && object.AnalysisSummary.length) {
            dispatch(setDiagnosticResults(object as DiagnosticResults));
        }
    }, [object]);

    
    const aiResultsComplete = () => {
        setLoadingText(null)
        setDiagnosticComplete(true)
        setDiagnosticsProgress(100);
        resetDiagnosticResults();
        dispatch(setCommonState('diagnosticLoading', false));
    };



    const resetDiagnosticResults = () => {
        setCurrentStep(0);
        setSettingsProgress(0);
        setServerInfoProgress(0);
        setPageSpeedProgress(0);
        setDiagnosticsProgress(0);
        setIsFlushingProgress(0);
        setAiLoading(false);
    }



    const handleDiagnosticError = (error: string) => {
       
        return <div className="flex gap-8 items-center mt-8">
            <div className='border-2 border-red-500 rounded-xl flex items-start gap-4 p-4'>
                <div className='p-2 bg-red-200/30 rounded-lg'>
                    <ExclamationTriangleIcon className='w-10 h-10 text-red-500' />
                </div>
                <div className='flex flex-col gap-1'>
                <span className='font-medium text-md '>Oops! Something went wrong</span>
                <span className='text-sm text-brand-700 dark:text-brand-300'>Run Diagnostics Test Again</span>
                <div className='text-sm text-brand-500 dark:text-brand-200 border-t mt-2 pt-2 max-w-[350px]'>
                <span className='font-medium text-brand-800 dark:text-brand-400'>Details:</span> {error}</div>
                </div>
            </div>
        </div>
    }


    const doAnalysis = useCallback(async (diagnostics: any) => {
        setLoadingText('Collecting active plugins...')
        const api = new ApiService(options);
        const plugins = await api.getActivePlugins();
        const server_data = await api.post('rapidload_server_info');


        const _diagnostics = Object.entries(diagnostics).map(([key, value]) => value)
        // console.log(_diagnostics)

        const input = {
            settings: settings.map(({ status, ...rest }) => ({
                ...rest,
                enabled: rest.inputs[0]?.value || false,
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
            plugin_diagnostics: settings.map((s: any) => ({
                name: s.name,
                settings_diagnostics: s.status,
                real_user_diagnostics: _diagnostics.find((d: any) => d.name === s.name),
                value: s.name === "Cache Policy" ? "one_time_action" : (s.inputs[0]?.value || false)
            })).filter((s: any) => s.settings_diagnostics || s.real_user_diagnostics),
            server_details: server_data.data ? {
                ...server_data.data,
                headers: {
                    ...server_data.data.headers,
                    'x-cache-handler': undefined,
                    'x-cache-status': undefined,
                    server: undefined,
                }
            } : null,
        }

        setLoadingText('Hermes AI is analyzing your page...')


        try {

            setInput(input)
            submit(input)
            setDiagnosticsProgress(95);

        } catch (error: any) {
            console.error('AI Diagnosis Error:', error);
            dispatch(setCommonState('diagnosticLoading', false));
            setAiLoading(false);
            setLoadingText(null);
            setDiagnosticError(error?.message || "Failed to complete AI analysis. Please try again.");
            
            // Show error toast
            toast({
                title: "AI Diagnostic Failed",
                description: error?.message || "Failed to complete AI analysis. Please try again.",
                variant: "destructive",
            });

            // Show error in loading area
            setLoadingText(`❌ ${error?.message || "Failed to complete AI analysis. Please try again."}`);
        }
    }, [loadingText, serverDetails, settings])

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === "RAPIDLOAD_CHECK_RESULTS") {
                setLoadingText('Collected data from your page...')
                doAnalysis(event.data.data)
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [settings]);

    const startDiagnostics = async () => {

        try {

            setDiagnosticsProgress(25);

            // const progressInterval = setInterval(() => {
            //     setDiagnosticsProgress(prev => Math.min(prev + 10, 90));
            // }, 1000);

            if (diagnosticComplete) {
                setDiagnosticComplete(false)
                setShowIframe(false);
                setLoadingText('Refreshing diagnostics...');
                await new Promise(resolve => setTimeout(resolve, 200));
                setShowIframe(true);
            } else {
                setLoadingText('Collecting Diagnostics from your page...')
                setShowIframe(true)
            }

            
            setDiagnosticsProgress( 50);

        } catch (error: any) {
            setDiagnosticsProgress(0);
            setDiagnosticError(error?.message || "Failed to run diagnostics");
            // console.error('❌ Diagnostics failed:', error);
            // toast({
            //     title: "Diagnostics Failed",
            //     description: error?.message || "Failed to run diagnostics",
            //     variant: "destructive",
            // });
        }
        
    };


    const preloadPage = async (previewUrl: string) => {
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
        
        const api = new ApiService(options);
        const previewUrl = optimizerUrl + '?rapidload_preview'

        try {
        
            
            setIsFlushingProgress(10);
           
            await api.post('clear_page_cache', {
                url: optimizerUrl
            });

            setIsFlushingProgress(60);

            await preloadPage(previewUrl);

            setIsFlushingProgress(100);
            setCurrentStep(1);
            runParallelSteps();
           
            // toast({
            //     title: "Cache Flushed",
            //     description: "Page cache has been cleared successfully.",
            //     variant: "default",
            // });

        } catch (error: any) {
            setIsFlushingProgress(0);
            
            setDiagnosticError(error.message || "Failed to clear page cache");
            
            // console.error('❌ Flushing cache failed:', error);

            // toast({
            //     title: "Cache Flush Failed",
            //     description: error.message || "Failed to clear page cache",
            //     variant: "destructive",
            // });
        } 
    };

    const simulateProgress = (setter: React.Dispatch<React.SetStateAction<number>>, start: number, end: number) => {
        if (start >= end) return;
    
        setTimeout(() => {
            setter(start + 5); 
            simulateProgress(setter, start + 5, end); 
        }, 100); 
    };
    
    const runParallelSteps = async () => {
        
        try {
          
            await Promise.all([
                // Fetch Settings
                (async () => {
                    try {
                       
                        simulateProgress(setSettingsProgress, 25, 90);
                       // setSettingsProgress(25);
                       
                        await dispatch(fetchSettings(options, headerUrl ? headerUrl : options.optimizer_url, true));

                        setSettingsProgress(100);
                       

                        //  console.log('✅ Settings fetch completed');

                    } catch (error: any) {
                       
                        setDiagnosticError(error?.message || "Failed to run settings");
                        throw error;
                    }
                })(),

                // Server Info Check
                (async () => {
                    try {
                        
                        simulateProgress(setServerInfoProgress, 25, 90);
                      // setServerInfoProgress(25);
                        

                        const api = new ApiService(options);
                        const data = await api.post('rapidload_server_info1');
                        setServerDetails(data)
   
                        setServerInfoProgress(100);

                       
                        
                        // console.log('✅ Server info check completed');
                    } catch (error: any) {
                      
                        setDiagnosticError(error?.message || "Failed to run server info");
                        throw error;
                    }
                })(),

                // New Page Speed
                (async () => {
                    try {
                      
                        simulateProgress(setPageSpeedProgress, 25, 90);
                        // setPageSpeedProgress(25);

                        await dispatch(fetchReport(options, headerUrl ? headerUrl : options.optimizer_url, true));

                        setPageSpeedProgress(100);
                        
                    
                        // console.log('✅ PageSpeed fetch completed');
                    } catch (error: any) {
                        
                         setDiagnosticError(error?.message || "Failed to run page speed");               
                        throw error;
                    }
                })()
            ]);

            // All steps completed successfully
            // toast({
            //     title: "All Steps Completed",
            //     description: "Settings, server info, and PageSpeed data updated successfully.",
            //     variant: "default",
            // });

            setTimeout(async () => {
                setCurrentStep(4);
                startDiagnostics();
    
            }, 1000);
           
        } catch (error: any) {
            setDiagnosticError(error?.message || "One or more steps failed to complete");
           
        }
    };


    
    

   useEffect(() => {
    if(diagnosticError?.length){
        resetDiagnosticResults();
        console.log('settingsProgress: ', settingsProgress, 'serverInfoProgress: ', serverInfoProgress, 'pageSpeedProgress: ', pageSpeedProgress)
      
    }
   }, [diagnosticError])


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
                            <AnimatedLogo size="lg" isPlaying={aiLoading} />
                        </div>

                        {/* Content Column */}
                        <div className="flex flex-col gap-1 flex-grow">
                            <span className="text-base font-normal text-zinc-900 dark:text-zinc-100">
                                {aiLoading ? (
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
                                {aiLoading ? (
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
                        {!aiLoading &&
                            <div className="flex justify-end items-center mt-2">
                                <AppButton
                                    disabled={aiLoading}
                                    className="rounded-xl px-8 py-6 whitespace-nowrap"
                                    onClick={() => {
                                    
                                        setDiagnosticError(null);
                                        dispatch(setCommonState('diagnosticLoading', true));
                                        setAiLoading(true);
                                        handleFlushCache();
                                       
                                    }}
                                >
                                    {/* {diagnosticsLoading && <LoaderIcon className="h-4 w-4 text-white animate-spin" />} */}
                                    {diagnosticResults?.AnalysisSummary?.length ? 'Run Diagnostics Test Again' : 'Run Diagnostics Test '}
                                    
                                </AppButton>
                            </div>
                        }
                    </div>

                    {diagnosticError?.length && handleDiagnosticError(diagnosticError)} 
                    
                    {/* diagnosticsLoading */}
                    {aiLoading && (
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

                            <div className="border-b border-zinc-200 dark:border-zinc-800 -mx-6 my-6" />

                            <div className="flex flex-col gap-4">
                                <ProgressTracker
                                    steps={progressSteps}
                                    currentStep={currentStep}
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
                                    src={showIframe ? `${optimizerUrl}/?rapidload_preview` : ''}
                                    // src={showIframe ? 'http://rapidload.local/?rapidload_preview' : ''}
                                    className="w-full h-[600px] border-0"
                                    title="Optimization Test"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {diagnosticResults?.AnalysisSummary?.length &&
                    <AnalysisResults
                        object={diagnosticResults}
                        relatedAudits={relatedAudits}
                        input={input}
                    />
                }
            </m.div>
        </AnimatePresence>
    )
}

export default Optimizations;   