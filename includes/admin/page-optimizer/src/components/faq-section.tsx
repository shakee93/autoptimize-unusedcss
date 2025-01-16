import React, { useState } from "react";
import { HelpCircleIcon } from "lucide-react";
import { cn } from "lib/utils";
import Accordion from "@/components/accordion";

interface FAQSectionProps {
    questions: Array<{
        question: string;
        explanation: string;
        type: 'single_choice' | 'multiple_choice' | 'text' | 'number';
        options: Array<{
            value: string;
            label: string;
            description: string;
        }>;
    }>;
}

const FAQSection = ({ questions }: FAQSectionProps) => {
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleAccordion = (id: string) => {
        setOpenItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    if (!questions || questions.length === 0) return null;

    return (
        <div className="border-zinc-200 dark:border-zinc-800 my-5">
            <div>
                <div className="flex gap-2 w-full justify-between mb-4">
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 flex gap-2 items-center">
                        <HelpCircleIcon className="w-5 h-5" />Questions to provide a better solution
                    </p>
                </div>
                <div className="space-y-4">
                    {questions?.map((item, index) => (
                        <div
                            key={index}
                            className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden"
                        >
                            <div
                                onClick={() => toggleAccordion(index.toString())}
                                className={cn(
                                    "cursor-pointer p-4 flex justify-between items-center",
                                    "hover:bg-brand-100/50 dark:hover:bg-brand-800/50",
                                    openItems.includes(index.toString()) && "bg-brand-100/30 dark:bg-brand-800"
                                )}
                            >
                                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                    {item?.question}
                                </span>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400 px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800">
                                    {item?.type?.replace('_', ' ')}
                                </span>
                            </div>
                            <Accordion
                                id={index.toString()}
                                isOpen={openItems.includes(index.toString())}
                                className="border-t border-zinc-200 dark:border-zinc-800"
                            >
                                <div className="p-4 bg-brand-100/30 dark:bg-brand-800">
                                    <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4">
                                        {item?.explanation}
                                    </p>
                                    {item?.options && item?.options?.length > 0 && (
                                        <div className="space-y-2">
                                            {item?.options?.map((option, optIndex) => (
                                                <div
                                                    key={optIndex}
                                                    className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                                                >
                                                    <div className="font-medium text-sm text-zinc-800 dark:text-zinc-200">
                                                        {option?.label}
                                                    </div>
                                                    <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                                                        {option?.description}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Accordion>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQSection; 