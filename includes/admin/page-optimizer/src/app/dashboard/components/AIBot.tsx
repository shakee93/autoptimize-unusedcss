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
                    {/*<div className="relative w-28 h-14 flex items-center justify-center mt-12">*/}
                    {/*    <div*/}
                    {/*        className="absolute w-40 h-40 border-2 border-purple-500 rounded-full wave-animation"*/}
                    {/*        style={{animationDelay: '0s'}}*/}
                    {/*    ></div>*/}
                    {/*    <div*/}
                    {/*        className="absolute w-40 h-40 border-2 border-purple-500 rounded-full wave-animation"*/}
                    {/*        style={{animationDelay: '1s'}}*/}
                    {/*    ></div>*/}
                    {/*    <div*/}
                    {/*        className="absolute w-40 h-40 border-2 border-purple-500 rounded-full wave-animation"*/}
                    {/*        style={{animationDelay: '2s'}}*/}
                    {/*    ></div>*/}
                    {/*    <div*/}
                    {/*        className="absolute w-40 h-40 border-2 border-purple-500 rounded-full wave-animation"*/}
                    {/*        style={{animationDelay: '3s'}}*/}
                    {/*    ></div>*/}
                    {/*    /!* Icon *!/*/}
                    {/*    <div*/}
                    {/*        className="absolute w-24 h-24 flex items-center justify-center">*/}
                    {/*        <BotIcon className="w-24"/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <AIBotIcon/>
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
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Ask about anything..."
                                        className="w-full p-2 border border-brand-300 rounded-full focus:outline-none focus:border-black bg-brand-100 pr-10 pl-4"
                                    />
                                    <ArrowUpCircleIcon
                                        className="cursor-pointer h-10 w-10 text-brand-950 absolute right-0 top-1/2 transform -translate-y-1/2 "/>
                                </div>
                            </DialogTrigger>
                            <DialogTitle/>
                            <DialogContent className="sm:max-w-[650px] sm:rounded-3xl gap-0">
                                <DialogHeader className='p-6'>
                                    <DialogTitle>AI Speed Coach</DialogTitle>
                                    <DialogDescription>
                                        AI Speed Coach answers your questions with information and insights from our wide-ranging collection of articles.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="relative before:absolute before:left-0 before:right-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-white before:via-brand-200 before:to-white">
                                    <AISpeedCoach/>
                                </div>
                                <DialogFooter className="p-6">
                                    <AppButton onClick={() => setOpen(false)} variant='outline' className='text-sm'>
                                        Close
                                    </AppButton>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>



                    </div>
                </div>
            </Card>
        </div>
    );
}

export default AIBot;