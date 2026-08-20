import React, { useState } from 'react';
import {
  Repeat,
  ArrowDown,
  Sparkles,
  ShieldCheck,
  Zap,
  Info,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserContractData } from '../types';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import { executeSwap } from '../services/web3';
import { ethers } from 'ethers';
import { AnimatedTooltip } from './Tooltip';

interface SwapPortalProps {
  walletAddress: string | null;
  userData: UserContractData | null;
  onRefreshData: () => void;
  onConnectWallet: () => void;
  signer: ethers.Signer | null;
}

export const SwapPortal: React.FC<SwapPortalProps> = ({
  walletAddress,
  userData,
  onRefreshData,
  onConnectWallet,
  signer,
}) => {
  const [tokenAmount, setTokenAmount] = useState('100');
  const [slippage, setSlippage] = useState('1.0');
  const [isSwapping, setIsSwapping] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const pricePerToken = 0.125; // 1 INF = 0.125 USDT
  const numTokens = parseFloat(tokenAmount) || 0;
  const grossUsdt = numTokens * pricePerToken;
  const protocolFeePercent = 5.0;
  const protocolFeeUsdt = (grossUsdt * protocolFeePercent) / 100;
  const netUsdt = Math.max(0, grossUsdt - protocolFeeUsdt);

  // Minimum received after slippage
  const slippagePercent = parseFloat(slippage) || 1.0;
  const minReceivedUsdt = (netUsdt * (100 - slippagePercent)) / 100;

  // Fee splits
  const buybackSplit = (grossUsdt * 2.0) / 100;
  const liquiditySplit = (grossUsdt * 1.5) / 100;
  const daoSplit = (grossUsdt * 1.0) / 100;
  const marketingSplit = (grossUsdt * 0.5) / 100;

  const handleSwap = async () => {
    if (!signer || !walletAddress) {
      onConnectWallet();
      return;
    }
    if (numTokens <= 0) {
      setErrorMessage('Please enter a valid amount of INF tokens.');
      return;
    }

    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsSwapping(true);

      const minUsdtOutStr = minReceivedUsdt.toFixed(4);
      const tx = await executeSwap(tokenAmount, minUsdtOutStr, signer);
      setTxHash(tx.hash);
      await tx.wait();

      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#d946ef', '#10b981'],
      });

      setSuccessMessage(`Swap Successful! Swapped ${tokenAmount} INF for ≈ ${netUsdt.toFixed(2)} USDT.`);
      onRefreshData();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Swap transaction failed or was rejected.');
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-orbitron">
          <Repeat className="w-3.5 h-3.5" />
          <span>ON-CHAIN DEX SWAP & PROTOCOL LIQUIDITY</span>
        </div>
        <h1 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white">
          Infinity Swap Portal
        </h1>
        <p className="text-sm text-slate-400">
          Direct decentralized swap from INF tokens to USDT with automated 5% liquidity and buyback distribution.
        </p>
      </div>

      {/* Main Swap Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-6 border-cyan-500/30 neon-cyan-glow">
        {/* From Token (INF) */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-orbitron text-slate-400">You Pay</span>
            <span className="font-mono text-slate-400">
              Balance: {parseFloat(userData?.tokenBalance || '0').toFixed(2)} INF
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              min="1"
              step="any"
              placeholder="0.0"
              className="w-full bg-transparent text-2xl sm:text-3xl font-mono text-white focus:outline-none"
            />
            <div className="flex items-center space-x-2 shrink-0 px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300">
              <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 font-bold text-xs">
                ∞
              </div>
              <span className="font-orbitron font-bold text-sm">INF</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
            <span>≈ ${grossUsdt.toFixed(2)} USD</span>
            <button
              type="button"
              onClick={() => setTokenAmount(userData?.tokenBalance || '100')}
              className="text-cyan-400 hover:underline text-[11px]"
            >
              Use Max
            </button>
          </div>
        </div>

        {/* Swap Divider Arrow */}
        <div className="flex justify-center -my-3 relative z-10">
          <div className="p-2.5 rounded-2xl bg-slate-900 border border-cyan-500/40 text-cyan-400 shadow-xl">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* To Token (USDT) */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-orbitron text-slate-400">You Receive (Est. Net)</span>
            <span className="font-mono text-slate-400">PoS Tether USD</span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              readOnly
              value={netUsdt.toFixed(4)}
              className="w-full bg-transparent text-2xl sm:text-3xl font-mono text-emerald-400 focus:outline-none"
            />
            <div className="flex items-center space-x-2 shrink-0 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300">
              <div className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center text-slate-950 font-bold text-xs">
                $
              </div>
              <span className="font-orbitron font-bold text-sm">USDT</span>
            </div>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Rate: 1 INF ≈ 0.125 USDT (Polygon PoS)
          </div>
        </div>

        {/* Slippage Settings */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-slate-400 font-orbitron">Slippage Tolerance</span>
          <div className="flex items-center space-x-1.5">
            {['0.5', '1.0', '2.5'].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setSlippage(val)}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-all ${
                  slippage === val
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {val}%
              </button>
            ))}
          </div>
        </div>

        {/* 5% Protocol Fee Distribution Breakdown */}
        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-orbitron text-cyan-300 font-semibold flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>5% Automated Protocol Split</span>
            </span>
            <span className="font-mono text-slate-300">-${protocolFeeUsdt.toFixed(4)} USDT</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-cyan-400 font-bold">2.0%</span>
              <p className="text-[10px] text-slate-400">Buyback</p>
              <p className="text-[9px] text-slate-500">${buybackSplit.toFixed(3)}</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-fuchsia-400 font-bold">1.5%</span>
              <p className="text-[10px] text-slate-400">Liquidity</p>
              <p className="text-[9px] text-slate-500">${liquiditySplit.toFixed(3)}</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-emerald-400 font-bold">1.0%</span>
              <p className="text-[10px] text-slate-400">DAO Pool</p>
              <p className="text-[9px] text-slate-500">${daoSplit.toFixed(3)}</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-indigo-400 font-bold">0.5%</span>
              <p className="text-[10px] text-slate-400">Marketing</p>
              <p className="text-[9px] text-slate-500">${marketingSplit.toFixed(3)}</p>
            </div>
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p>{successMessage}</p>
              {txHash && (
                <a
                  href={`https://polygonscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-[11px] flex items-center space-x-1 mt-1 text-emerald-300"
                >
                  <span>View on Polygonscan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Execute Button */}
        {!walletAddress ? (
          <AnimatedTooltip content="Connect Web3" subtext="Connect Polygon Wallet to Swap" position="top" glowColor="cyan" className="w-full">
            <button
              type="button"
              onClick={onConnectWallet}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-orbitron font-bold text-xs sm:text-sm rounded-2xl neon-cyan-glow hover:scale-[1.01] transition-all cursor-pointer"
            >
              Connect Wallet to Swap
            </button>
          </AnimatedTooltip>
        ) : (
          <AnimatedTooltip content="Confirm DEX Swap" subtext="QuickSwap Router • 5% fee distributed" position="top" glowColor="cyan" className="w-full">
            <button
              type="button"
              onClick={handleSwap}
              disabled={isSwapping || numTokens <= 0}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-orbitron font-bold text-xs sm:text-sm rounded-2xl neon-cyan-glow transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {isSwapping ? 'Executing On-Chain Swap...' : `Swap ${tokenAmount} INF to USDT`}
            </button>
          </AnimatedTooltip>
        )}
      </div>
    </div>
  );
};
