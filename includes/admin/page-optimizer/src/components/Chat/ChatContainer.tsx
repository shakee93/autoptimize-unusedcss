import React from 'react';
import { useSelector } from 'react-redux';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { RootState } from 'src/store/app/appTypes';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card-default";

const ChatContainer: React.FC = () => {
    const messages = useSelector((state: RootState) => state.chat.messages);

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle>Chat with Rapidload AI</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                <MessageList messages={messages} />
            </CardContent>
            <CardFooter>
                <MessageInput />
            </CardFooter>
        </Card>
    );
};

export default ChatContainer;