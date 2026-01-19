
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hotel, ChatMessage } from '../types';
import { chatWithCrew } from '../services/geminiService';
import AgenticButton from './AgenticButton';
import AgentIcon from './AgentIcon';

interface FloatingChatProps {
  currentResults: Hotel[];
}

const FloatingChat: React.FC<FloatingChatProps> = ({ currentResults }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Mission Hub active. I am your TravelCrew coordinator. How can I assist with your deployment?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await chatWithCrew(input, currentResults);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || 'System latency detected. Data stream interrupted.',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-6 w-[380px] h-[550px] glass-dark rounded-3xl border border-white/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 glass rounded-xl flex items-center justify-center text-white">
                  <AgentIcon type="Booking Coordinator" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white">Crew Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Active Link</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-zinc-800 text-white font-medium' 
                      : 'glass border-white/10 text-zinc-300'
                  }`}>
                    {msg.content}
                    <div className={`text-[8px] font-black uppercase tracking-widest mt-2 opacity-30 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="glass border-white/10 p-4 rounded-2xl flex gap-2 items-center">
                    <span className="w-1 h-1 bg-white rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-6 border-t border-white/10 bg-black/40">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Transmit command..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:ring-1 focus:ring-white/20 text-white text-xs font-medium placeholder:text-zinc-600 pr-16"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isThinking}
                  className="absolute right-2 p-2 text-zinc-400 hover:text-white transition-colors disabled:opacity-30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
              <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest text-center mt-3">
                Crew Context: {currentResults.length > 0 ? `${currentResults.length} properties indexed` : 'Global Mode'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-zinc-800 rotate-180' : 'bg-white text-black'
        }`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.023c.09-.457.133-.923.133-1.393 0-.108-.003-.216-.01-.322A8.251 8.251 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
            </span>
          </div>
        )}
      </button>
    </div>
  );
};

export default FloatingChat;
