import React from 'react';
import {
  Wallet,
  Menu,
  ChevronDown,
  Activity,
  Layers,
  Repeat,
  LayoutDashboard,
  BookOpen,
  Bot,
  ExternalLink,
  ShieldCheck,
  Share2,
  FileCode2,
} from 'lucide-react';
import { InfinityLogo } from './InfinityLogo';
import { AnimatedTooltip } from './Tooltip';
import { ActiveTab, UserContractData } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onToggleMenu: () => void;
  walletAddress: string | null;
  userData: UserContractData | null;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  isConnecting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onToggleMenu,
  walletAddress,
  userData,
  onConnectWallet,
  onDisconnectWallet,
  isConnecting,
}) => {
  const [showWalletMenu, setShowWalletMenu] = React.useState(false);

  const navItems = [
    { id: 'home' as ActiveTab, label: 'Overview', icon: Layers },
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stake' as ActiveTab, label: 'Staking Hub', icon: Layers },
    { id: 'swap' as ActiveTab, label: 'Swap Portal', icon: Repeat },
    { id: 'referrals' as ActiveTab, label: 'Referrals', icon: Share2 },
    { id: 'learning' as ActiveTab, label: 'Docs', icon: BookOpen },
    { id: 'contracts' as ActiveTab, label: 'Contracts', icon: FileCode2 },
    { id: 'ai' as ActiveTab, label: 'A-Z AI Analyzer', icon: Bot, badge: 'A-Z AI' },
  ];

  const formatAddr = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/95 backdrop-blur-xl border-b border-cyan-500/20 px-3 sm:px-6 py-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo (Matches uploaded official graphic) */}
        <div
          onClick={() => setActiveTab('home')}
          className="cursor-pointer group select-none transition-transform hover:scale-[1.02] shrink-0"
        >
          <div className="hidden sm:block">
            <InfinityLogo size="md" />
          </div>
          <div className="block sm:hidden">
            <InfinityLogo size="sm" showTagline={false} />
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/70 p-1.5 rounded-2xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-orbitron transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 text-cyan-300 border border-cyan-400/40 neon-cyan-glow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-md bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Network & Wallet Section */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Network Pill */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-purple-500/30 text-[11px] font-orbitron text-purple-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Polygon 137</span>
          </div>

          {/* Connect Wallet Button */}
          {walletAddress ? (
            <div className="relative">
              <AnimatedTooltip content="Account Overview" subtext="Click to view balance & disconnect" position="bottom" glowColor="cyan">
                <button
                  id="connectWalletBtn"
                  onClick={() => setShowWalletMenu(!showWalletMenu)}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/50 hover:border-cyan-400 text-cyan-300 font-semibold text-xs sm:text-sm neon-cyan-glow transition-all cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span id="walletText" className="font-mono">{formatAddr(walletAddress)}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </AnimatedTooltip>

              {showWalletMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel p-4 shadow-2xl space-y-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs text-slate-400 font-orbitron">Connected Wallet</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      Mainnet
                    </span>
                  </div>
                  <div className="text-xs font-mono text-cyan-300 break-all p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                    {walletAddress}
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">INF Staked:</span>
                      <span className="font-bold text-cyan-400">{userData?.selfStake || '0.00'} INF</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">INF Balance:</span>
                      <span className="font-bold text-white">{parseFloat(userData?.tokenBalance || '0').toFixed(2)} INF</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">MATIC Gas:</span>
                      <span className="font-bold text-purple-400">{parseFloat(userData?.maticBalance || '0').toFixed(4)} MATIC</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
                    <a
                      href={`https://polygonscan.com/address/${walletAddress}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center space-x-1.5 text-xs text-slate-400 hover:text-cyan-400 py-1 transition-colors"
                    >
                      <span>View on Polygonscan</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => {
                        onDisconnectWallet();
                        setShowWalletMenu(false);
                      }}
                      className="w-full py-1.5 text-xs font-orbitron font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg border border-rose-500/30 transition-all cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <AnimatedTooltip content="Web3 Wallet" subtext="Connect MetaMask / Polygon wallet" position="bottom" glowColor="cyan">
              <button
                id="connectWalletBtn"
                onClick={onConnectWallet}
                disabled={isConnecting}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-orbitron text-xs sm:text-sm neon-cyan-glow transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span id="walletText">{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            </AnimatedTooltip>
          )}

          {/* Hamburger Menu Toggle Button */}
          <AnimatedTooltip content="Command Hub" subtext="Slide-out drawer navigation" position="bottom" glowColor="fuchsia">
            <button
              id="menuBtn"
              onClick={onToggleMenu}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-fuchsia-500/40 hover:border-fuchsia-400 text-fuchsia-400 neon-magenta-glow cursor-pointer z-50 transition-all duration-300 hover:scale-105"
              aria-label="Open Command Hub"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </AnimatedTooltip>
        </div>
      </div>
    </header>
  );
};
