import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Users,
  QrCode,
  ArrowRight,
  TrendingUp,
  Zap,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { UserContractData, ActiveTab } from '../types';
import { CONTRACT_ADDRESSES } from '../config/contracts';

interface ReferralHubProps {
  walletAddress: string | null;
  userData: UserContractData | null;
  onConnectWallet: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const ReferralHub: React.FC<ReferralHubProps> = ({
  walletAddress,
  userData,
  onConnectWallet,
  setActiveTab,
}) => {
  const [copied, setCopied] = useState(false);
  const [placementLeg, setPlacementLeg] = useState<'auto' | 'left' | 'right'>('auto');

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://core-infinity.polygon';
  const referralLink = walletAddress
    ? `${originUrl}?ref=${walletAddress}`
    : `${originUrl}?ref=${CONTRACT_ADDRESSES.sponsor}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const leftVol = parseFloat(userData?.leftVolume || '0');
  const rightVol = parseFloat(userData?.rightVolume || '0');

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-orbitron">
          <Share2 className="w-3.5 h-3.5" />
          <span>DECENTRALIZED BINARY AFFILIATE MATRIX</span>
        </div>
        <h1 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white">
          Referral & Team Matrix Hub
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Share your custom on-chain referral link, expand your binary network, and earn 10% matching commissions on your weaker volume leg.
        </p>
      </div>

      {/* Referral Link Generator Box */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-6 border-cyan-500/30 neon-cyan-glow">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-orbitron font-bold text-sm text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Your Unique On-Chain Invite Link</span>
            </label>
            <span className="text-[10px] text-emerald-400 font-mono">100% Non-Custodial</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="w-full bg-slate-950/90 border border-cyan-500/40 p-3.5 rounded-2xl text-xs font-mono text-cyan-300 break-all select-all">
              {referralLink}
            </div>
            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-orbitron font-bold text-xs sm:text-sm shrink-0 flex items-center justify-center space-x-2 transition-all hover:scale-105"
            >
              {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Placement Strategy Selector */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-orbitron text-slate-300">Binary Placement Direction</span>
            <span className="text-slate-500 font-mono text-[11px]">Default: Auto-Balance</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'auto', label: 'Auto-Balance' },
              { id: 'left', label: 'Left Leg Only' },
              { id: 'right', label: 'Right Leg Only' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPlacementLeg(item.id as any)}
                className={`py-2 rounded-xl text-xs font-orbitron transition-all ${
                  placementLeg === item.id
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Binary Tree Visualizer */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-6 border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-base text-white">Binary Tree Placement Map</h3>
              <p className="text-xs text-slate-400">Real-time visualization of your left and right team branches.</p>
            </div>
          </div>
        </div>

        {/* Tree Graphic Representation */}
        <div className="flex flex-col items-center justify-center py-6 space-y-6">
          {/* Root Node (User) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-cyan-400 text-center w-56 shadow-lg">
            <div className="font-orbitron font-bold text-xs text-white">YOU (Root Node)</div>
            <div className="font-mono text-[11px] text-cyan-300 mt-1 truncate">
              {walletAddress ? `${walletAddress.substring(0, 10)}...` : '0xYourWallet'}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
              Stake: {userData?.selfStake || '0.00'} INF
            </div>
          </div>

          {/* Connection Lines */}
          <div className="w-64 h-6 border-t-2 border-l-2 border-r-2 border-slate-700 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full" />
          </div>

          {/* Child Legs */}
          <div className="grid grid-cols-2 gap-8 w-full max-w-lg">
            {/* Left Branch */}
            <div className="p-4 rounded-2xl glass-panel border-cyan-500/40 text-center space-y-2">
              <div className="font-orbitron font-bold text-xs text-cyan-400">LEFT LEG VOLUME</div>
              <div className="font-mono font-bold text-lg text-white">{leftVol.toFixed(2)} INF</div>
              <p className="text-[10px] text-slate-400">Calculated from direct & spillover nodes</p>
            </div>

            {/* Right Branch */}
            <div className="p-4 rounded-2xl glass-panel border-fuchsia-500/40 text-center space-y-2">
              <div className="font-orbitron font-bold text-xs text-fuchsia-400">RIGHT LEG VOLUME</div>
              <div className="font-mono font-bold text-lg text-white">{rightVol.toFixed(2)} INF</div>
              <p className="text-[10px] text-slate-400">Calculated from direct & spillover nodes</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5">Binary Matching Bonus Formula:</span>
            Binary commission is 10% on the weaker leg volume. When volume matches on both legs, the bonus is automatically calculated and added to working earnings up to the 300% cycle cap.
          </div>
        </div>
      </div>
    </div>
  );
};
