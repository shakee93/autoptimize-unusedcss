import React from 'react';
import { Message } from '../../store/slices/chatSlice';
import MessageItem from './MessageItem';
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <ScrollArea className="h-[400px] pr-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </ScrollArea>
  );
};

export default MessageList;