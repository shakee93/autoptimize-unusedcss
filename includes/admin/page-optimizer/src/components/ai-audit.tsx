import { Sparkles, MicroscopeIcon, LightbulbIcon, FileCodeIcon, Loader2, Brain, ChevronDown, Loader } from "lucide-react";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
import AppButton from "components/ui/app-button";
import { cn } from "lib/utils";
import Card from "@/components/ui/card";
import TooltipText from "./ui/tooltip-text";
import { Fail } from "app/page-optimizer/components/icons/icon-svg";
import FAQSection from "./faq-section";
import Accordion from "components/accordion";
import { useState, useEffect } from "react";
import { experimental_useObject as useObject } from 'ai/react';
import { toast } from "components/ui/use-toast";
import { z } from "zod";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "components/ui/collapsible";

// @ts-ignore
const AIBaseURL = window.rapidload_optimizer?.ai_root || "https://ai.rapidload.io/api";

const SolutionSchema = z.object({
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
});

type SolutionType = z.infer<typeof SolutionSchema>;

interface AiAuditProps {
    issue: {
        issue: string;
        description: string;
        solutions: SolutionType;
        howToFix: Array<{
            step: string;
            description: string;
            type: string;
            sub_type?: string[];
            rapidload_setting_input?: { name: string; };
        }>;
        pagespeed_insight_metrics?: string[];
        how_to_fix_questions?: {
            question: string;
            explanation: string;
            type: 'single_choice' | 'multiple_choice' | 'text' | 'number';
            options: {
                value: string;
                label: string;
                description: string;
            }[];
        }[];
    };
    index: number;
    openItems: string[];
    toggleAccordion: (id: string) => void;
    input: any;
    loading?: boolean;
    isLatestAudit?: number;
}

