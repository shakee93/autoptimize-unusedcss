"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { Send, MessageSquare, MessagesSquare } from "lucide-react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      api: "https://rapidload-ai-faq-manager.vercel.app/api/support",
      body: {
        apiKey: import.meta.env.VITE_API_APIKEY as string,
      },
    });
    console.log("API Key:", import.meta.env);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        id: "1",
        role: "system",
        content: `
            **User Details:**   

              - **Name**: Shakeeb
              - **Website URL**: [https://rapidload.io/](https://rapidload.io/)

              **Google Page Speed Report Summary:**

              - **FCP**: 0.4 s
              - **SI**: 0.8 s
              - **TBT**: 10 ms
              - **LCP**: 1.0 s
              - **CLS**: 0.005
              - **Performance Score**: 98

              **Current Page Speed Audits:**

              - **Opportunities**:
                - **Reduce unused CSS**: Potential savings of 20 KiB
              - **Diagnostics**:
                - **Avoid an excessive DOM size**: 2,156 elements
              - **Passed Audits**: Total of 34

              **Shakeeb's Current RapidLoad Settings:**

              Optimizing Device: desktop
              Performance Score: turboMax
              Test Mode: Enabled

              **Speed Settings:**

              - **Critical CSS**:
                  - Enable Critical CSS: Enabled
                  - Mobile Critical CSS: Disabled
                  - Remove Critical CSS on User Interaction: Disabled
                  - Enable CSS File Chunck: Disabled
              - **Defer Javascript**:
                  - Defer Javascript: Enabled
                  - Exclude Javascript from Deferring: "sdadasdasdasdasd"
              - **Serve next-gen Images (AVIF, WEBP)**:
                  - Serve next-gen Images: Enabled
                  - Image Optimize Level: "lossless"
                  - Low Quality Image placeholders (LQIP): Disabled
                  - Enable adaptive Image delivery: Disabled
              - **Lazy Load Images**:
                  - Image Lazy Load: Enabled
              - **Minify Javascript**:
                  - Minify Javascript: Enabled
                  - Exclude Javascript from Minify: "*script-1*"
              - **Remove Unused CSS**:
                  - Remove Unused CSS: Enabled
              - **Delay Javascript**:
                  - Delay Javascript: Enabled
                  - Delay Method: "All Files"
                  - Exclude Javascript: "*script-1*"
              - **Page Cache**:
                  - Page Cache: Enabled
                  - Cache Expiration: "0"
                  - Mobile Cache: Enabled
              - **RapidLoad CDN**:
                  - RapidLoad CDN: Enabled
                  - CDN Endpoint: "https://rapidload-local.rapidload-cdn.io/"
              - **Self Host Google Fonts**:
                  - Self Host Google Fonts: Enabled
              - **Lazy Load Iframes**:
                  - Iframes Lazy Load: Enabled
                  - **Exclude Above-the-fold Images from Lazy Load**:
                  - Exclude LCP image from Lazy Load: Disabled
              - **Minify CSS**:
                  - Minify CSS: Enabled
              - **Add Width and Height Attributes**:
                  - Add Width and Height Attributes: Enabled
            `,
        createdAt: new Date(),
      },
    ]);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      (messagesEndRef.current as HTMLElement).scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-container flex flex-col w-full max-w-4xl mx-auto h-[calc(100vh-8rem)] py-4">
      <div className="flex-1 overflow-y-auto px-4 bg-white rounded-lg shadow-lg">
        {messages.length === 1 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare size={48} className="mb-2" />
            <p>No messages yet. Start a conversation!</p>
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
          placeholder="Type a message..."
          onChange={handleInputChange}
        />
        <button
          type="submit"
          disabled={input.trim() === ""}
          className="ml-2 bg-violet-900 text-white p-2 rounded-lg hover:bg-violet-600 disabled:opacity-50 transition-colors"
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
}
