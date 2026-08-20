import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  Layers,
  Repeat,
  Lock,
  Sparkles,
  ArrowRight,
  Bot,
  Activity,
  CheckCircle2,
  Cpu,
  Orbit,
  Compass,
} from 'lucide-react';
import { InfinityLogo } from './InfinityLogo';
import { AnimatedTooltip } from './Tooltip';
import { ActiveTab, ProtocolStats } from '../types';
import { CONTRACT_ADDRESSES } from '../config/contracts';

interface HeroSectionProps {
  setActiveTab: (tab: ActiveTab) => void;
  onConnectWallet: () => void;
  walletAddress: string | null;
  protocolStats: ProtocolStats;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  setActiveTab,
  onConnectWallet,
  walletAddress,
  protocolStats,
}) => {
  const [continuous3D, setContinuous3D] = useState(true);
  return (
    <div className="w-full max-w-full space-y-16 py-4 overflow-x-hidden">
      {/* Top Banner / Hero Title */}
      <section className="text-center space-y-6 pt-4 pb-2 relative w-full">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Floating Protocol Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/40 text-cyan-300 text-xs font-orbitron font-semibold shadow-[0_0_15px_rgba(6,182,212,0.25)]">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>POLYGON MAINNET VERIFIED PROTOCOL</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        </div>

        {/* Official Brand Logo with Neon Laser Infinity Loop & Continuous 3D Rotation */}
        <div className="flex flex-col items-center justify-center space-y-4 py-2 w-full">
          <InfinityLogo
            size="xl"
            animate={true}
            continuous3DRotation={continuous3D}
          />

          {/* 3D Motion Mode Toggle Chip */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md gap-1">
            <button
              onClick={() => setContinuous3D(true)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-[10px] font-orbitron font-semibold transition-all cursor-pointer ${
                continuous3D
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)] font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Orbit className="w-3 h-3" />
              <span>3D Continuous Quantum Orbit</span>
            </button>
            <button
              onClick={() => setContinuous3D(false)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-[10px] font-orbitron font-semibold transition-all cursor-pointer ${
                !continuous3D
                  ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(34,197,94,0.6)] font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Interactive 3D Gyroscope</span>
            </button>
          </div>

          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed px-2 font-normal">
            Next-generation financial ecosystem powered by dual-tier staking, automated liquidity splits, binary volume matching, and strict 300% sustainable capping on Polygon PoS.
          </p>
        </div>

        {/* Action Buttons with Framer Motion Animated Tooltips */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full">
          <AnimatedTooltip
            content="Stake INF Tokens"
            subtext="Dual-tier yield up to 0.75% daily on Polygon"
            position="top"
            glowColor="emerald"
          >
            <button
              onClick={() => setActiveTab('stake')}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-600 hover:from-emerald-300 hover:to-blue-500 text-slate-950 font-orbitron font-bold text-xs sm:text-sm neon-cyan-glow-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Launch Staking Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </AnimatedTooltip>

          <AnimatedTooltip
            content="A to Z AI Protocol Suite"
            subtext="Deep audit, binary math simulations & code verification"
            position="top"
            glowColor="cyan"
          >
            <button
              onClick={() => setActiveTab('ai')}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 font-orbitron font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>A to Z AI Deep Analyzer</span>
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </button>
          </AnimatedTooltip>

          <AnimatedTooltip
            content="Instant QuickSwap DEX"
            subtext="Swap INF to USDT with 5% automated split"
            position="top"
            glowColor="fuchsia"
          >
            <button
              onClick={() => setActiveTab('swap')}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 border border-fuchsia-500/50 hover:border-fuchsia-400 text-fuchsia-300 font-orbitron font-bold text-xs sm:text-sm neon-magenta-glow transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Repeat className="w-4 h-4 text-fuchsia-400" />
              <span>Swap to USDT (5% Fee)</span>
            </button>
          </AnimatedTooltip>
        </div>
      </section>

      {/* Live Protocol Metric Tickers */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl glass-panel border-cyan-500/30 text-center space-y-1 hover:border-cyan-400 transition-all">
          <div className="flex items-center justify-center space-x-1.5 text-slate-400 text-[11px] font-orbitron">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Total Staked INF</span>
          </div>
          <div className="font-orbitron font-bold text-lg sm:text-xl text-cyan-300">
            {protocolStats.totalStakedINF.toLocaleString()} INF
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">≈ $355,625 TVL</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border-fuchsia-500/30 text-center space-y-1 hover:border-fuchsia-400 transition-all">
          <div className="flex items-center justify-center space-x-1.5 text-slate-400 text-[11px] font-orbitron">
            <TrendingUp className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Token Price</span>
          </div>
          <div className="font-orbitron font-bold text-lg sm:text-xl text-fuchsia-300">
            ${protocolStats.infPriceUsdt.toFixed(3)} USDT
          </div>
          <span className="text-[10px] text-fuchsia-400 font-mono">+4.8% 24h</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border-emerald-500/30 text-center space-y-1 hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-center space-x-1.5 text-slate-400 text-[11px] font-orbitron">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Rewards Paid</span>
          </div>
          <div className="font-orbitron font-bold text-lg sm:text-xl text-emerald-300">
            ${protocolStats.totalDistributedUsdt.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">100% On-Chain</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border-indigo-500/30 text-center space-y-1 hover:border-indigo-400 transition-all">
          <div className="flex items-center justify-center space-x-1.5 text-slate-400 text-[11px] font-orbitron">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Contract Security</span>
          </div>
          <div className="font-orbitron font-bold text-lg sm:text-xl text-indigo-300">
            Polygon POS
          </div>
          <span className="text-[10px] text-cyan-400 font-mono">Immutable Rules</span>
        </div>
      </section>

      {/* About Core Infinity Highlight Card (From User Snippet) */}
      <section className="p-6 sm:p-8 rounded-3xl glass-panel neon-cyan-glow space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-orbitron font-bold text-xl sm:text-2xl text-cyan-300">
            About Core Infinity
          </h2>
        </div>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Core Infinity is an elite framework engineered for absolute asset security and maximum yield efficiency. Featuring automated dual-staking systems and strict capping rules, it delivers a balanced long-term growth engine on Polygon Mainnet.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-orbitron font-bold text-xs text-white">Dual Staking Modes</h4>
              <p className="text-[11px] text-slate-400">Flexible yield & high-multiplier bonded terms.</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-orbitron font-bold text-xs text-white">5% Auto Split Swap</h4>
              <p className="text-[11px] text-slate-400">Deflationary buybacks & automatic LP replenishment.</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-orbitron font-bold text-xs text-white">Sustainable Caps</h4>
              <p className="text-[11px] text-slate-400">Strict capping algorithms prevent runaway inflation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Architecture Quick Guide */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Staking Architecture */}
        <div className="p-6 rounded-3xl glass-panel space-y-4 border-fuchsia-500/30 hover:border-fuchsia-500/60 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white">Staking & Binary Matrix</h3>
            </div>
            <button
              onClick={() => setActiveTab('stake')}
              className="text-xs font-orbitron text-fuchsia-400 hover:text-fuchsia-300 flex items-center space-x-1"
            >
              <span>Stake Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Stake INF tokens directly into the Enterprise Smart Contract. Earn non-working daily rewards alongside working binary volume commissions with automated upline allocation.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Min Staking Limit:</span>
              <span className="text-cyan-400 font-bold">10.0 INF</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Default Sponsor Node:</span>
              <span className="text-fuchsia-400 font-bold">{CONTRACT_ADDRESSES.sponsor.substring(0, 10)}...</span>
            </div>
          </div>
        </div>

        {/* Swap Engine */}
        <div className="p-6 rounded-3xl glass-panel space-y-4 border-cyan-500/30 hover:border-cyan-500/60 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Repeat className="w-5 h-5" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white">Smart Swap & Liquidity</h3>
            </div>
            <button
              onClick={() => setActiveTab('swap')}
              className="text-xs font-orbitron text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <span>Swap Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Swap INF tokens directly for USDT with automatic slippage protection. Every swap contributes 5% into protocol health (Buyback, Liquidity, DAO & Marketing).
          </p>
          <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono">
            <div className="p-1.5 rounded-lg bg-slate-950/80 border border-cyan-500/30">
              <span className="text-cyan-400 font-bold">2.0%</span>
              <p className="text-slate-500 text-[9px]">Buyback</p>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950/80 border border-cyan-500/30">
              <span className="text-cyan-400 font-bold">1.5%</span>
              <p className="text-slate-500 text-[9px]">Liquidity</p>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950/80 border border-cyan-500/30">
              <span className="text-cyan-400 font-bold">1.0%</span>
              <p className="text-slate-500 text-[9px]">DAO</p>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950/80 border border-cyan-500/30">
              <span className="text-cyan-400 font-bold">0.5%</span>
              <p className="text-slate-500 text-[9px]">Marketing</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
