import { MessagesSquare } from "lucide-react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ChatHistoryPanelProps {
  conversations: Array<{
    id: string;
    title: string;
    active?: boolean;
  }>;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
}

export default function ChatHistoryPanel({ 
  conversations, 
  onSelectConversation,
  onNewChat,
  onDeleteConversation
}: ChatHistoryPanelProps) {
  return (
    <div className="w-64 h-full bg-gray-50 border-r border-gray-200 p-4">
      <button
        onClick={onNewChat}
        className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-2 bg-brand-950 text-white rounded-lg hover:bg-brand-900 transition-colors"
      >
        <MessagesSquare size={16} />
        New Chat
      </button>
      
      <div className="space-y-2">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="group relative"
          >
            <button
              onClick={() => onSelectConversation(conv.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                conv.active 
                  ? 'bg-brand-100 text-brand-950' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessagesSquare size={14} />
                <span className="text-sm truncate">{conv.title}</span>
              </div>
            </button>
            
            {/* Delete button */}
            <button
              onClick={() => onDeleteConversation(conv.id)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-opacity"
            >
              <XMarkIcon className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 