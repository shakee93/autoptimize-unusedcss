import React, { useState, useEffect } from 'react';
import Card from "components/ui/card";
import {ArrowRightIcon, CheckBadgeIcon, InboxIcon, InformationCircleIcon} from "@heroicons/react/24/outline";
import {BotIcon} from "app/dashboard/components/icons/icon-svg";
import {ArrowUpCircleIcon} from "@heroicons/react/24/solid";

const AIBot = () => {
    const questions = [
        'What causes lightning?',
        'What causes lightning?',
        'Why do cats purr?',
        'Why do cats purr?',
    ];

    return(
        <div className='w-full flex flex-col gap-4'>
            <Card data-tour='AIBot' className="border flex flex-col gap-4">
                <div className='flex gap-2 items-center p-6 pb-0 justify-between'>
                    <div className="text-base font-semibold dark:text-brand-300">AI Speed Coach V 0.1</div>
                    <button
                        className="flex gap-1 cursor-pointer border text-brand-950 py-1.5 px-4 rounded-lg text-xs font-medium">
                        open history
                        <InboxIcon className="h-4 w-4 text-brand-950 "/>
                    </button>
                </div>
                <div
                    className="flex flex-col items-center p-6 pb-0 gap-2 relative before:absolute before:left-0 before:right-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-white before:via-brand-200 before:to-white">
                    <div className="relative w-24 h-10 flex items-center justify-center mt-6">
                        <div
                            className="absolute w-24 h-24 border-2 border-purple-500 rounded-full wave-animation"
                            style={{animationDelay: '0s'}}
                        ></div>
                        <div
                            className="absolute w-24 h-24 border-2 border-purple-500 rounded-full wave-animation"
                            style={{animationDelay: '0.5s'}}
                        ></div>
                        <div
                            className="absolute w-24 h-24 border-2 border-purple-500 rounded-full wave-animation"
                            style={{animationDelay: '1s'}}
                        ></div>
                        <div
                            className="absolute w-24 h-24 border-2 border-purple-500 rounded-full wave-animation"
                            style={{animationDelay: '1.5s'}}
                        ></div>
                        {/* Icon */}
                        <div
                            className="absolute w-10 h-10 flex items-center justify-center">
                            <BotIcon className="w-10"/>
                        </div>
                    </div>
                    <div className="dark:text-brand-300 text-center flex flex-col gap-2">
                        <h2 className="text-base font-semibold">Hi, I am Speed Coach. <br/> Your AI Companion</h2>
                        <span className="text-brand-400 font-normal text-xs leading-4">AI  Speed Coach answers your questions with information and insights from our wide-ranging collection of articles. For generations, knowledge-seekers have turned to Speed Coach for answers they can trust. AI  Speed Coach offers a new way to engage with  Speed Coach -created content.</span>
                    </div>
                </div>
                <div className="w-full max-w-md mx-auto p-6">
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
                            placeholder="Ask about anything..."
                            className="w-full p-2 border border-brand-300 rounded-full focus:outline-none focus:border-black bg-brand-100 pr-10 pl-4"
                        />
                        <ArrowUpCircleIcon className="cursor-pointer h-10 w-10 text-brand-950 absolute right-0 top-1/2 transform -translate-y-1/2 "/>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default AIBot;