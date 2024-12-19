import React, { useState, useEffect } from 'react';
import Card from "components/ui/card";
import {ArrowRightIcon, CheckBadgeIcon, InboxIcon, InformationCircleIcon} from "@heroicons/react/24/outline";
import {AIBotIcon, BotIcon} from "app/dashboard/components/icons/icon-svg";
import {ArrowUpCircleIcon} from "@heroicons/react/24/solid";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "components/ui/dialog";
import ComparisonTable from "components/ui/compare-table";
import AppButton from "components/ui/app-button";
import AISpeedCoach from "app/dashboard/components/AISpeedCoach";
import HermisAIBot from "app/ai-bot";

const AIBot = () => {
    const [open, setOpen] = useState(false);

    const questions = [
        'What causes lightning?',
        'What causes lightning?',
        'Why do cats purr?',
        'Why do cats purr?',
    ];

    return(
        <div className='w-full flex flex-col gap-4'>
            <Card data-tour='AIBot' className="border flex flex-col gap-4">
                <div
                    className="flex flex-col items-center p-6 gap-2 relative">
                    <button
                        className="flex gap-1 m-6 my-0 right-0 absolute cursor-pointer border text-brand-950 py-1.5 px-2 rounded-lg text-xs font-medium">
                        <InboxIcon className="h-4 w-4 text-brand-950 "/>
                    </button>
                    
                    <AIBotIcon/>
                    <div className="dark:text-brand-300 text-center flex flex-col gap-2">
                        <h2 className="text-base font-semibold">Hi, I am Speed Coach. <br/> Your AI Companion</h2>
                        {/* <span className="text-brand-400 font-normal text-xs leading-4">AI  Speed Coach answers your questions with information and insights from our wide-ranging collection of articles. For generations, knowledge-seekers have turned to Speed Coach for answers they can trust. AI  Speed Coach offers a new way to engage with  Speed Coach -created content.</span> */}
                    </div>
                </div>
                <div className="w-full max-w-md mx-auto p-6 pt-0">
                    <h2 className="text-sm font-semibold mb-2">Suggested Questions</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {questions.map((question, index) => (
                            <button
                                key={index}
                                className="text-left bg-brand-100/30 border items-center rounded-3xl hover:bg-brand-200 text-xs flex justify-between p-2 font-medium"
                            >
                                {question}
                                <ArrowRightIcon className="h-4 w-4 text-brand-950 "/>
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                                    <input
                                        type="text"
                                        onClick={() => (window.location.hash = '#/hermes-ai')}
                                        placeholder="Ask about anything..."
                                        className="w-full p-2 border border-brand-300 rounded-full focus:outline-none focus:border-black bg-brand-100 pr-10 pl-4"
                                    />
                                    <ArrowUpCircleIcon
                                        className="cursor-pointer h-10 w-10 text-brand-950 absolute right-0 top-1/2 transform -translate-y-1/2 "/>
                                </div>

                    
                </div>
            </Card>
        </div>
    );
}

export default AIBot;