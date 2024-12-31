"use client";
import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { MessagesSquare } from "lucide-react";
import { ArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { HermesAIBotIcon, NoteBookIcon, StarLockIcon, WorldIcon } from "app/ai-bot/icons/icon-svg";
import { useSelector } from "react-redux";
import { optimizerData } from "../../../store/app/appSelector";
import ChatHistoryPanel from './ChatHistoryPanel';
import { useChatHistory } from "../hooks/useChatHistory";
import { formatSystemMessage } from "../utils/messageFormatter";
import { WelcomeScreen } from "./WelcomeScreen";
import { useAppContext } from "../../../context/app";
import { isDev } from "lib/utils";

interface ChatProps {
  apiEndpoint?: string;
}

export default function Chat({ apiEndpoint = "https://ai.rapidload.io/api/support" }: ChatProps) {

  const { options} = useAppContext()
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: apiEndpoint,
    headers: {
      'Authorization': `Bearer ${ isDev ? 'f86e8df144f1469eacca8becd12a6e7f' : options.license_key!}`
    },
  });

  const { 
    data, 
    settings, 
    activeReport,
    activeGear,
    testMode,
    license 
  } = useSelector(optimizerData);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    handleNewChat,
    handleSelectConversation,
    handleDeleteConversation,
  } = useChatHistory(messages, setMessages);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize system message
  useEffect(() => {
    const systemMessage = formatSystemMessage({
      data,
      settings,
      license,
      activeReport,
      activeGear: activeGear as string,
      testMode: testMode as boolean,
    });

    setMessages([
      {
        id: "1",
        role: "system",
        content: systemMessage,
        createdAt: new Date(),
      },
    ]);
  }, [data, settings, license, activeReport, activeGear, testMode, setMessages]);

  // Handle URL parameters for conversation selection
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const conversationId = params.get('conv');
    
    if (conversationId) {
      const conversation = conversations.find(conv => conv.id === conversationId);
      if (conversation) {
        handleSelectConversation(conversationId);
      }
    }
  }, []);

  return (
    <div className="chat-container flex container mx-auto h-[calc(100vh-4rem)] max-h-[750px] py-4 bg-white my-8 rounded-2xl">
      <ChatHistoryPanel 
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className="flex-1 flex flex-col">
        <div className="px-4 pb-2 flex justify-end">
          <button
            onClick={() => (window.location.hash = '#/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 bg-white">
          {messages.length === 1 ? (
            <WelcomeScreen />
          ) : (
            <ChatMessages messages={messages} />
          )}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput 
          input={input} 
          handleInputChange={handleInputChange} 
          handleSubmit={handleSubmit} 
        />
      </div>
    </div>
  );
}

// Extracted Components
const ChatMessages = ({ messages }: { messages: any[] }) => (
  <>
    {messages
      .filter((msg) => msg.role !== "system")
      .map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
  </>
);

const ChatMessage = ({ message }: { message: any }) => (
  <div className={`message my-2 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
    {message.role === "assistant" && (
      <div className="w-8 h-8 rounded-full bg-violet-900 flex items-center justify-center mr-2">
        <MessagesSquare size={16} className="text-white" />
      </div>
    )}
    <div
      className={`max-w-lg px-4 py-2 rounded-lg shadow ${
        message.role === "user"
          ? "bg-violet-900 text-white"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {message.content.length > 0 ? (
        <Markdown>{message.content}</Markdown>
      ) : (
        <span className="italic font-light">
          {"calling tool: " + message?.toolInvocations?.[0]?.toolName}
        </span>
      )}
      <MessageTimestamp createdAt={message.createdAt} />
    </div>
  </div>
);

const MessageTimestamp = ({ createdAt }: { createdAt: any }) => (
  <div className="text-xs text-right mt-1 opacity-75">
    {new Date(createdAt || Date.now()).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </div>
);

const ChatInput = ({ input, handleInputChange, handleSubmit }: { input: any, handleInputChange: any, handleSubmit: any }) => (
  <form
    onSubmit={handleSubmit}
    className="input-container flex items-center px-2 py-1 border-t border-gray-200 bg-brand-100 mx-6 rounded-xl"
  >
    <input
      className="flex-1 p-2 bg-brand-100 rounded-lg focus:outline-none focus:border-transparent"
      value={input}
      placeholder="Reply to Hermes AI..."
      onChange={handleInputChange}
    />
    <button
      type="submit"
      disabled={input.trim() === ""}
      className="ml-2 bg-brand-950 text-white p-2 rounded-lg hover:bg-brand-950 disabled:opacity-50 transition-colors"
    >
      <ArrowUpIcon className="h-4 w-4 text-brand-0" />
    </button>
  </form>
);
