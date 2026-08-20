import React from 'react';
import {
  Twitter,
  Send,
  Youtube,
  ShieldCheck,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { InfinityLogo } from './InfinityLogo';
import { ActiveTab } from '../types';
import { CONTRACT_ADDRESSES } from '../config/contracts';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="border-t border-cyan-500/20 bg-slate-950/95 py-10 px-6 mt-20 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          {/* Brand */}
          <div onClick={() => setActiveTab('home')} className="cursor-pointer">
            <InfinityLogo size="md" />
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-orbitron text-slate-400">
            <button onClick={() => setActiveTab('home')} className="hover:text-cyan-400 transition-colors">
              Overview
            </button>
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-cyan-400 transition-colors">
              Dashboard
            </button>
            <button onClick={() => setActiveTab('stake')} className="hover:text-cyan-400 transition-colors">
              Staking Hub
            </button>
            <button onClick={() => setActiveTab('swap')} className="hover:text-cyan-400 transition-colors">
              Swap Portal
            </button>
            <button onClick={() => setActiveTab('learning')} className="hover:text-cyan-400 transition-colors">
              Protocol Docs
            </button>
            <button onClick={() => setActiveTab('contracts')} className="hover:text-cyan-400 transition-colors">
              Smart Contracts
            </button>
            <button onClick={() => setActiveTab('ai')} className="hover:text-cyan-400 transition-colors">
              AI Advisor
            </button>
          </div>

          {/* Social Links (Matching User Snippet) */}
          <div className="flex items-center space-x-3">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="w-10 h-10 rounded-xl glass-panel hover:border-cyan-400 flex items-center justify-center text-cyan-400 neon-cyan-glow transition-all hover:scale-105"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              className="w-10 h-10 rounded-xl glass-panel hover:border-fuchsia-400 flex items-center justify-center text-fuchsia-400 neon-magenta-glow transition-all hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="w-10 h-10 rounded-xl glass-panel hover:border-cyan-400 flex items-center justify-center text-cyan-400 neon-cyan-glow transition-all hover:scale-105"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-orbitron">
          <p className="tracking-wide text-neon-cyan text-center sm:text-left">
            © 2026 Core Infinity. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Immutable Smart Contracts on Polygon (Chain ID 137)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
