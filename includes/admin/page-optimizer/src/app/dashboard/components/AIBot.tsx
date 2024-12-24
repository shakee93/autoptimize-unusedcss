import React, { useState, useEffect } from 'react';
import Card from "components/ui/card";
import {ArrowRightIcon, CheckBadgeIcon, InboxIcon, InformationCircleIcon} from "@heroicons/react/24/outline";
import {AIBotIcon, BotIcon} from "app/dashboard/components/icons/icon-svg";
import {ArrowUpCircleIcon} from "@heroicons/react/24/solid";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "components/ui/dialog";
import { MessagesSquare } from "lucide-react";

const AIBot = () => {
    const [open, setOpen] = useState(false);
    const [conversations, setConversations] = useState(() => {
        const saved = localStorage.getItem('chat-conversations');
        return saved ? JSON.parse(saved) : [];
    });

    const handleConversationSelect = (conv: any) => {
        // Add conversation ID to URL hash
        window.location.hash = `#/hermes-ai?conv=${conv.id}`;
        setOpen(false);
    };

    const questions = [
        'CSS Delivery?',
        'JS Delivery?',
        'Image Delivery?',
        'CDN Delivery?',
    ];

    return(
        <div className='w-full flex flex-col gap-4'>
            <Card data-tour='AIBot' className="border flex flex-col gap-4">
                <div className="flex flex-col items-center p-6 gap-2 relative">
                    <button
                        onClick={() => setOpen(true)}
                        className="flex gap-1 m-6 my-0 right-0 absolute cursor-pointer border text-brand-950 py-1.5 px-2 rounded-lg text-xs font-medium hover:bg-gray-100">
                        <InboxIcon className="h-4 w-4 text-brand-950"/>
                    </button>
                    
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="sm:max-w-[425px] p-6">
                            <DialogHeader>
                                <DialogTitle>Chat History</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {conversations.length === 0 ? (
                                    <div className="text-center text-gray-500 py-4">
                                        No chat history yet
                                    </div>
                                ) : (
                                    conversations.map((conv: any) => (
                                        <div
                                            key={conv.id}
                                            onClick={() => handleConversationSelect(conv)}
                                            className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-100 cursor-pointer"
                                        >
                                            <MessagesSquare className="h-4 w-4 text-brand-950" />
                                            <span className="text-sm truncate">{conv.title}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                    
                    <AIBotIcon/>
                    <div className="dark:text-brand-300 text-center flex flex-col gap-2">
                        <h2 className="text-base font-semibold">Hi, I am Speed Coach. <br/> Your AI Companion</h2>
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