import { useState, useEffect } from 'react';


export const useChatHistory = (messages: any[], setMessages: (messages: any[]) => void) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('chat-conversations');
    return saved 
      ? JSON.parse(saved)
      : [{ id: '1', title: 'New Chat', active: true, messages: [] }];
  });

  useEffect(() => {
    localStorage.setItem('chat-conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    if (messages.length > 1) {
      setConversations(prev => prev.map(conv => {
        if (conv.active) {
          const firstUserMessage = messages.find(m => m && m.role === 'user');
          const title = firstUserMessage 
            ? firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '')
            : conv.title;
          
          return { ...conv, title, messages };
        }
        return conv;
      }));
    }
  }, [messages]);

  const handleNewChat = (fresh: boolean) => {
    console.log("messages", messages, fresh)
    if(messages.length <= 1 && !fresh){
      return;
    }
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      active: true,
      messages: [messages[0]]
    };

    setMessages([messages[0]]);
    setConversations(prev => 
      prev.map(conv => ({...conv, active: false})).concat(newChat)
    );
  };

  const handleSelectConversation = (id: string) => {
    const selectedConv = conversations.find(conv => conv.id === id);
    if (selectedConv) {
      setMessages(selectedConv.messages);
      setConversations(prev => 
        prev.map(conv => ({
          ...conv,
          active: conv.id === id
        }))
      );
    }
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => {
      const filtered = prev.filter(conv => conv.id !== id);
      if (prev.find(conv => conv.id === id)?.active && filtered.length > 0) {
        filtered[0].active = true;
        setMessages(filtered[0].messages);
      }
      return filtered;
    });
  };

  return {
    conversations,
    handleNewChat,
    handleSelectConversation,
    handleDeleteConversation,
  };
}; 