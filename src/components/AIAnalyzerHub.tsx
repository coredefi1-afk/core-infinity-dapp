import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Download,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  Repeat,
  TrendingUp,
  Award,
  AlertCircle,
  FileText,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Search,
  BookOpen,
} from 'lucide-react';
import { InfinityLogo } from './InfinityLogo';
import { UserContractData, ChatMessage } from '../types';
import { CONTRACT_ADDRESSES } from '../config/contracts';

interface AIAnalyzerHubProps {
  userData: UserContractData | null;
  walletAddress: string | null;
  onConnectWallet: () => void;
}

type AnalyzerView = 'a_to_z' | 'portfolio_audit' | 'simulator' | 'chat';

export const AIAnalyzerHub: React.FC<AIAnalyzerHubProps> = ({
  userData,
  walletAddress,
  onConnectWallet,
}) => {
  const [activeView, setActiveView] = useState<AnalyzerView>('a_to_z');
  const [isLoading, setIsLoading] = useState(false);
  const [aToZReport, setAToZReport] = useState<string | null>(null);
  const [portfolioReport, setPortfolioReport] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Welcome to the upgraded **Core Infinity A-to-Z Protocol Intelligence Hub**.\n\nPowered by Gemini, I can generate full architectural audits, inspect all 12 Polygon smart contracts, analyze your active binary matrix balance, and project 300% cycle milestones.\n\nSelect an automated analysis module above or ask any specific technical question below.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulation parameters for Scenario mode
  const [simStake, setSimStake] = useState('1000');
  const [simWeakerVolume, setSimWeakerVolume] = useState('5000');
  const [simMode, setSimMode] = useState<'bond' | 'standard'>('bond');
  const [simDays, setSimDays] = useState('60');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 1. Fetch Full A-to-Z Analysis
  const handleGenerateAToZ = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/protocol-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'full_a_to_z',
          userContext: {
            walletAddress: walletAddress || 'Not Connected',
            selfStake: userData?.selfStake || '0',
            rank: userData?.rank || 0,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch A-Z Report');
      setAToZReport(data.reply);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Error generating report.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fetch User Portfolio Diagnostic
  const handleGeneratePortfolioAudit = async () => {
    if (!walletAddress) {
      onConnectWallet();
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/protocol-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'portfolio_audit',
          userContext: {
            walletAddress,
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
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to audit portfolio');
      setPortfolioReport(data.reply);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Error auditing portfolio.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Send Chat Query
  const handleSendChat = async (overridePrompt?: string) => {
    const text = overridePrompt || inputQuestion.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!overridePrompt) setInputQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/protocol-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          userContext: {
            walletAddress: walletAddress || 'Not Connected',
            selfStake: userData?.selfStake || '0',
            rank: userData?.rank || 0,
            leftVolume: userData?.leftVolume || '0',
            rightVolume: userData?.rightVolume || '0',
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to communicate with AI Advisor');

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `⚠️ Analysis interrupted: ${err?.message || 'Server error'}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Scenario Math calculations
  const numSimStake = parseFloat(simStake) || 0;
  const numSimVolume = parseFloat(simWeakerVolume) || 0;
  const numSimDays = parseInt(simDays) || 30;
  const dailyRate = simMode === 'bond' ? 0.0075 : 0.005;
  const dailyNonWorkingINF = numSimStake * dailyRate;
  const totalNonWorkingINF = dailyNonWorkingINF * numSimDays;
  const binaryBonusINF = numSimVolume * 0.10;
  const grossEarnedINF = totalNonWorkingINF + binaryBonusINF;
  const maxCapINF = numSimStake * 3.0; // 300%
  const cappedEarnedINF = Math.min(grossEarnedINF, maxCapINF);
  const capUtilization = maxCapINF > 0 ? Math.min(100, (cappedEarnedINF / maxCapINF) * 100) : 0;
  const priceUsdt = 0.125;
  const projectedUsdt = cappedEarnedINF * priceUsdt;

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Visual Header with Upgraded Official Logo */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 pt-2">
        <InfinityLogo size="xl" animate={true} />
        
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-orbitron">
          <Cpu className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span>UPGRADED AI PROTOCOL INTELLIGENCE SUITE • A TO Z ARCHITECTURE</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Deep on-chain intelligence, mathematical capping models, binary matching optimization, and real-time smart contract audits powered by Gemini.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1.5 rounded-2xl glass-panel border-cyan-500/30">
        <button
          onClick={() => {
            setActiveView('a_to_z');
            if (!aToZReport) handleGenerateAToZ();
          }}
          className={`py-3 px-4 rounded-xl text-xs font-orbitron font-bold flex items-center justify-center space-x-2 transition-all ${
            activeView === 'a_to_z'
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>A to Z Protocol Analysis</span>
        </button>

        <button
          onClick={() => {
            setActiveView('portfolio_audit');
            if (!portfolioReport && walletAddress) handleGeneratePortfolioAudit();
          }}
          className={`py-3 px-4 rounded-xl text-xs font-orbitron font-bold flex items-center justify-center space-x-2 transition-all ${
            activeView === 'portfolio_audit'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Live Portfolio Audit</span>
        </button>

        <button
          onClick={() => setActiveView('simulator')}
          className={`py-3 px-4 rounded-xl text-xs font-orbitron font-bold flex items-center justify-center space-x-2 transition-all ${
            activeView === 'simulator'
              ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-slate-950 shadow-[0_0_15px_rgba(217,70,239,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Strategy Simulator</span>
        </button>

        <button
          onClick={() => setActiveView('chat')}
          className={`py-3 px-4 rounded-xl text-xs font-orbitron font-bold flex items-center justify-center space-x-2 transition-all ${
            activeView === 'chat'
              ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Interactive AI Specialist</span>
        </button>
      </div>

      {/* VIEW 1: A TO Z COMPREHENSIVE DOSSIER */}
      {activeView === 'a_to_z' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border-cyan-500/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-orbitron font-bold text-xl text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>Full A-to-Z Protocol Intelligence Breakdown</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Institutional whitepaper audit covering all mathematical models, staking tiers, 5% swap splits, and 300% caps.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={handleGenerateAToZ}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-orbitron text-cyan-300 flex items-center space-x-1.5 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Regenerate Report</span>
                </button>
                {aToZReport && (
                  <>
                    <button
                      onClick={() => handleCopy(aToZReport, 'atoz')}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center space-x-1"
                    >
                      {copiedId === 'atoz' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'atoz' ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => handleDownload(aToZReport, 'core-infinity-a-to-z-report.md')}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs text-cyan-300 font-orbitron flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export MD</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Structured A-Z Quick Navigation Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-[11px] font-mono">
              {[
                { letter: 'A', title: 'Architecture (Polygon PoS)' },
                { letter: 'B', title: 'Binary 10% Match Engine' },
                { letter: 'C', title: '300% Capping Formula' },
                { letter: 'D', title: 'Dual-Staking (0.50% / 0.75%)' },
                { letter: 'E', title: 'Economics & 5% Swap Split' },
                { letter: 'F', title: 'Financial Forecasting Models' },
                { letter: 'G', title: 'Governance & Rank Ladders' },
                { letter: 'H', title: 'Health & 12 Smart Contracts' },
                { letter: 'I', title: 'Infinity Tokenomics' },
                { letter: 'J', title: 'Joint Multi-Sig Security' },
                { letter: 'K', title: 'Key Yield Milestones' },
                { letter: 'Z', title: 'Zero-Inflation Safeguards' },
              ].map((item, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">
                    {item.letter}
                  </span>
                  <span className="truncate text-[10px]">{item.title}</span>
                </div>
              ))}
            </div>

            {/* Generated Report Content Box */}
            {isLoading ? (
              <div className="p-12 text-center space-y-4">
                <div className="inline-block p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/30">
                  <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
                <h4 className="font-orbitron font-bold text-base text-white">
                  Synthesizing Comprehensive A-to-Z Protocol Report...
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Gemini is auditing on-chain parameters, binary matrix algorithms, liquidity splits, and the 12 Polygon smart contracts.
                </p>
              </div>
            ) : aToZReport ? (
              <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap max-h-[600px] overflow-y-auto space-y-4 shadow-inner">
                {aToZReport}
              </div>
            ) : (
              <div className="p-12 text-center space-y-4">
                <p className="text-xs text-slate-400">Click below to generate the complete A-to-Z Institutional Protocol Dossier.</p>
                <button
                  onClick={handleGenerateAToZ}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-600 text-slate-950 font-orbitron font-bold text-xs hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  Generate A to Z Analysis Report
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: LIVE PORTFOLIO & CAP AUDIT */}
      {activeView === 'portfolio_audit' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border-cyan-500/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-orbitron font-bold text-xl text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Personalized Wallet Portfolio & Binary Diagnostic</span>
                </h3>
                <p className="text-xs text-slate-400">
                  AI analysis of your active staked capital, weaker leg matching volume, and remaining 300% cycle headroom.
                </p>
              </div>

              {walletAddress && (
                <button
                  onClick={handleGeneratePortfolioAudit}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-orbitron text-cyan-300 flex items-center space-x-1.5 shrink-0 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh Diagnostic</span>
                </button>
              )}
            </div>

            {/* Position Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-center">
                <span className="text-[10px] text-slate-400 font-orbitron">Active Self Stake</span>
                <p className="font-mono font-bold text-cyan-400 text-base sm:text-lg">
                  {userData?.selfStake || '0.00'} INF
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  ~${((parseFloat(userData?.selfStake || '0')) * 0.125).toFixed(2)} USD
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-center">
                <span className="text-[10px] text-slate-400 font-orbitron">Total Earnings</span>
                <p className="font-mono font-bold text-emerald-400 text-base sm:text-lg">
                  {(parseFloat(userData?.nonWorkingEarnings || '0') + parseFloat(userData?.workingEarnings || '0')).toFixed(2)} INF
                </p>
                <p className="text-[10px] text-slate-500 font-mono">Daily + Binary</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-fuchsia-500/30 text-center">
                <span className="text-[10px] text-slate-400 font-orbitron">Binary Legs</span>
                <p className="font-mono font-bold text-fuchsia-400 text-xs sm:text-sm">
                  L: {parseFloat(userData?.leftVolume || '0').toFixed(0)} | R: {parseFloat(userData?.rightVolume || '0').toFixed(0)}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">Volume matching</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-center">
                <span className="text-[10px] text-slate-400 font-orbitron">300% Cap Ceiling</span>
                <p className="font-mono font-bold text-amber-400 text-base sm:text-lg">
                  {((parseFloat(userData?.selfStake || '0')) * 3.0).toFixed(2)} INF
                </p>
                <p className="text-[10px] text-slate-500 font-mono">Max per cycle</p>
              </div>
            </div>

            {!walletAddress ? (
              <div className="p-8 text-center rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <p className="text-xs text-slate-400">Connect your Web3 wallet to generate an automated position audit.</p>
                <button
                  onClick={onConnectWallet}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-orbitron font-bold text-xs hover:bg-cyan-400 transition-all"
                >
                  Connect Wallet
                </button>
              </div>
            ) : isLoading ? (
              <div className="p-10 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                <h4 className="font-orbitron font-bold text-sm text-white">Analyzing Wallet Data...</h4>
              </div>
            ) : portfolioReport ? (
              <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                {portfolioReport}
              </div>
            ) : (
              <div className="p-6 text-center">
                <button
                  onClick={handleGeneratePortfolioAudit}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-orbitron font-bold text-xs hover:scale-105 transition-all"
                >
                  Generate Wallet Diagnostic
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: STRATEGY SCENARIO SIMULATOR */}
      {activeView === 'simulator' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border-fuchsia-500/30 space-y-6">
            <div>
              <h3 className="font-orbitron font-bold text-xl text-white flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-fuchsia-400" />
                <span>Protocol Strategy & Capital Growth Simulator</span>
              </h3>
              <p className="text-xs text-slate-400">
                Stress-test different staking sizes, team volume growth curves, and 300% cycle milestones before committing capital.
              </p>
            </div>

            {/* Input Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-orbitron text-slate-300">Staked Capital (INF)</label>
                <input
                  type="number"
                  value={simStake}
                  onChange={(e) => setSimStake(e.target.value)}
                  className="w-full bg-slate-900 border border-cyan-500/40 p-2.5 rounded-xl text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-orbitron text-slate-300">Weaker Leg Volume (INF)</label>
                <input
                  type="number"
                  value={simWeakerVolume}
                  onChange={(e) => setSimWeakerVolume(e.target.value)}
                  className="w-full bg-slate-900 border border-fuchsia-500/40 p-2.5 rounded-xl text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-orbitron text-slate-300">Staking Mode</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSimMode('standard')}
                    className={`py-2 rounded-xl text-xs font-orbitron transition-all ${
                      simMode === 'standard'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    0.50%/d
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimMode('bond')}
                    className={`py-2 rounded-xl text-xs font-orbitron transition-all ${
                      simMode === 'bond'
                        ? 'bg-fuchsia-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    0.75%/d
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-orbitron text-slate-300">Horizon (Days)</label>
                <select
                  value={simDays}
                  onChange={(e) => setSimDays(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-xs font-orbitron text-white focus:outline-none"
                >
                  <option value="30">30 Days</option>
                  <option value="60">60 Days</option>
                  <option value="90">90 Days</option>
                  <option value="180">180 Days</option>
                  <option value="365">365 Days (1 Year)</option>
                </select>
              </div>
            </div>

            {/* Calculated Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-orbitron block">Daily Yield</span>
                <span className="font-mono font-bold text-cyan-400 text-base sm:text-lg">
                  {dailyNonWorkingINF.toFixed(2)} INF
                </span>
                <p className="text-[10px] text-slate-500 font-mono">~${(dailyNonWorkingINF * priceUsdt).toFixed(2)}/day</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-orbitron block">Binary 10% Match</span>
                <span className="font-mono font-bold text-fuchsia-400 text-base sm:text-lg">
                  {binaryBonusINF.toFixed(2)} INF
                </span>
                <p className="text-[10px] text-slate-500 font-mono">~${(binaryBonusINF * priceUsdt).toFixed(2)}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-orbitron block">Estimated Net Payout</span>
                <span className="font-mono font-bold text-emerald-400 text-base sm:text-lg">
                  {cappedEarnedINF.toFixed(2)} INF
                </span>
                <p className="text-[10px] text-emerald-500 font-mono">~${projectedUsdt.toFixed(2)} USDT</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-orbitron block">300% Cap Limit</span>
                <span className="font-mono font-bold text-amber-400 text-base sm:text-lg">
                  {maxCapINF.toFixed(2)} INF
                </span>
                <p className="text-[10px] text-amber-500 font-mono">{capUtilization.toFixed(1)}% Reached</p>
              </div>
            </div>

            {/* Cap Progress Bar */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-orbitron">
                <span className="text-slate-300">300% Cap Saturation Curve</span>
                <span className="text-amber-400 font-mono">{capUtilization.toFixed(1)}% Full</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-amber-400 transition-all duration-500"
                  style={{ width: `${capUtilization}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {capUtilization >= 100
                  ? '⚠️ Full 300% cap reached in this timeframe. Re-staking is required to continue generating rewards.'
                  : `✅ Headroom remaining: ${(maxCapINF - cappedEarnedINF).toFixed(2)} INF before re-stake cycle is required.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: INTERACTIVE AI SPECIALIST CHAT */}
      {activeView === 'chat' && (
        <div className="rounded-3xl glass-panel border-indigo-500/30 overflow-hidden shadow-2xl flex flex-col h-[580px]">
          {/* Header */}
          <div className="px-6 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
                <Cpu className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <span className="font-orbitron font-bold text-xs sm:text-sm text-white">
                  Infinity AI Protocol Specialist
                </span>
                <p className="text-[10px] text-emerald-400 font-mono">Live • Polygon Mainnet Intelligence Core</p>
              </div>
            </div>
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
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isAi
                        ? 'bg-slate-900/95 border border-indigo-500/30 text-slate-200 shadow-md'
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
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
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
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Computing A-to-Z protocol intelligence...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto flex space-x-2">
            {[
              'Explain the A-to-Z mathematical architecture',
              'How to balance Left and Right binary volume?',
              'Break down the 5% DEX swap split formula',
              'What are the 12 Polygon contract addresses?',
              'How does the 300% anti-inflation cap work?',
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendChat(prompt)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-500/20 border border-slate-800 text-[11px] text-slate-300 whitespace-nowrap transition-all disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChat();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask anything about Core Infinity protocol mechanics, capping, binary matrix..."
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-400 p-3 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuestion.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:scale-105 text-slate-950 font-bold shadow-lg transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
