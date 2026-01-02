import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      senderId: 'nova-bot',
      senderName: 'NOVA AI',
      text: 'Hi there! I\'m NOVA, your personal study assistant. Ask me anything about your modules or schedule!',
      timestamp: Date.now(),
      isAi: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'You',
      text: inputValue,
      timestamp: Date.now(),
      isAi: false
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userMsg.text);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'nova-bot',
        senderName: 'NOVA AI',
        text: responseText,
        timestamp: Date.now(),
        isAi: true
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      // Fallback handled in service, but just in case
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 h-[calc(100vh-140px)] flex flex-col overflow-hidden transition-colors">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-nova-500 to-accent-500 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">NOVA Assistant</h2>
            <p className="text-nova-100 text-xs font-medium flex items-center gap-1">
              <Sparkles size={10} /> Powered by Gemini
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.isAi ? 'flex-row' : 'flex-row-reverse'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.isAi ? 'bg-gradient-to-br from-nova-400 to-nova-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              {msg.isAi ? <Bot size={16} /> : <UserIcon size={16} />}
            </div>
            
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.isAi 
                ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-600' 
                : 'bg-nova-500 text-white rounded-tr-none'
            }`}>
              <p>{msg.text}</p>
              <span className={`text-[10px] block mt-2 opacity-70 ${msg.isAi ? 'text-slate-400 dark:text-slate-300' : 'text-nova-100'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm ml-12">
            <Loader2 size={16} className="animate-spin" />
            <span>NOVA is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-nova-400 focus-within:border-transparent transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400"
            placeholder="Ask a question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="p-2 bg-nova-500 text-white rounded-full hover:bg-nova-600 disabled:opacity-50 disabled:hover:bg-nova-500 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};