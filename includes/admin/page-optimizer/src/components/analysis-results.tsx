import { Sparkles } from "lucide-react";
import AppButton from "components/ui/app-button";
import { cn } from "lib/utils";
import type { PartialObject } from '../types/ai';
import Card from "@/components/ui/card";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import Accordion from "components/accordion";
import TooltipText from "components/ui/tooltip-text";

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
    const [openIssues, setOpenIssues] = useState<string[]>([]);

    const toggleIssue = (issueId: string) => {
        setOpenIssues(prev => 
            prev.includes(issueId) 
                ? prev.filter(id => id !== issueId)
                : [...prev, issueId]
        );
    };

    return (
        <div className="grid grid-cols-5 gap-4 mb-6">
            <div className={cn('relative col-span-5')}>
                {object?.CriticalIssues?.map((issue, index) => (
                    <Card
                        key={index}
                        className={cn(
                            'overflow-hidden w-full flex justify-center flex-col items-center p-0 mb-4',
                            openIssues.includes(index.toString()) ? 'shadow-lg dark:shadow-brand-800/30' : 'dark:hover:border-brand-700/70 hover:border-brand-400/60'
                        )}
                    >
                        <div className={cn(
                            'min-h-[56px] relative flex justify-between w-full py-2 px-4',
                        )}>
                            <div className='flex gap-3 font-normal items-center text-base'>
                                <div className='inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-200/50'>
                                    <span className='w-3 h-3 border-2 border-brand-400/60 rounded-full'></span>
                                </div>
                                <div className='flex flex-col justify-around'>
                                    <div className='flex gap-1.5 items-center'>
                                        {issue.issue}
                                    </div>
                                </div>
                            </div>

                            <div className='flex gap-3 items-center'>
                                <TooltipText text="Show details">
                                    <div 
                                        onClick={() => toggleIssue(index.toString())}
                                        className={`min-w-[125px] cursor-pointer flex items-center gap-2 pl-4 pr-2 py-1.5 text-sm rounded-2xl dark:hover:bg-brand-800 hover:bg-brand-100 transition-colors ${openIssues.includes(index.toString()) ? ' dark:bg-brand-900 border' : 'border'}`}
                                    >
                                        {openIssues.includes(index.toString()) ? 'Hide Details' : 'Show Details'}
                                        {openIssues.includes(index.toString()) 
                                            ? <MinusCircleIcon className='w-6 h-6 dark:text-brand-500 text-brand-900'/> 
                                            : <PlusCircleIcon className='w-6 h-6 dark:text-brand-500 text-brand-900'/>
                                        }
                                    </div>
                                </TooltipText>
                            </div>
                        </div>

                        <Accordion isOpen={openIssues.includes(index.toString())}>
                            <div className="px-4 py-4 border-t space-y-4">
                                <div>
                                    <p className="text-sm text-left font-normal text-zinc-600 dark:text-zinc-300">{issue.description}</p>
                                </div>
                                
                                <div>
                                    <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200 mb-2">How to fix</p>
                                    <ul className="list-disc space-y-4 pl-4">
                                        {issue.howToFix?.map((fix, fixIndex) => (
                                            <li key={fixIndex} className="text-sm text-zinc-600 dark:text-zinc-300">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{fix.step}</span>
                                                    <span className="text-xs text-zinc-600 dark:text-zinc-300">{fix.description}</span>
                                                    {fix.type === 'rapidload_fix' && (
                                                        <AppButton
                                                            size="sm"
                                                            className="mt-2 w-fit px-4 text-xs flex items-center gap-2"
                                                        >
                                                            <Sparkles className="h-3.5 w-3.5 text-white -ml-1.5" /> Fix with AI
                                                        </AppButton>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {(issue.resources?.length > 0 || issue.pagespeed_insight_audits?.length > 0 || issue.pagespeed_insight_metrics?.length > 0) && (
                                        <div className="mt-4 space-y-4 border-t pt-4">
                                            {issue.resources?.length > 0 && (
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Related Resources:</span>
                                                    {issue.resources.map((resource, resIndex) => (
                                                        <div key={resIndex}>
                                                            <a href={resource.url} target="_blank" rel="noopener noreferrer" 
                                                               className="text-sm text-blue-600 dark:text-blue-300 hover:underline">{resource.url}</a>
                                                            <p className="text-sm text-zinc-600 dark:text-zinc-300">{resource.reason}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {issue.pagespeed_insight_audits?.length > 0 && (
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Related Audits:</span>
                                                    {issue.pagespeed_insight_audits.map((audit, auditIndex) => (
                                                        <span key={auditIndex} className="text-sm text-zinc-600 dark:text-zinc-300">{audit}</span>
                                                    ))}
                                                </div>
                                            )}

                                            {issue.pagespeed_insight_metrics?.length > 0 && (
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Related Metrics:</span>
                                                    {issue.pagespeed_insight_metrics.map((metric, metricIndex) => (
                                                        <span key={metricIndex} className="text-sm text-zinc-600 dark:text-zinc-300">{metric}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Accordion>
                    </Card>
                ))}

                {object?.PluginConflicts && object.PluginConflicts.length > 0 && (
                    <Card className="mt-4 p-4">
                        <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-200 mb-4">Potential Plugin Conflicts</h3>
                        <div className="space-y-4">
                            {object.PluginConflicts.map((conflict, index) => (
                                <div key={index} className="border-b pb-4 last:border-b-0">
                                    <h4 className="text-sm font-medium text-red-600 dark:text-red-400">{conflict.plugin}</h4>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                                        Recommended Action: {conflict.recommendedAction}
                                    </p>
                                    {conflict.categories && (
                                        <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                                            Categories: {conflict.categories.join(', ')}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}; 