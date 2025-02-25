"use client";
import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { Loader2, MessagesSquare, PanelLeftClose, PanelRightClose } from "lucide-react";
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
import { AnimatedLogo } from "components/animated-logo";

interface ChatProps {
  apiEndpoint?: string;
}
const aiRoot = window.rapidload_optimizer.ai_root || "https://ai.rapidload.io/api";

export default function Chat({ apiEndpoint = `${aiRoot}/support` }: ChatProps) {

  const { options } = useAppContext();
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading } = useChat({
    api: apiEndpoint,
    headers: {
      'Authorization': `Bearer ${isDev ? import.meta.env.VITE_KEY : options.license_key!}`
    },
    body: {
      'url': options?.optimizer_url || ''
    },

    onError: (error) => {
      console.error(error);
      const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    // Use a fallback ID if no user message exists
    const errorId = lastUserMessage?.id || 'system';
    setError(`${errorId}:${error?.message}`);
    },
    onFinish: (message, options) => {
     // console.log(message, options);
    }
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
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

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
    else {
      // handleNewChat(true);
      // // Initialize system message first
      // const systemMessage = formatSystemMessage({
      //   data,
      //   settings,
      //   license,
      //   activeReport,
      //   activeGear: activeGear as string,
      //   testMode: testMode as boolean,
      // });

      // setMessages([
      //   {
      //     id: "1",
      //     role: "system",
      //     content: systemMessage,
      //     createdAt: new Date(),
      //   },
      // ]);



    }
  }, []);

  // Add this new function
  const handleClose = () => {
    // Remove empty conversations before closing
    conversations.forEach(conv => {
      if (conv.messages.length <= 1) { // Only has system message or is empty
        handleDeleteConversation(conv.id);
      }
    });
    window.location.hash = '#/';
  };

   // Add this new function to handle form submission
   const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
   // Prevent multiple submissions while processing
  if (isLoading) return;
    
    // If there are no messages except system message, create a new chat
    if (messages.length <= 1) {
      await handleNewChat(true);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    handleSubmit(e);
  };

  return (
    <div className="chat-container relative flex container mx-auto dark:bg-brand-950 h-[calc(100vh-4rem)] max-h-[750px] py-4 bg-white my-4 rounded-2xl overflow-hidden">
      <div className={`
        w-42 transform transition-all duration-300 ease-in-out
        ${showHistory 
          ? 'translate-x-0 opacity-100 visible' 
          : '-translate-x-full opacity-0 invisible absolute'
        }
      `}>
        <ChatHistoryPanel
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          onNewChat={() => handleNewChat(false)}
          onDeleteConversation={handleDeleteConversation}
        />
      </div>

      <div className={`flex-1 flex flex-col `}>
        <div className="px-4 pb-2 flex justify-between">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 mt-4 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle history"
          >
           {showHistory ? <PanelLeftClose className="h-6 w-6 text-gray-500" /> : <PanelRightClose className="h-6 w-6 text-gray-500" />} 
          </button>
          
          <button
            onClick={handleClose}
            className="p-2 mt-4 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 bg-white dark:bg-brand-950">
          {messages.length === 1 ? (
            <WelcomeScreen />
          ) : (
            <ChatMessages messages={messages} loading={isLoading} error={error} />
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          // onSubmit={handleSubmit}
          onSubmit={handleFormSubmit}
          className="input-container flex items-center px-2 py-1 border-t border-gray-200 bg-brand-100 mx-6 rounded-xl dark:bg-brand-800/40 dark:text-brand-300 dark:border-brand-700"
        >
          <input
            className="flex-1 p-2 bg-brand-100 rounded-lg focus:outline-none focus:border-transparent dark:bg-brand-800/10 dark:text-brand-300 dark:border-brand-700"
            value={input}
            placeholder="Ask Rapidload AI..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            disabled={input.trim() === ""}
            className="ml-2 bg-brand-950 text-white p-2 rounded-lg hover:bg-brand-950 disabled:opacity-50 transition-colors dark:bg-brand-500 dark:hover:bg-brand-400 dark:text-brand-950 dark:hover:text-brand-950 hover:cursor-pointer"
          >
            <ArrowUpIcon className="h-4 w-4 text-brand-0 dark:text-brand-950" />
          </button>
        </form>

      </div>
    </div>
  );
}

// Extracted Components
// const ChatMessages = ({ messages }: { messages: any[] }) => (
//   <>
//     {messages
//       .filter((msg) => msg.role !== "system")
//       .map((message) => (
//         <ChatMessage key={message.id} message={message} />
//       ))}
//   </>
// );



// const ChatMessages = ({ messages, loading, error }: { messages: any[], loading: boolean, error: string | null }) => (
//   <>

//     {Array.isArray(messages) && messages
//       .filter((msg) => msg && typeof msg === 'object' && msg?.role !== "system")
//       .map((message, index) => message && (
//         <div key={message.id || Math.random().toString()}>
          
//           <ChatMessage
//             message={message}
//             loading={loading}
//             error={error}
//           />
//           {index === messages.length - 2 && loading && (
//             <div className="flex justify-start my-2">
//               <div className="flex mt-2 mr-2">
//                 <AnimatedLogo className="!opacity-100" size="sm" isPlaying={true} />
//               </div>
//               <div className="max-w-lg px-4 py-2 rounded-lg text-brand-950">
//                 <span className="italic font-light">Thinking...</span>
//               </div>
//             </div>
//           )}
           
//         </div>
//       ))}
//   </>
// );


// working with erro chat
// const ChatMessages = ({ messages, loading, error }: { messages: any[], loading: boolean, error: string | null }) => {
//   const filteredMessages = messages.filter((msg) => msg && typeof msg === 'object' && msg?.role !== "system");
  
//   // Parse error to get message ID and error text
//   const [errorMessageId, errorText] = error ? error.split(':') : [null, null];
  
//   return (
//     <>
//       {Array.isArray(messages) && filteredMessages.map((message, index) => message && (
//         <div key={message.id || Math.random().toString()}>
//           <ChatMessage
//             message={message}
//             loading={loading}
//             // Only pass error if this message ID matches the error message ID
//             error={message.id === errorMessageId ? errorText : null}
//           />
//           {index === filteredMessages.length - 2 && loading && (
//             <div className="flex justify-start my-2">
//               <div className="flex mt-2 mr-2">
//                 <AnimatedLogo className="!opacity-100" size="sm" isPlaying={true} />
//               </div>
//               <div className="max-w-lg px-4 py-2 rounded-lg text-brand-950">
//                 <span className="italic font-light">Thinking...</span>
//               </div>
//             </div>
//           )}
//         </div>
//       ))}
//     </>
//   );
// };

const ChatMessages = ({ messages, loading, error }: { messages: any[], loading: boolean, error: string | null }) => {
  const filteredMessages = messages.filter((msg) => msg && typeof msg === 'object' && msg?.role !== "system");
  const [errorMessageId, errorText] = error ? error.split(':') : [null, null];
  console.log(errorMessageId, errorText);
  
  return (
    <>
      {Array.isArray(messages) && filteredMessages.map((message, index) => {
        const isErrorMessage = message.id === errorMessageId || (errorMessageId === 'system' && index === 0);
        const nextMessage = filteredMessages[index + 1];
       

        return (
          <div key={message.id || Math.random().toString()}>
            <ChatMessage message={message} loading={loading} />
   
            {/* Show loading state */}
            {index === filteredMessages.length - 1 && loading && message.role === 'user' &&  (
              <div className="flex justify-start my-2">
                <div className="flex mt-2 mr-2">
                  <AnimatedLogo className="!opacity-100" size="sm" isPlaying={true} />
                </div>
                <div className="max-w-lg px-4 py-2 rounded-lg text-brand-950 dark:text-brand-300">
                  <span className="italic font-light">Thinking...</span>
                </div>
              </div>
            )}

            {/* Show error after the user message that triggered it */}
            {isErrorMessage && error && !loading && (
              <div className="flex justify-start my-2 gap-4">
                <div className="flex mt-2 mr-2">
                  <AnimatedLogo className="!opacity-100" size="sm" isPlaying={false} />
                </div>
                <div className="max-w-lg px-4 py-2 rounded-lg bg-red-50 border border-red-100 dark:bg-red-950 dark:border-red-800">
                  <span className="text-red-500 dark:text-red-400">{errorText}</span>
                </div>
              </div>
            )}


          </div>
        );
      })}
    </>
  );
};

const ChatMessage = ({ message, loading }: { message: any, loading: boolean }) => {
  if (!message) return null;

  return (
    <div className={`message my-2 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      {message.role === "assistant" && (
        <div className="flex mt-2 mr-2">
          <AnimatedLogo className="!opacity-100" size="sm" isPlaying={false} />
        </div>
        
      )}
      <div
        className={`max-w-lg px-4 py-2 rounded-lg ${message.role === "user"
          ? "bg-gray-100 text-brand-950 dark:bg-brand-800/40 dark:text-brand-300"
          : "text-brand-950 dark:text-brand-300"
          }`}
      >
        {message.content && message.content.length > 0 ? (
          <div className="prose prose-sm 
            prose-p:m-0 prose-p:p-0 prose-p:text-sm 
            prose-p:text-brand-950 dark:prose-p:text-brand-300
            prose-strong:text-brand-950 dark:prose-strong:text-brand-300
            prose-li:text-brand-950 dark:prose-li:text-brand-300
            prose-a:text-brand-950 dark:prose-a:text-brand-300
            prose-ul:text-brand-950 dark:prose-ul:text-brand-300
            prose-ol:text-brand-950 dark:prose-ol:text-brand-300
            prose-blockquote:text-brand-950 dark:prose-blockquote:text-brand-300
            prose-code:text-brand-950 dark:prose-code:text-brand-300
            prose-pre:text-brand-950 dark:prose-pre:text-brand-300
            prose-h1:text-brand-950 dark:prose-h1:text-brand-300
            prose-h2:text-brand-950 dark:prose-h2:text-brand-300
            prose-h3:text-brand-950 dark:prose-h3:text-brand-300
            prose-h4:text-brand-950 dark:prose-h4:text-brand-300">
            <Markdown>{message.content}</Markdown>
          </div>
        ) : (
          <span className="italic font-light">
            {message?.toolInvocations?.[0]?.toolName === 'accessKnowledge' && (
              <div>
                Accessing knowledge base...
              </div>
            )}
          </span>
        )}

        <MessageTimestamp createdAt={message.createdAt} />
      </div>
       {/* Show error message if this is the last message */}
       {/* {error && message.role === "user" && (
        <div className="text-red-500 bg-red-50 p-3 rounded-lg absolute right-0 mt-16 shadow-sm border border-red-100">
          {error}
        </div>
      )} */}
    </div>
  );
};


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
      placeholder="Ask Rapidload AI..."
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
