import React, { useState } from 'react';
import Card from "components/ui/card";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";

// Define a type for the messages
type Message = {
    sender: 'user' | 'ai';
    text: string;
};

const AISpeedCoach = () => {
    // Define the state with an array of Message type
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim() === '') return;

        // Add user message to the chat
        setMessages([...messages, { sender: 'user', text: input }]);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: 'ai', text: 'This is a simulated AI response.' }
            ]);
        }, 1000);
    };
    const handleNewChat = () => {
        // Only clear messages if there are existing messages
        // console.log(messages.length)
        // console.log("hellow this is me")
        if (messages.length > 0) {
            setMessages([]);
        }
    };

    return (
        <div className='w-full flex flex-col gap-4'>
            <Card data-tour='AISpeedCoach' className="flex flex-col gap-4 p-6">
                <div className="flex flex-col gap-4">
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs p-3 rounded-lg ${
                                        message.sender === 'user' ? '' : ''
                                    }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Ask about anything..."
                            className="w-full p-2 border border-brand-300 rounded-full focus:outline-none focus:border-black bg-brand-100 pr-10 pl-4"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <ArrowUpCircleIcon
                            className="cursor-pointer h-10 w-10 text-brand-950 absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={handleSend}
                        />
                    </div>
                    <button
                        className={`mt-4 p-2 ${
                            messages.length > 0 
                            ? 'bg-red-500 text-white' 
                            : 'bg-gray-300 cursor-not-allowed'
                        } rounded-lg`}
                        onClick={handleNewChat}
                        disabled={messages.length === 0}
                    >
                        New Chat
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default AISpeedCoach;
