import React, { useState } from 'react';
import {
  LayoutDashboard,
  RefreshCw,
  Wallet,
  TrendingUp,
  Award,
  Users,
  Layers,
  Repeat,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { UserContractData, ActiveTab } from '../types';
import { RANK_NAMES, CONTRACT_ADDRESSES } from '../config/contracts';
import { AnimatedTooltip } from './Tooltip';

interface DashboardViewProps {
  userData: UserContractData | null;
  walletAddress: string | null;
  onRefresh: () => void;
  isLoading: boolean;
  setActiveTab: (tab: ActiveTab) => void;
  onConnectWallet: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userData,
  walletAddress,
  onRefresh,
  isLoading,
  setActiveTab,
  onConnectWallet,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const selfStakeNum = parseFloat(userData?.selfStake || '0');
  const nonWorkingNum = parseFloat(userData?.nonWorkingEarnings || '0');
  const workingNum = parseFloat(userData?.workingEarnings || '0');
  const totalEarnings = nonWorkingNum + workingNum;
  
  // Cap calculation (e.g. 300% max earnings cap before re-stake)
  const maxCap = selfStakeNum > 0 ? selfStakeNum * 3 : 0;
  const capProgressPercent = maxCap > 0 ? Math.min(100, (totalEarnings / maxCap) * 100) : 0;

  const leftVolNum = parseFloat(userData?.leftVolume || '0');
  const rightVolNum = parseFloat(userData?.rightVolume || '0');
  const totalVol = leftVolNum + rightVolNum;
  const leftRatio = totalVol > 0 ? (leftVolNum / totalVol) * 100 : 50;

  const currentRankName = RANK_NAMES[userData?.rank || 0] || 'Unranked Node';

  return (
    <div className="space-y-8 py-4">
      {/* Top Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white">
              Live Staker Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Directly synced with Enterprise Smart Contract (0x59c3...73C1)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <AnimatedTooltip
            content="Sync On-Chain Data"
            subtext="Reads fresh state from Polygon RPC"
            position="bottom"
            glowColor="cyan"
          >
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-orbitron font-semibold transition-all hover:bg-cyan-500/10 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Refresh Blockchain Data'}</span>
            </button>
          </AnimatedTooltip>
        </div>
      </div>

      {!walletAddress ? (
        <div className="p-8 rounded-3xl glass-panel text-center space-y-4 border-cyan-500/30">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
            <Wallet className="w-7 h-7" />
          </div>
          <h2 className="font-orbitron font-bold text-xl text-white">Connect Wallet to Read On-Chain State</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Connect your MetaMask, Trust Wallet or Web3 browser to fetch your individual staking positions, binary matrix commissions, and real-time yield caps.
          </p>
          <AnimatedTooltip content="Connect Web3 Wallet" subtext="Polygon Mainnet Chain 137" position="top" glowColor="cyan">
            <button
              onClick={onConnectWallet}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-orbitron font-bold text-xs sm:text-sm neon-cyan-glow hover:scale-105 transition-all cursor-pointer"
            >
              Connect Polygon Wallet
            </button>
          </AnimatedTooltip>
        </div>
      ) : (
        <>
          {/* Main Stat Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Self Stake Card */}
            <div className="p-5 rounded-2xl glass-panel space-y-3 border-cyan-500/30">
              <div className="flex items-center justify-between text-slate-400 text-xs font-orbitron">
                <span>Active Self Stake</span>
                <Layers className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="space-y-0.5">
                <div className="font-orbitron font-extrabold text-2xl text-cyan-300">
                  {selfStakeNum.toFixed(2)} <span className="text-xs text-cyan-400 font-normal">INF</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  ≈ ${(selfStakeNum * 0.125).toFixed(2)} USD
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Status:</span>
                <span className={`font-semibold ${userData?.isValidStaker ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {userData?.isValidStaker ? '✓ Active Staker' : 'No Active Stake'}
                </span>
              </div>
            </div>

            {/* Non-Working Earnings */}
            <div className="p-5 rounded-2xl glass-panel space-y-3 border-fuchsia-500/30">
              <div className="flex items-center justify-between text-slate-400 text-xs font-orbitron">
                <span>Non-Working Yield</span>
                <TrendingUp className="w-4 h-4 text-fuchsia-400" />
              </div>
              <div className="space-y-0.5">
                <div className="font-orbitron font-extrabold text-2xl text-fuchsia-300">
                  {nonWorkingNum.toFixed(2)} <span className="text-xs text-fuchsia-400 font-normal">INF</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  ≈ ${(nonWorkingNum * 0.125).toFixed(2)} USD
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Yield Engine:</span>
                <span className="text-fuchsia-400 font-mono">Daily Non-Working</span>
              </div>
            </div>

            {/* Working Binary Earnings */}
            <div className="p-5 rounded-2xl glass-panel space-y-3 border-emerald-500/30">
              <div className="flex items-center justify-between text-slate-400 text-xs font-orbitron">
                <span>Working Commissions</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="space-y-0.5">
                <div className="font-orbitron font-extrabold text-2xl text-emerald-300">
                  {workingNum.toFixed(2)} <span className="text-xs text-emerald-400 font-normal">INF</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  ≈ ${(workingNum * 0.125).toFixed(2)} USD
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Binary Matching:</span>
                <span className="text-emerald-400 font-mono">10% Weaker Leg</span>
              </div>
            </div>

            {/* Rank Status */}
            <div className="p-5 rounded-2xl glass-panel space-y-3 border-indigo-500/30">
              <div className="flex items-center justify-between text-slate-400 text-xs font-orbitron">
                <span>Protocol Rank Tier</span>
                <Award className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="space-y-0.5">
                <div className="font-orbitron font-bold text-base text-indigo-300 truncate">
                  {currentRankName}
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Tier Level: {userData?.rank || 0}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">DAO Partner:</span>
                <span className={`font-semibold ${userData?.isDaoPartner ? 'text-indigo-400' : 'text-slate-500'}`}>
                  {userData?.isDaoPartner ? 'Verified Partner' : 'Standard Node'}
                </span>
              </div>
            </div>
          </div>

          {/* 300% Return Cap Progress Card */}
          <div className="p-6 rounded-3xl glass-panel space-y-4 border-cyan-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-orbitron font-bold text-base sm:text-lg text-white">
                    300% Maximum Return Cap Tracker
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Smart contract safeguard: Users earn up to 300% of their staked capital across all reward streams before re-staking is required.
                </p>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-slate-400">Cap Progress: </span>
                <span className="text-cyan-400 font-bold font-orbitron text-sm">{capProgressPercent.toFixed(1)}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-3.5 p-0.5 border border-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-fuchsia-500 transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                style={{ width: `${Math.max(3, capProgressPercent)}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-orbitron block">Total Earned</span>
                <span className="font-mono font-bold text-white text-xs sm:text-sm">{totalEarnings.toFixed(2)} INF</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-orbitron block">Maximum Cap (3x)</span>
                <span className="font-mono font-bold text-cyan-400 text-xs sm:text-sm">{maxCap.toFixed(2)} INF</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-orbitron block">Remaining Cap</span>
                <span className="font-mono font-bold text-emerald-400 text-xs sm:text-sm">
                  {Math.max(0, maxCap - totalEarnings).toFixed(2)} INF
                </span>
              </div>
            </div>
          </div>

          {/* Binary Tree Team Volume Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl glass-panel space-y-4 border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-orbitron font-bold text-base text-white">Binary Volume Balance</h3>
                </div>
                <button
                  onClick={() => setActiveTab('referrals')}
                  className="text-xs font-orbitron text-cyan-400 hover:underline flex items-center space-x-1"
                >
                  <span>Team Tree</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Binary volume determines your working earnings matching cycle.
              </p>

              {/* Volume Comparison Gauge */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold">Left Leg: {leftVolNum.toFixed(2)} INF</span>
                  <span className="text-fuchsia-400 font-bold">Right Leg: {rightVolNum.toFixed(2)} INF</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-3 flex overflow-hidden border border-slate-800">
                  <div
                    className="bg-cyan-500 transition-all duration-300"
                    style={{ width: `${leftRatio}%` }}
                    title="Left Leg"
                  />
                  <div
                    className="bg-fuchsia-500 transition-all duration-300"
                    style={{ width: `${100 - leftRatio}%` }}
                    title="Right Leg"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Weaker Matching Leg:</span>
                  <span className="font-bold text-emerald-400">
                    {Math.min(leftVolNum, rightVolNum).toFixed(2)} INF (10% Bonus)
                  </span>
                </div>
              </div>
            </div>

            {/* Upline & Sponsor Verification */}
            <div className="p-6 rounded-3xl glass-panel space-y-4 border-slate-800">
              <div className="flex items-center space-x-2.5">
                <Zap className="w-5 h-5 text-fuchsia-400" />
                <h3 className="font-orbitron font-bold text-base text-white">Network Lineage</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-orbitron text-slate-400 block mb-1">Direct Sponsor Node:</span>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-white">
                    <span className="truncate mr-2">{userData?.sponsor || CONTRACT_ADDRESSES.sponsor}</span>
                    <button
                      onClick={() => handleCopy(userData?.sponsor || CONTRACT_ADDRESSES.sponsor, 'sponsor')}
                      className="p-1.5 rounded-lg bg-slate-900 hover:text-cyan-400 text-slate-400 transition-colors"
                    >
                      {copiedKey === 'sponsor' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-orbitron text-slate-400 block mb-1">Placement Upline Node:</span>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-white">
                    <span className="truncate mr-2">{userData?.upline || CONTRACT_ADDRESSES.sponsor}</span>
                    <button
                      onClick={() => handleCopy(userData?.upline || CONTRACT_ADDRESSES.sponsor, 'upline')}
                      className="p-1.5 rounded-lg bg-slate-900 hover:text-cyan-400 text-slate-400 transition-colors"
                    >
                      {copiedKey === 'upline' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('stake')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-orbitron font-bold text-xs neon-cyan-glow hover:scale-105 transition-all"
            >
              Deposit & Stake INF
            </button>
            <button
              onClick={() => setActiveTab('swap')}
              className="px-5 py-3 rounded-xl bg-slate-900 border border-fuchsia-500/40 text-fuchsia-300 font-orbitron font-bold text-xs neon-magenta-glow hover:scale-105 transition-all"
            >
              Swap INF to USDT
            </button>
            <button
              onClick={() => setActiveTab('referrals')}
              className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-orbitron font-bold text-xs hover:border-emerald-400 hover:text-emerald-300 transition-all"
            >
              Copy Referral Link
            </button>
          </div>
        </>
      )}
    </div>
  );
};
