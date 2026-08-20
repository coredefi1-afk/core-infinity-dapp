import React, { useState, useEffect } from 'react';
import {
  Layers,
  Zap,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lock,
  Unlock,
  Calculator,
  ArrowRight,
  ExternalLink,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserContractData } from '../types';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import {
  approveInfinityTokens,
  executeStake,
  checkTokenAllowance,
} from '../services/web3';
import { ethers } from 'ethers';
import { AnimatedTooltip } from './Tooltip';

interface StakingHubProps {
  walletAddress: string | null;
  userData: UserContractData | null;
  onRefreshData: () => void;
  onConnectWallet: () => void;
  signer: ethers.Signer | null;
}

export const StakingHub: React.FC<StakingHubProps> = ({
  walletAddress,
  userData,
  onRefreshData,
  onConnectWallet,
  signer,
}) => {
  const [amount, setAmount] = useState('100');
  const [isBond, setIsBond] = useState(false);
  const [upline, setUpline] = useState(CONTRACT_ADDRESSES.sponsor);
  const [isApproving, setIsApproving] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [allowance, setAllowance] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check URL ref query parameter on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref');
      if (ref && ethers.utils.isAddress(ref)) {
        setUpline(ref);
      }
    }
  }, []);

  // Check token allowance when wallet or amount changes
  useEffect(() => {
    async function checkAllowance() {
      if (walletAddress) {
        try {
          const currentAllowance = await checkTokenAllowance(walletAddress);
          setAllowance(currentAllowance);
        } catch (err) {
          console.error('Error checking allowance:', err);
        }
      }
    }
    checkAllowance();
  }, [walletAddress, txHash]);

  const numAmount = parseFloat(amount) || 0;
  const minRequired = 10;
  const isAmountValid = numAmount >= minRequired;

  // Staking math projections
  const dailyRatePercent = isBond ? 0.75 : 0.5; // 0.75% daily for bond vs 0.5% daily standard
  const estimatedDailyInf = (numAmount * dailyRatePercent) / 100;
  const estimatedMonthlyInf = estimatedDailyInf * 30;
  const maxReturnCap = numAmount * 3; // 300% Cap

  const needsApproval = () => {
    if (!amount || numAmount <= 0) return false;
    try {
      const parsed = ethers.utils.parseEther(amount);
      return allowance.lt(parsed);
    } catch {
      return false;
    }
  };

  const handleApprove = async () => {
    if (!signer || !walletAddress) {
      onConnectWallet();
      return;
    }
    if (!isAmountValid) {
      setErrorMessage(`Minimum staking amount is ${minRequired} INF.`);
      return;
    }

    try {
      setErrorMessage(null);
      setIsApproving(true);
      const tx = await approveInfinityTokens(amount, signer);
      await tx.wait();
      setSuccessMessage('Token Approval confirmed on Polygon Mainnet!');
      const newAllowance = await checkTokenAllowance(walletAddress);
      setAllowance(newAllowance);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Token approval transaction was rejected or failed.');
    } finally {
      setIsApproving(false);
    }
  };

  const handleStake = async () => {
    if (!signer || !walletAddress) {
      onConnectWallet();
      return;
    }
    if (!isAmountValid) {
      setErrorMessage(`Minimum staking amount is ${minRequired} INF.`);
      return;
    }

    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsStaking(true);

      const targetUpline = ethers.utils.isAddress(upline) ? upline : CONTRACT_ADDRESSES.sponsor;
      const tx = await executeStake(amount, isBond, targetUpline, signer);
      setTxHash(tx.hash);
      await tx.wait();

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#d946ef', '#10b981', '#ffffff'],
      });

      setSuccessMessage(`Staking Successful! ${amount} INF staked into Enterprise contract.`);
      onRefreshData();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Staking transaction failed. Please check MATIC gas and try again.');
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 text-xs font-orbitron">
          <Layers className="w-3.5 h-3.5" />
          <span>POLYGON ENTERPRISE STAKING ENGINE</span>
        </div>
        <h1 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white">
          Infinity Yield Staking Hub
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Deposit INF tokens directly to earn daily non-working yields, binary matching commissions, and accelerate protocol rank perks with strict 300% capping.
        </p>
      </div>

      {/* Main Grid: Form & Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Staking Form */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl glass-panel space-y-6 border-cyan-500/30">
          {/* Staking Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-orbitron text-slate-300 flex items-center justify-between">
              <span>Select Staking Strategy</span>
              <span className="text-[10px] text-cyan-400 font-mono">Dual-Engine</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsBond(false)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  !isBond
                    ? 'bg-cyan-500/15 border-cyan-400 text-white neon-cyan-glow'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Unlock className="w-4 h-4 text-cyan-400" />
                  <span className="font-orbitron font-bold text-xs">Standard Stake</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Flexible daily rewards (0.50% / day)</p>
              </button>

              <button
                type="button"
                onClick={() => setIsBond(true)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isBond
                    ? 'bg-fuchsia-500/15 border-fuchsia-400 text-white neon-magenta-glow'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-fuchsia-400" />
                  <span className="font-orbitron font-bold text-xs">Bond Stake</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Accelerated yield (0.75% / day)</p>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-orbitron text-slate-300">Deposit Amount (INF)</label>
              <span className="text-slate-400 font-mono text-[11px]">
                Available: {parseFloat(userData?.tokenBalance || '0').toFixed(2)} INF
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="10"
                step="any"
                placeholder="Enter amount (min 10)"
                className="w-full bg-slate-950 border border-cyan-500/40 p-3.5 rounded-2xl text-base font-mono text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <div className="absolute right-3 top-3 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setAmount(userData?.tokenBalance || '100')}
                  className="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-[10px] font-orbitron hover:bg-cyan-500/30"
                >
                  MAX
                </button>
                <span className="font-orbitron font-bold text-xs text-cyan-400">INF</span>
              </div>
            </div>

            {/* Quick Amount Preset Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[10, 50, 100, 500, 1000, 5000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val.toString())}
                  className={`px-3 py-1 rounded-xl text-xs font-mono transition-all ${
                    amount === val.toString()
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {val} INF
                </button>
              ))}
            </div>
          </div>

          {/* Upline Sponsor Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-orbitron text-slate-300">Sponsor / Upline Node</label>
              <span className="text-[10px] text-slate-500 font-mono">Default: Genesis Node</span>
            </div>
            <input
              type="text"
              value={upline}
              onChange={(e) => setUpline(e.target.value)}
              placeholder="0x..."
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Status / Error feedback */}
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
                    <span>View Transaction on Polygonscan</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons: 2-Step Flow (Approve -> Stake) */}
          <div className="pt-2 space-y-3">
            {!walletAddress ? (
              <AnimatedTooltip content="Connect Web3" subtext="MetaMask / Trust Wallet on Polygon" position="top" glowColor="cyan" className="w-full">
                <button
                  type="button"
                  onClick={onConnectWallet}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-orbitron font-bold text-xs sm:text-sm rounded-2xl neon-cyan-glow hover:scale-[1.01] transition-all cursor-pointer"
                >
                  Connect Polygon Wallet to Stake
                </button>
              </AnimatedTooltip>
            ) : needsApproval() ? (
              <AnimatedTooltip content="Step 1: Approve INF" subtext="Grant allowance to Enterprise contract" position="top" glowColor="cyan" className="w-full">
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={isApproving || !isAmountValid}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-orbitron font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isApproving ? 'Approving INF Tokens...' : `Step 1: Approve ${amount} INF Allowance`}
                </button>
              </AnimatedTooltip>
            ) : (
              <AnimatedTooltip content="Step 2: Execute Stake" subtext="Locks position with dual-tier yields & binary caps" position="top" glowColor="fuchsia" className="w-full">
                <button
                  type="button"
                  onClick={handleStake}
                  disabled={isStaking || !isAmountValid}
                  className="w-full py-3.5 bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-orbitron font-bold text-xs sm:text-sm rounded-2xl neon-magenta-glow transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {isStaking ? 'Executing Blockchain Stake...' : `Execute Stake (${amount} INF)`}
                </button>
              </AnimatedTooltip>
            )}
          </div>
        </div>

        {/* Right Column: Projected ROI Calculator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl glass-panel space-y-5 border-fuchsia-500/30">
            <div className="flex items-center space-x-2 text-fuchsia-400">
              <Calculator className="w-5 h-5" />
              <h3 className="font-orbitron font-bold text-base text-white">Projected Yield Simulator</h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Daily Return Rate:</span>
                <span className="font-bold text-cyan-400 font-orbitron text-sm">
                  {dailyRatePercent.toFixed(2)}% / day
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Est. Daily Earnings:</span>
                <span className="font-bold text-white font-mono">
                  {estimatedDailyInf.toFixed(3)} INF (~${(estimatedDailyInf * 0.125).toFixed(3)})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Est. 30-Day Yield:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {estimatedMonthlyInf.toFixed(2)} INF (~${(estimatedMonthlyInf * 0.125).toFixed(2)})
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-gradient-to-br from-fuchsia-950/40 to-slate-950 border border-fuchsia-500/40 flex justify-between items-center">
                <div>
                  <span className="text-[11px] font-orbitron text-fuchsia-300 block">300% Maximum Cap</span>
                  <span className="text-[10px] text-slate-400">Across all network streams</span>
                </div>
                <span className="font-bold font-orbitron text-base text-fuchsia-300">
                  {maxReturnCap.toFixed(1)} INF
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[11px] text-slate-400 flex items-start space-x-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                All payouts are governed by smart contract security rules. Staking requires MATIC gas on Polygon PoS Mainnet.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
