import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  Layers,
  Repeat,
  Info,
} from 'lucide-react';
import { ChatMessage, UserContractData } from '../types';

interface AIAssistantProps {
  userData: UserContractData | null;
  walletAddress: string | null;
}

export const AIAssistantModal: React.FC<AIAssistantProps> = ({
  userData,
  walletAddress,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Greetings, Operator. I am the Core Infinity Protocol AI Strategist. 
I can analyze your on-chain staking strategies, calculate binary matrix volume balancing, explain the 300% sustainable capping algorithm, and clarify the Polygon smart contract architecture.

How may I assist your portfolio today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'How does the 300% return cap protect protocol sustainability?',
    'What is the optimal strategy for staking 1,000 INF?',
    'Explain the 10% binary volume matching mechanics',
    'How does the 5% swap fee get distributed?',
    'What are the requirements to unlock DAO Partner status?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || inputValue.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/protocol-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          userContext: {
            walletAddress: walletAddress || 'Not connected',
            selfStake: userData?.selfStake || '0',
            nonWorkingEarnings: userData?.nonWorkingEarnings || '0',
            workingEarnings: userData?.workingEarnings || '0',
            leftVolume: userData?.leftVolume || '0',
            rightVolume: userData?.rightVolume || '0',
            rank: userData?.rank || 0,
            isDaoPartner: userData?.isDaoPartner || false,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to communicate with AI Advisor');
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Error processing protocol intelligence: ${err?.message || 'Server unavailable'}. Please verify Polygon connection.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-orbitron">
          <Bot className="w-3.5 h-3.5" />
          <span>GEMINI 3.7 FLASH POWERED PROTOCOL AI</span>
        </div>
        <h1 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white">
          AI Protocol Strategist
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Get real-time mathematical breakdowns, binary yield optimization, and smart contract security guidance tailored to your active position.
        </p>
      </div>

      {/* Main Chat Container */}
      <div className="rounded-3xl glass-panel border-indigo-500/30 overflow-hidden shadow-2xl flex flex-col h-[560px]">
        {/* Chat Header */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
              <Cpu className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="font-orbitron font-bold text-xs sm:text-sm text-white">
                Infinity Intelligence Core
              </span>
              <p className="text-[10px] text-emerald-400 font-mono">Live • Synced with Polygon PoS</p>
            </div>
          </div>
          <button
            onClick={() =>
              setMessages([
                {
                  id: 'reset',
                  sender: 'ai',
                  text: 'Chat history reset. How can I assist your protocol operations?',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Clear Chat</span>
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center text-white shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isAi
                      ? 'bg-slate-900/90 border border-indigo-500/30 text-slate-200 shadow-md'
                      : 'bg-cyan-600 text-slate-950 font-medium rounded-br-none shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                  <div
                    className={`mt-2 flex items-center justify-between text-[10px] ${
                      isAi ? 'text-slate-500' : 'text-cyan-950 font-semibold'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isAi && (
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="hover:text-indigo-400 flex items-center space-x-1 ml-3"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-500 flex items-center justify-center text-slate-950 font-bold text-xs shrink-0">
                    YOU
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-indigo-500/30 text-indigo-300 text-xs flex items-center space-x-2">
                <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Analyzing protocol math & smart contracts...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto flex space-x-2">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-500/20 border border-slate-800 hover:border-indigo-500/40 text-[11px] text-slate-300 hover:text-indigo-200 whitespace-nowrap transition-all disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about yield calculations, binary volume, 300% caps, or smart contracts..."
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-400 p-3 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-400 hover:to-fuchsia-500 text-white shadow-lg transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