export const AiAudit = ({ issue, index, openItems, toggleAccordion, input, loading, isLatestAudit }: AiAuditProps) => {
    const [solutionError, setSolutionError] = useState<string | null>(null);
    const [isThinking, setIsThinking] = useState(false);
    const [thinkingTime, setThinkingTime] = useState(0);
    const [showThoughts, setShowThoughts] = useState(index === 0);
    const [thoughtsComplete, setThoughtsComplete] = useState(false);
    const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({});

    const { object: solutionObject, submit, isLoading } = useObject<SolutionType>({
        api: `${AIBaseURL}/solution`,
        schema: SolutionSchema,
        onFinish: () => {
            setIsThinking(false);
            setThoughtsComplete(true);
        }
    });

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isThinking) {
            const startTime = Date.now();
            interval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                setThinkingTime(elapsed);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isThinking]);


    useEffect(() => {
        setThinkingTime(0);
        setIsThinking(true);
    }, []);

    useEffect(() => {
        if (issue?.solutions?.solutions_list?.length > 0) {
            setIsThinking(false);
            setThoughtsComplete(true);
        }
    }, [issue]);

    const toggleSteps = (solutionTitle: string) => {
        setOpenSteps(prev => ({
            ...prev,
            [solutionTitle]: !prev[solutionTitle]
        }));
    };

    return (
        <Card
            spreader={!openItems.includes(index.toString())}
            key={index}
            className={cn(
                'overflow-hidden w-full flex justify-center flex-col items-center p-0 rounded-3xl dark:bg-brand-950',
                openItems.includes(index.toString()) ? 'shadow-lg dark:shadow-brand-800/30' : 'dark:hover:border-brand-700/70 hover:border-brand-400/60'
            )}
        >
            <div className="min-h-[56px] relative flex justify-between w-full py-2 px-4">
                <div className="flex gap-3 font-normal items-center text-base">
                    <div className="flex flex-col justify-around">
                        <div className="flex gap-3.5 items-center text-zinc-800 dark:text-zinc-200">
                            <div
                                className={`inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-200/50`}>
                                {/* {JSON.stringify((isLatestAudit ?? 0) - 1)}{JSON.stringify(index)} */}
                                {(loading && index === (isLatestAudit ?? 0) - 1) ? (
                                  <Loader className="w-4 h-4 animate-spin opacity-50" />
                                
                            ) : (
                                <Fail />
                            )}
                            </div>
                            {issue?.issue}
                            {issue?.pagespeed_insight_metrics?.map((metric: string) => (
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
                <div className="border-t">
                    <div className="">
                        <div className="px-6 py-6 border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
                            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 flex gap-2 items-center">
                                <MicroscopeIcon className="w-5 h-5" />Core Issue
                            </p>
                            <p className="text-sm text-left text-brand-700 dark:text-brand-300">{issue?.description}</p>
                        </div>
                        <div className="border-t px-6 pb-6 pt-4">

                            {/* Solutions section */}
                            <div key={index}>
                                <div className="flex gap-2 mb-4 w-full justify-between">
                                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 flex gap-2 items-center">
                                        <div className="flex items-center relative gap-2 pl-7 justify-center">
                                            <Sparkles className="absolute w-5 h-5 top-2.5 left-0" />
                                            <div className="flex flex-col ">
                                                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                                    Solutions
                                                </span>
                                                {/* Thinking UI */}
                                                {(issue?.solutions?.solutions_reasoning) && (
                                                    <Collapsible open={showThoughts} onOpenChange={setShowThoughts}>
                                                        <CollapsibleTrigger asChild>
                                                            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                                                                <span className="text-xs font-normal text-zinc-600 dark:text-zinc-400">
                                                                    {issue?.solutions?.solutions_list?.length > 0 ? (
                                                                        thinkingTime > 0 ? `Thought for ${thinkingTime}s...` : `Thoughts...`
                                                                    ) : (
                                                                        <>
                                                                            Thinking
                                                                            <span className="inline-flex w-8">
                                                                                <span className="animate-[loading_1.4s_ease-in-out_infinite] mr-0.5">.</span>
                                                                                <span className="animate-[loading_1.4s_ease-in-out_0.2s_infinite] mr-0.5">.</span>
                                                                                <span className="animate-[loading_1.4s_ease-in-out_0.4s_infinite]">.</span>
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </span>
                                                                <ChevronDown className={cn(
                                                                    "w-4 h-4 transition-transform duration-200",
                                                                    showThoughts ? "transform rotate-180" : ""
                                                                )} />
                                                            </div>
                                                        </CollapsibleTrigger>
                                                        <CollapsibleContent>
                                                            {issue?.solutions?.solutions_reasoning && (
                                                                <div className="mb-2 shadow-sm mt-2 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                                                                    {issue?.solutions?.solutions_reasoning.map((item, index) => (
                                                                        <div key={index} className="px-4 last:border-0 border-b py-3 border-brand-200 dark:border-brand-800">
                                                                            <div className="space-y-1">
                                                                                <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200 flex gap-2 items-center">
                                                                                    {item?.thought}
                                                                                    <span className="text-xs font-normal bg-brand-200/50 dark:bg-brand-800 rounded-md px-2 py-1">{item?.block_type}</span>
                                                                                </div>
                                                                                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                                    {item?.reasoning}
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </CollapsibleContent>
                                                    </Collapsible>
                                                )}
                                            </div>
                                        </div>
                                    </p>
                                </div>

                                {/* Solutions List */}
                                {((issue?.solutions && issue?.solutions?.solutions_list))?.map((solution) => {
                                    if (!solution) return null;
                                    const steps = solution.steps || [];

                                    return (
                                        <div key={solution.title} className="border shadow-md border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-4 last:mb-0 bg-brand-100/30 dark:bg-brand-800">
                                            <div className="flex flex-col gap-4">
                                                {/* Solution Header */}
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{solution.title}</span>
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-brand-200/50 dark:bg-brand-700 text-zinc-700 dark:text-zinc-300">
                                                            {solution.type}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-zinc-600 dark:text-zinc-300">{solution.description}</p>
                                                </div>

                                                {/* Steps */}
                                                {steps.length > 0 && (
                                                    <Collapsible open={openSteps[solution.title]} onOpenChange={() => toggleSteps(solution.title)}>
                                                        <CollapsibleTrigger asChild>
                                                            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                                                                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Implementation Steps</p>
                                                                <ChevronDown className={cn(
                                                                    "w-4 h-4 transition-transform duration-200",
                                                                    openSteps[solution.title] ? "transform rotate-180" : ""
                                                                )} />
                                                            </div>
                                                        </CollapsibleTrigger>
                                                        <CollapsibleContent>
                                                            <ul className="list-none space-y-4 mt-3">
                                                                {steps.map((step) => {
                                                                    if (!step) return null;
                                                                    return (
                                                                        <li key={step.step} className={cn(
                                                                            "text-sm text-zinc-600 dark:text-zinc-300",
                                                                            step.step !== steps.length && "border-b border-zinc-200 dark:border-zinc-800 pb-4"
                                                                        )}>
                                                                            <div className="flex items-start gap-3">
                                                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-200/50 dark:bg-brand-700 flex items-center justify-center text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                                                                    {step.step}
                                                                                </div>
                                                                                <div className="flex-1 space-y-1">
                                                                                    <p className="font-medium text-zinc-800 dark:text-zinc-200">{step.action}</p>
                                                                                    <p className="text-zinc-600 dark:text-zinc-300">{step.details}</p>
                                                                                    {step.verification && (
                                                                                        <p className="text-zinc-500 dark:text-zinc-400 text-xs italic mt-1">
                                                                                            Verification: {step.verification}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        </CollapsibleContent>
                                                    </Collapsible>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </div>
                </div>
            </Accordion>
        </Card>
    );
}; 