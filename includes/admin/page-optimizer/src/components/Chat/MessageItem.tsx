import React from 'react';
import { Message } from '../../store/slices/chatSlice';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "../../lib/utils";

interface MessageItemProps {
    message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const isUser = message.sender === 'user';

    return (
        <div className={cn("flex items-end mb-4", isUser ? "justify-end" : "justify-start")}>
            {!isUser && (
                <Avatar className="mr-2">
                    <AvatarImage src="/ai-avatar.png" alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                </Avatar>
            )}
            <div className={cn(
                "max-w-md px-4 py-2 rounded-lg",
                isUser ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
                {message.text}
            </div>
            {isUser && (
                <Avatar className="ml-2">
                    <AvatarImage src="/user-avatar.png" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            )}
        </div>
    );
};

export default MessageItem;