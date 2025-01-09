import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";
import { Sparkles } from "lucide-react";
import AppButton from "components/ui/app-button";
import { cn } from "lib/utils";
import type { PartialObject } from '../../types/ai';

interface AnalysisResultsProps {
    object: PartialObject<{
        AnalysisSummary: string;
        CriticalIssues: Array<{
            issue: string;
            description: string;
            howToFix: Array<{
                step: string;
                description: string;
                type: "rapidload_fix" | "wordpress_fix" | "code_fix" | "other";
                rapidload_setting_input?: { name: string; };
            }>;
            resources: Array<any>;
            pagespeed_insight_audits: string[];
            pagespeed_insight_metrics: string[];
        }>;
        PluginConflicts?: Array<{
            plugin: string;
            recommendedAction: string;
            categories?: string[];
        }>;
    }>;
}

export const AnalysisResults = ({ object }: AnalysisResultsProps) => {


    return (
        <div className="grid grid-cols-5 gap-4 mb-6">
            <div className={cn('relative col-span-5 bg-brand-0 rounded-2xl p-10 flex flex-col gap-4 text-center', 
                !object?.CriticalIssues?.length && 'items-center justify-center')}>
                <div className="w-full">
                                    <div className="w-full mt-4 text-left">
                                        <div className="flex flex-col gap-2">
                                            <Accordion type="multiple" defaultValue={["0"]}>
                                                {object?.CriticalIssues?.map((result: any, index: number) => (
                                                    <AccordionItem key={index} value={index.toString()}>
                                                        <AccordionTrigger className=" font-semibold text-zinc-900 dark:text-zinc-100">

                                                            <div className="flex flex-col justify-start items-start gap-0.5 w-full">
                                                                <div>
                                                                    {result?.issue}
                                                                </div>

                                                            </div>


                                                        </AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className="px-4 py-4 border-2 shadow-md rounded-lg space-y-2 flex flex-col justify-start items-start text-left">
                                                                <div>
                                                                    <p className="text-sm text-left font-normal text-zinc-600 dark:text-zinc-300">{result?.description}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200 mb-2">How to fix</p>
                                                                    <ul className="list-disc space-y-4 pl-4 mt-4">
                                                                        {result?.howToFix?.map((fix: any) => (
                                                                            <li key={fix.step} className="text-sm text-zinc-600 dark:text-zinc-300">
                                                                                <div className="flex flex-col gap-1">
                                                                                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{fix.step}</span>
                                                                                    <span className="text-xs text-zinc-600 dark:text-zinc-300">{fix.description}</span>
                                                                                    {fix.type === 'rapidload_fix' &&
                                                                                        <>
                                                                                            <AppButton
                                                                                                size="sm"
                                                                                                className="mt-2 w-fit px-4 text-xs flex items-center gap-2"
                                                                                                onClick={() => {
                                                                                                   // console.log(settings.find((s: any) => s.inputs.find((i: any) => i.key === fix.rapidload_setting_input?.name)))
                                                                                                }}
                                                                                            >
                                                                                                <Sparkles className="h-3.5 w-3.5 text-white -ml-1.5" /> Fix with AI
                                                                                            </AppButton>
                                                                                            {/* <span className="mt-2">
                                                                                                <Setting
                                                                                                    index={index}
                                                                                                    settings={settings.find((s: any) => s.inputs.find((i: any) => i.key === fix.rapidload_setting_input?.name))}
                                                                                                />
                                                                                            </span> */}

                                                                                        </>
                                                                                    }

                                                                                </div>
                                                                            </li>
                                                                        ))}

                                                                    </ul>

                                                                    <div className="flex flex-col gap-2 mt-4">
                                                                        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Related Resources:</span>
                                                                        <span className="text-sm text-blue-600 dark:text-blue-300"> <a href={result?.resources?.map((r: any) => r.url).join(', ')} target="_blank" rel="noopener noreferrer">{result?.resources?.map((r: any) => r.url).join(', ')}</a> </span>
                                                                        <span className="text-sm text-zinc-600 dark:text-zinc-300"> <a href={result?.resources?.map((r: any) => r.url).join(', ')} target="_blank" rel="noopener noreferrer">{result?.resources?.map((r: any) => r.reason).join(', ')}</a> </span>
                                                                    </div>

                                                                    <div className="flex flex-col gap-2 mt-4">
                                                                        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Related Audit:</span>
                                                                        <span className="text-sm dark:text-blue-300"> <a href={result?.pagespeed_insight_audits?.join(', ')} target="_blank" rel="noopener noreferrer">
                                                                            {result?.pagespeed_insight_audits?.join(', ')}
                                                                        </a> </span>
                                                                    </div>

                                                                    <div className="flex flex-col gap-2 mt-4">
                                                                        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Related Metrics:</span>
                                                                        <span className="text-sm dark:text-blue-300"> <a href={result?.pagespeed_insight_metrics?.join(', ')} target="_blank" rel="noopener noreferrer">
                                                                            {result?.pagespeed_insight_metrics?.join(', ')}
                                                                        </a> </span>
                                                                    </div>



                                                                </div>
                                                            </div>

                                                            {/* <Collapsible>
                                                                <CollapsibleTrigger className="mt-6 text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-2">
                                                                    View Raw Data
                                                                </CollapsibleTrigger>
                                                                <CollapsibleContent>
                                                                    <pre className="mt-2 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg overflow-auto">
                                                                        {JSON.stringify(result, null, 2)}
                                                                    </pre>
                                                                </CollapsibleContent>
                                                            </Collapsible> */}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>


                                            {object?.PluginConflicts && object?.PluginConflicts.length > 0 && (
                                                <div className="flex flex-col gap-2 mt-6">
                                                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Potential Plugin Conflicts:</span>

                                                    <span className="text-sm text-zinc-600 dark:text-zinc-300">
                                                        These plugins may conflict with each other, causing issues with your page.

                                                        WORK IN PROGRESS
                                                    </span>
                                                    <ul className="space-y-3">
                                                        {object?.PluginConflicts.map((conflict: any, index: number) => (
                                                            <li key={index} className="flex flex-col gap-1">
                                                                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                                                    {conflict.plugin}
                                                                </span>
                                                                <span className="text-sm text-zinc-600 dark:text-zinc-300">
                                                                    Recommended Action: {conflict.recommendedAction}
                                                                </span>
                                                                <span className="text-sm text-zinc-600 dark:text-zinc-300">
                                                                    Categories: {conflict?.categories?.join(', ')}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
            </div>
        </div>
    );
}; 