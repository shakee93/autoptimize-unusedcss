"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { Send, MessageSquare, MessagesSquare, CpuIcon } from "lucide-react";
import {ArrowUpIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {HermesAIBotIcon, NoteBookIcon, StarLockIcon, WorldIcon} from "app/ai-bot/icons/icon-svg";
import { useSelector } from "react-redux";
import { optimizerData } from "../../../store/app/appSelector";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      api: "https://rapidload-ai-faq-manager.vercel.app/api/support",
      body: {
        apiKey: import.meta.env.VITE_API_APIKEY as string,
      },
    });
    console.log("API Key:", import.meta.env);

  const { 
    data, 
    settings, 
    activeReport,
    activeGear,
    testMode,
    license 
  } = useSelector(optimizerData);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Format settings into markdown string
    const formatSettings = () => {
      let settingsStr = '';
      settings?.forEach((setting: AuditSetting) => {
        settingsStr += `\n- **${setting.name}**:\n`;
        setting.inputs.forEach((input) => {
          settingsStr += `    - ${input.control_label}: ${input.value ? 'Enabled' : 'Disabled'}\n`;
          if (input.inputs) {
            input.inputs.forEach((subInput) => {
              settingsStr += `    - ${subInput.control_label}: "${subInput.value}"\n`;
            });
          }
        });
      });
      return settingsStr;
    };

    // Format audits into markdown string
    const formatAudits = () => {
      const opportunities = data?.grouped?.opportunities || [];
      const diagnostics = data?.grouped?.diagnostics || [];
      const passedAudits = data?.grouped?.passed_audits || [];

      return `
      - **Opportunities**:
        ${opportunities.map((audit: Audit) => `- **${audit.name}**: ${audit.displayValue}`).join('\n        ')}
      - **Diagnostics**:
        ${diagnostics.map((audit: Audit) => `- **${audit.name}**: ${audit.displayValue}`).join('\n        ')}
      - **Passed Audits**: Total of ${passedAudits.length}
      `;
    };

    const systemMessage = `
      **User Details:**   
      - **Name**: ${license?.name || 'Unknown'}
      - **Website URL**: [${license?.siteUrl || 'Unknown'}](${license?.siteUrl || '#'})

      **Google Page Speed Report Summary:**
      - **FCP**: ${data?.metrics?.find(m => m.id === 'first-contentful-paint')?.displayValue || 'N/A'}
      - **SI**: ${data?.metrics?.find(m => m.id === 'speed-index')?.displayValue || 'N/A'}
      - **TBT**: ${data?.metrics?.find(m => m.id === 'total-blocking-time')?.displayValue || 'N/A'}
      - **LCP**: ${data?.metrics?.find(m => m.id === 'largest-contentful-paint')?.displayValue || 'N/A'}
      - **CLS**: ${data?.metrics?.find(m => m.id === 'cumulative-layout-shift')?.displayValue || 'N/A'}
      - **Performance Score**: ${data?.performance || 'N/A'}

      **Current Page Speed Audits:**
      ${formatAudits()}

      **${license?.name || 'User'}'s Current RapidLoad Settings:**
      Optimizing Device: ${activeReport || 'desktop'}
      Performance Score: ${data?.performance || 'N/A'}
      Test Mode: ${testMode ? 'Enabled' : 'Disabled'}
      Performance Gear: ${activeGear || 'custom'}

      **Speed Settings:**
      ${formatSettings()}
    `;

    setMessages([
      {
        id: "1",
        role: "system",
        content: systemMessage,
        createdAt: new Date(),
      },
    ]);
    
  }, [data, settings, license, activeReport, activeGear, testMode]);

  useEffect(() => {
    if (messagesEndRef.current) {
      (messagesEndRef.current as HTMLElement).scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-container flex flex-col w-full max-w-4xl mx-auto h-[calc(100vh-4rem)] max-h-[750px] py-4 bg-white my-8  rounded-2xl">
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
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            {/* <MessageSquare size={48} className="mb-2" />
            <p>No messages yet. Start a conversation!</p> */}

  <div className="flex flex-col items-center justify-center p-6 bg-white text-gray-800">
      {/* Icon */}
      <div className="flex items-center justify-center mb-4">
        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-xl">
         <HermesAIBotIcon className="w-8 h-8" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl text-gray-900 mb-3 font-normal">
      <span className="font-bold ">Hermes AI</span> by RapidLoad
      </h2>

      {/* Description */}
      <p className="text-base	font-normal select-none text-center text-gray-500 max-w-xl mb-6 leading-relaxed">
        A highly intelligent and responsive chatbot built to deliver real-time
        support, detailed troubleshooting, and personalized optimization tips.
        It ensures that websites achieve maximum performance and speed, helping
        users maintain smooth operations with minimal hassle.
      </p>

      {/* Features List */}
      <ul className="space-y-2 mb-6 text-gray-700">
        <li className="flex items-center gap-2">
          <WorldIcon className="w-6 h-5 text-purple-500"/> Natural Language conversations
        </li>
        <li className="flex items-center gap-2  ">
          <NoteBookIcon className="w-6 h-6 text-purple-500  "/> Knowledge Base
        </li>
        <li className="flex items-center gap-2  ">
          <StarLockIcon className="w-6 h-6 text-purple-500  "/> Personalized Recommendation
        </li>
        <li className="flex items-center gap-2  ">
          <CpuIcon className="w-6 h-6 text-purple-500  "/> Seamless Integration
        </li>
      </ul>

      {/* Delivery Tags */} 
      <div className="flex flex-wrap justify-center gap-2">
        {["CSS Delivery", "JS Delivery", "Image Delivery", "Font Delivery", "Page Cache", "CDN"].map(
          (item, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-700 cursor-pointer"
            >
              {item}
            </span>
          )
        )}
      </div>
    </div>

          </div>
        ) : (
          messages
            .filter((msg) => msg.role !== "system")
            .map((m) => (
              <div key={m.id}>
                <div
                  className={`message my-2 flex ${m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-violet-900 flex items-center justify-center mr-2">
                      <MessagesSquare size={16} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-lg px-4 py-2 rounded-lg shadow ${m.role === "user"
                      ? "bg-violet-900 text-white"
                      : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {m.content.length > 0 ? (
                      <Markdown>{m.content}</Markdown>
                    ) : (
                      <span className="italic font-light">
                        {"calling tool: " + m?.toolInvocations?.[0]?.toolName}
                      </span>
                    )}
                    <div className="text-xs text-right mt-1 opacity-75">
                      {new Date(m.createdAt || Date.now()).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="input-container flex items-center px-4 py-2 border-t border-gray-200"
      >
        <input
          className="flex-1 p-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={input}
          placeholder="Reply to Hermes AI..."
          onChange={handleInputChange}
        />
        <button
          type="submit"
          disabled={input.trim() === ""}
          className="ml-2 bg-brand-950 text-white p-2 rounded-lg hover:bg-brand-950 disabled:opacity-50 transition-colors"
        >
          <ArrowUpIcon className="h-6 w-6 text-brand-0" />
        </button>
      </form>
    </div>
  );
}
