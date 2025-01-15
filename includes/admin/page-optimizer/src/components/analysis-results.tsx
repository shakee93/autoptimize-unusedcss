import { AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";
import { Sparkles, MicroscopeIcon, LightbulbIcon, FileCodeIcon } from "lucide-react";
import { PlusCircleIcon, MinusCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import AppButton from "components/ui/app-button";
import { cn } from "lib/utils";
import type { PartialObject } from '../../types/ai';
import { useState } from "react";
import Accordion from "components/accordion";
import Card from "@/components/ui/card";
import { InformationCircleIcon, MicrophoneIcon } from "@heroicons/react/24/outline";
import TooltipText from "./ui/tooltip-text";
import FileTable from "app/page-optimizer/components/audit/content/table";
import { Fail } from "app/page-optimizer/components/icons/icon-svg";

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
    relatedAudits: Audit[];
}

export const AnalysisResults = ({ object, relatedAudits }: AnalysisResultsProps) => {
    const [openItems, setOpenItems] = useState<string[]>(["0"]);

    const toggleAccordion = (id: string) => {
        setOpenItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };


    return (
        <div className="grid grid-cols-5 gap-4 mb-6">
            <div className={cn('relative col-span-5 flex flex-col gap-4',
                !object?.CriticalIssues?.length && 'items-center justify-center')}>
                <div className="w-full">
                    <div className="w-full mt-4">
                        <div className="flex flex-col gap-4">
                            {object?.CriticalIssues?.map((result: any, index: number) => (

                                <Card
                                    spreader={!openItems.includes(index.toString())}
                                    key={index}
                                    className={cn(
                                        'overflow-hidden w-full flex justify-center flex-col items-center p-0 rounded-3xl',
                                        openItems.includes(index.toString()) ? 'shadow-lg dark:shadow-brand-800/30' : 'dark:hover:border-brand-700/70 hover:border-brand-400/60'
                                    )}
                                >
                                    {/* {console.log(result)} */}
                                    <div className="min-h-[56px] relative flex justify-between w-full py-2 px-4">
                                        <div className="flex gap-3 font-normal items-center text-base">
                                            <div className="flex flex-col justify-around">
                                                <div className="flex gap-3.5 items-center text-zinc-800 dark:text-zinc-200">
                                                    <div
                                                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-200/50`}>
                                                        <Fail />
                                                    </div>
                                                    {result?.issue}
                                                    {result?.pagespeed_insight_metrics?.map((metric: string) => (
                                                        <div
                                                            className={cn(
                                                                'flex text-xxs items-center transition-colors flex gap-1 cursor-default hover:bg-brand-100 dark:hover:bg-brand-800 border py-1 px-1.5 rounded-md',
                                                            )}
                                                            key={metric}
                                                        >
                                                            {metric}
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>
                                        </div>
                                        {/* <div 
                                            onClick={() => toggleAccordion(index.toString())}
                                            className="cursor-pointer flex items-center gap-2 pl-4 pr-2 py-1.5 text-sm rounded-2xl dark:hover:bg-brand-800 hover:bg-brand-100 transition-colors border"
                                        >
                                            {openItems.includes(index.toString()) ? 'Hide Details' : 'Show Details'}
                                        </div> */}
                                        <TooltipText
                                            text={openItems.includes(index.toString()) ? 'Hide AI Details' : 'Show AI Details'}
                                        >
                                            <div
                                                data-tour={index === 0 ? "show-ai-actions" : undefined}
                                                onClick={() => toggleAccordion(index.toString())}
                                                className={cn(
                                                    'min-w-[125px] cursor-pointer flex items-center gap-2 pl-4 pr-2 py-1.5 text-sm rounded-2xl',
                                                    'dark:hover:bg-brand-800 hover:bg-brand-100 transition-colors border',
                                                    openItems.includes(index.toString()) && 'dark:bg-brand-900'
                                                )}
                                            >
                                                {openItems.includes(index.toString()) ? 'Hide Issue' : 'Show Issue'}
                                                {openItems.includes(index.toString())
                                                    ? <MinusCircleIcon className='w-6 h-6 dark:text-brand-500 text-brand-900' />
                                                    : <PlusCircleIcon className='w-6 h-6 dark:text-brand-500 text-brand-900' />
                                                }
                                            </div>
                                        </TooltipText>
                                    </div>

                                    <Accordion
                                        id={index.toString()}
                                        className="audit-content"
                                        initialRender={true}
                                        isOpen={openItems.includes(index.toString())}
                                    >
                                        {/* Content section */}
                                        <div className="border-t space-y-2">
                                            <div className="p-8">
                                                <div className="border-b border-zinc-200 dark:border-zinc-800 flex flex-col gap-2 mb-4">
                                                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 flex gap-2 items-center"> <MicroscopeIcon className="w-5 h-5" />Core Issue</p>
                                                    <p className="text-sm text-left text-brand-700 dark:text-brand-300 pb-4">{result?.description}</p>
                                                </div>
                                                <div>
                                                    <div className="flex gap-2 w-full justify-between my-4">
                                                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 flex gap-2 items-center"> <LightbulbIcon className="w-5 h-5" />How to fix this?</p>
                                                        {result?.howToFix?.some((fix: any) => fix.type === 'rapidload_fix') && (
                                                            <AppButton
                                                                size="sm"
                                                                className="w-fit px-4 text-xs flex items-center gap-2 rounded-xl"
                                                                onClick={() => {
                                                                    // console.log(settings.find((s: any) => s.inputs.find((i: any) => i.key === fix.rapidload_setting_input?.name)))
                                                                }}
                                                            >
                                                                <Sparkles className="h-3.5 w-3.5 text-white -ml-1.5" /> Fix with AI
                                                            </AppButton>
                                                        )}</div>
                                                    <ul className="list-disc space-y-4 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 px-8 bg-brand-100/30 dark:bg-brand-800">
                                                        {result?.howToFix?.map((fix: any, index: number) => (
                                                            <li
                                                                key={index}
                                                                className={cn(
                                                                    "text-sm text-zinc-600 dark:text-zinc-300 marker:text-brand-300 marker:text-lg",
                                                                    index !== result.howToFix.length - 1 && "border-b border-zinc-200 dark:border-zinc-800 pb-4"
                                                                )}
                                                            >
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{fix.step}</span>
                                                                    <span className="text-sm text-zinc-600 dark:text-zinc-300">{fix.description}</span>
                                                                </div>
                                                            </li>
                                                        ))}

                                                    </ul>

                                                    {result?.pagespeed_insight_audits && result?.pagespeed_insight_audits.length > 0 &&
                                                        <div className="flex flex-col gap-2 mt-4">
                                                            {/* <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Related Resources:</span> */}
                                                            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 flex gap-2 items-center"> <FileCodeIcon className="w-5 h-5" />Related Resources</p>
                                                            <p className="text-sm text-left text-brand-700 dark:text-brand-300">{result?.pagespeed_insight_audits?.join(', ')}</p>
                                                            {/* this part is not returning anything */}
                                                            {/* <span className="text-sm text-blue-600 dark:text-blue-300"> <a href={result?.resources?.map((r: any) => r.url).join(', ')} target="_blank" rel="noopener noreferrer">{result?.resources?.map((r: any) => r.url).join(', ')}</a> </span>
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-300"> <a href={result?.resources?.map((r: any) => r.url).join(', ')} target="_blank" rel="noopener noreferrer">{result?.resources?.map((r: any) => r.reason).join(', ')}</a> </span> */}
                                                            {/* end here */}

                                                            {relatedAudits.map((audit, index) => (
                                                                result?.pagespeed_insight_audits?.includes(audit.name) ? (
                                                                    <FileTable
                                                                        key={index}
                                                                        index={index}
                                                                        group={audit.files}
                                                                        audit={audit}
                                                                        aiTable={true}
                                                                    />
                                                                ) : null
                                                            ))}


                                                        </div>
                                                    }

                                                    {/* <div className="flex flex-col gap-2 mt-4">
                                                        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Related Audit:</span>
                                                        <span className="text-sm dark:text-blue-300"> <a href={result?.pagespeed_insight_audits?.join(', ')} target="_blank" rel="noopener noreferrer">
                                                            {result?.pagespeed_insight_audits?.join(', ')}
                                                        </a> </span>
                                                    </div> */}

                                                    {/* <div className="flex flex-col gap-2 mt-4">
                                                        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Related Metrics:</span>
                                                        <span className="text-sm dark:text-blue-300"> <a href={result?.pagespeed_insight_metrics?.join(', ')} target="_blank" rel="noopener noreferrer">
                                                            {result?.pagespeed_insight_metrics?.join(', ')}
                                                        </a> </span>
                                                    </div> */}



                                                </div>

                                            </div>
                                        </div>
                                    </Accordion>

                                </Card>
                            ))}

                            {object?.PluginConflicts && object?.PluginConflicts.length > 0 && (
                                <Card
                                    className="overflow-hidden w-full flex justify-center flex-col items-center p-0 rounded-3xl"
                                >
                                    <div className="min-h-[56px] relative flex justify-between w-full py-2 px-4">
                                        <div className="flex gap-3 font-normal items-center text-base">
                                            <div className="flex flex-col justify-around">
                                                <div className="flex gap-3.5 items-center text-zinc-800 dark:text-zinc-200">
                                                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-200/50">
                                                        <InformationCircleIcon className="w-5 h-5" />
                                                    </div>
                                                    Potential Plugin Conflicts
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t w-full">
                                        <div className="p-4">
                                            <div className="space-y-2">
                                                {object?.PluginConflicts.map((conflict: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-brand-100/30 dark:bg-brand-800"
                                                    >
                                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                                            {conflict.plugin}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}; 