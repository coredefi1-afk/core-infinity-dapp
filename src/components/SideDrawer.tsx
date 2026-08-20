import React, { useState } from 'react';
import {
  Cpu,
  X,
  LayoutDashboard,
  Layers,
  Repeat,
  BookOpen,
  Bot,
  FileCode2,
  Share2,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { ActiveTab, UserContractData } from '../types';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import { InfinityLogo } from './InfinityLogo';
import { AnimatedTooltip } from './Tooltip';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  onRefreshDashboard: () => void;
  onQuickStake: (amount: string) => void;
  onQuickSwap: (amount: string) => void;
  walletAddress: string | null;
  userData: UserContractData | null;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  onRefreshDashboard,
  onQuickStake,
  onQuickSwap,
  walletAddress,
  userData,
}) => {
  const [stakeAmt, setStakeAmt] = useState('');
  const [swapAmt, setSwapAmt] = useState('');

  const handleNavigate = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  const handleStakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stakeAmt || parseFloat(stakeAmt) < 10) {
      alert('Minimum staking amount is 10 INF tokens.');
      return;
    }
    onQuickStake(stakeAmt);
  };

  const handleSwapSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!swapAmt || parseFloat(swapAmt) <= 0) {
      alert('Please enter a valid swap amount.');
      return;
    }
    onQuickSwap(swapAmt);
  };

  return (
    <>
      {/* Drawer Overlay with Smooth Fade and Click-to-Close */}
      <div
        id="drawerOverlay"
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Side Drawer Content */}
      <div
        id="sideDrawer"
        className={`fixed top-0 right-0 w-full sm:w-[420px] max-w-[100vw] h-full z-50 bg-slate-950/95 border-l border-cyan-500/30 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-in-out p-5 sm:p-6 flex flex-col justify-between overflow-y-auto box-border ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <InfinityLogo size="sm" />
            <AnimatedTooltip content="Close Drawer" position="left" glowColor="cyan">
              <button
                id="closeMenuBtn"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </AnimatedTooltip>
          </div>

          {/* Wallet Summary Pill if connected */}
          {walletAddress && (
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-orbitron tracking-wider text-cyan-400">Active Account</span>
                <p className="font-mono text-xs text-white">
                  {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 6)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400">Staked Yield</span>
                <p className="font-orbitron font-bold text-xs text-emerald-400">
                  {parseFloat(userData?.selfStake || '0').toFixed(1)} INF
                </p>
              </div>
            </div>
          )}

          {/* Quick Action Navigation Panels */}
          <nav className="space-y-3.5">
            {/* Live Dashboard Card */}
            <div className="p-4 rounded-2xl glass-panel space-y-2.5 border-cyan-500/30 transition-all hover:border-cyan-400/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold font-orbitron text-xs">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Live Dashboard</span>
                </div>
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className="text-[11px] text-cyan-300 hover:text-white flex items-center space-x-1 cursor-pointer"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Fetch real blockchain stakes, earnings caps, and rank volume.
              </p>
              <AnimatedTooltip
                content="Fetch Blockchain Stats"
                subtext="Queries CoreInfinityEnterprise contract"
                position="top"
                glowColor="cyan"
                className="w-full"
              >
                <button
                  onClick={() => {
                    onRefreshDashboard();
                    handleNavigate('dashboard');
                  }}
                  className="w-full py-2 bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-bold font-orbitron text-xs rounded-xl neon-cyan-glow hover:bg-cyan-500 hover:text-slate-950 transition-all active:scale-[0.98] cursor-pointer"
                >
                  Fetch / Refresh Live Data
                </button>
              </AnimatedTooltip>
            </div>

            {/* Quick Stake Card */}
            <div className="p-4 rounded-2xl glass-panel space-y-2.5 border-fuchsia-500/30 transition-all hover:border-fuchsia-400/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-fuchsia-400 font-bold font-orbitron text-xs">
                  <Layers className="w-4 h-4" />
                  <span>Staking Hub</span>
                </div>
                <button
                  onClick={() => handleNavigate('stake')}
                  className="text-[11px] text-fuchsia-300 hover:text-white flex items-center space-x-1 cursor-pointer"
                >
                  <span>Open Hub</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <form onSubmit={handleStakeSubmit} className="space-y-2">
                <div className="relative">
                  <input
                    type="number"
                    id="menuStakeAmt"
                    placeholder="Enter amount (Min 10 INF)"
                    value={stakeAmt}
                    onChange={(e) => setStakeAmt(e.target.value)}
                    min="10"
                    step="any"
                    className="w-full bg-slate-950/90 border border-fuchsia-500/30 p-2.5 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-fuchsia-400"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] font-orbitron text-fuchsia-400">INF</span>
                </div>
                <AnimatedTooltip
                  content="Execute Stake"
                  subtext="Token Approval + Contract Deposit"
                  position="top"
                  glowColor="fuchsia"
                  className="w-full"
                >
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-bold font-orbitron text-xs rounded-xl neon-magenta-glow hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Stake via Smart Contract
                  </button>
                </AnimatedTooltip>
              </form>
            </div>

            {/* Quick Swap Card */}
            <div className="p-4 rounded-2xl glass-panel space-y-2.5 border-cyan-500/30 transition-all hover:border-cyan-400/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold font-orbitron text-xs">
                  <Repeat className="w-4 h-4" />
                  <span>Swap Portal (5% Fee Split)</span>
                </div>
                <button
                  onClick={() => handleNavigate('swap')}
                  className="text-[11px] text-cyan-300 hover:text-white flex items-center space-x-1 cursor-pointer"
                >
                  <span>Portal</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <form onSubmit={handleSwapSubmit} className="space-y-2">
                <div className="relative">
                  <input
                    type="number"
                    id="menuSwapAmt"
                    placeholder="Token amount to swap"
                    value={swapAmt}
                    onChange={(e) => setSwapAmt(e.target.value)}
                    min="1"
                    step="any"
                    className="w-full bg-slate-950/90 border border-cyan-500/30 p-2.5 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] font-orbitron text-cyan-400">INF</span>
                </div>
                <AnimatedTooltip
                  content="Swap via DEX"
                  subtext="QuickSwap Router with 5% split"
                  position="top"
                  glowColor="cyan"
                  className="w-full"
                >
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold font-orbitron text-xs rounded-xl neon-cyan-glow hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Swap to USDT
                  </button>
                </AnimatedTooltip>
              </form>
            </div>

            {/* Learning Hub & Documentation */}
            <div className="p-3.5 rounded-2xl glass-panel space-y-2 border-emerald-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold font-orbitron text-xs">
                  <BookOpen className="w-4 h-4" />
                  <span>Learning Hub & Rules</span>
                </div>
              </div>
              <p className="text-xs text-slate-400">Access Web3 guides, 300% capping math & docs.</p>
              <button
                onClick={() => handleNavigate('learning')}
                className="w-full py-2 bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-bold font-orbitron text-xs rounded-xl hover:bg-emerald-500 hover:text-slate-950 transition-all cursor-pointer"
              >
                Open Protocol Guide
              </button>
            </div>

            {/* AI Protocol Strategist */}
            <div className="p-3.5 rounded-2xl glass-panel space-y-2 border-indigo-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-indigo-400 font-bold font-orbitron text-xs">
                  <Bot className="w-4 h-4" />
                  <span>A to Z AI Deep Analyzer</span>
                </div>
              </div>
              <p className="text-xs text-slate-400">Real-time AI yield analytics & matrix strategy.</p>
              <button
                onClick={() => handleNavigate('ai')}
                className="w-full py-2 bg-indigo-500/20 border border-indigo-400/50 text-indigo-300 font-bold font-orbitron text-xs rounded-xl hover:bg-indigo-500 hover:text-white transition-all cursor-pointer"
              >
                Launch A-to-Z AI Suite
              </button>
            </div>

            {/* Contract Registry */}
            <div className="p-3.5 rounded-2xl glass-panel space-y-2 border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-300 font-bold font-orbitron text-xs">
                  <FileCode2 className="w-4 h-4" />
                  <span>12 Protocol Contracts</span>
                </div>
              </div>
              <button
                onClick={() => handleNavigate('contracts')}
                className="w-full py-2 bg-slate-900 border border-slate-700 text-slate-300 font-bold font-orbitron text-xs rounded-xl hover:border-cyan-400 hover:text-cyan-300 transition-all cursor-pointer"
              >
                View Smart Contracts
              </button>
            </div>
          </nav>
        </div>

        {/* Drawer Footer */}
        <div className="pt-6 border-t border-slate-800 text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-orbitron text-[11px] text-cyan-400">Polygon PoS Mainnet</span>
          </div>
          <p className="text-[10px] text-slate-600 font-mono break-all">
            Enterprise: {CONTRACT_ADDRESSES.enterprise.substring(0, 16)}...
          </p>
        </div>
      </div>
    </>
  );
};
