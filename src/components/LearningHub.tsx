import React, { useState } from 'react';
import {
  BookOpen,
  ShieldCheck,
  Zap,
  TrendingUp,
  Layers,
  Repeat,
  Award,
  Users,
  Lock,
  Calculator,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { CONTRACT_ADDRESSES } from '../config/contracts';

export const LearningHub: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [calcStake, setCalcStake] = useState('500');
  const [calcTeamVolume, setCalcTeamVolume] = useState('2000');
  const [calcIsBond, setCalcIsBond] = useState(true);

  // Dynamic simulation math
  const stakeVal = parseFloat(calcStake) || 0;
  const teamVal = parseFloat(calcTeamVolume) || 0;
  const dailyRate = calcIsBond ? 0.0075 : 0.005; // 0.75% or 0.5%
  const dailyReturnInf = stakeVal * dailyRate;
  const binaryBonusInf = teamVal * 0.10; // 10% weaker leg matching
  const maxCapInf = stakeVal * 3; // 300% Cap

  const faqs = [
    {
      q: 'What is Core Infinity / Infinity Protocol on Polygon?',
      a: 'Core Infinity is a decentralized Web3 financial infrastructure deployed on Polygon PoS Mainnet. It combines dual-tier yield staking, automated DEX liquidity splits, and a 300% sustainable return cap engineered into non-custodial smart contracts.',
    },
    {
      q: 'How does the 300% Maximum Return Cap operate?',
      a: 'To guarantee mathematical sustainability and prevent uncontrolled token dilution, all combined rewards (daily staking yield + binary team commissions) are capped at 3x (300%) of the active staked capital. Once this cap is reached, users must re-stake to continue generating rewards.',
    },
    {
      q: 'What is the difference between Standard Stake and Bond Stake?',
      a: 'Standard Staking offers flexible daily rewards (0.50% daily) with standard locking periods. Bond Staking offers higher yield multipliers (0.75% daily) with locked staking terms for long-term protocol backers.',
    },
    {
      q: 'How does the 5% Protocol Fee work during token swaps?',
      a: 'When INF tokens are swapped for USDT via the Enterprise Smart Contract, a 5% fee is automatically distributed by code: 2.0% into the Deflationary Buyback wallet, 1.5% into Automated Liquidity Injection, 1.0% into the Community DAO Treasury, and 0.5% into Marketing & Development.',
    },
    {
      q: 'What are the Rank Tiers and Requirements?',
      a: 'Ranks range from Genesis Node (Level 1) to Apex Governor and Infinity Ambassador (Level 5). Higher ranks unlock DAO governance voting weight, accelerated binary matching depths, and exclusive staking bonus pools.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-orbitron">
          <BookOpen className="w-3.5 h-3.5" />
          <span>PROTOCOL DOCUMENTATION & KNOWLEDGE ACADEMY</span>
        </div>
        <h1 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white">
          Learning Hub & Protocol Guide
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Understand the mathematical architecture, smart contract mechanics, binary volume matching, and sustainable capping rules governing the Infinity Protocol.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-3xl glass-panel space-y-3 border-cyan-500/30">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-orbitron font-bold text-base text-white">1. Dual-Staking Mechanics</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Users deposit INF tokens with a minimum entry threshold of 10 INF. The Enterprise contract automatically calculates non-working rewards and credits your balance transparently on Polygon block intervals.
          </p>
          <ul className="text-xs space-y-1.5 text-slate-400 pt-1">
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>Standard Tier: 0.50% daily rewards</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400"></span>
              <span>Bonded Tier: 0.75% daily accelerated yield</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl glass-panel space-y-3 border-fuchsia-500/30">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-orbitron font-bold text-base text-white">2. The 300% Cap Rule</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            To prevent inflationary spirals, every stake cycle caps total cumulative earnings at 300% of the active capital. This mathematically locks in protocol longevity and sustains secondary market liquidity.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-fuchsia-300">
            Formula: Max Rewards = Staked INF × 3.0
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-panel space-y-3 border-emerald-500/30">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-orbitron font-bold text-base text-white">3. Binary Matching Engine</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Build your decentralized community with left and right placement legs. Working rewards distribute 10% commission on the balanced weaker leg volume on each settlement cycle.
          </p>
          <ul className="text-xs space-y-1.5 text-slate-400 pt-1">
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>10% Binary Matching Bonus</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>Auto-spillover allocation from upline nodes</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl glass-panel space-y-3 border-indigo-500/30">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Repeat className="w-5 h-5" />
            </div>
            <h3 className="font-orbitron font-bold text-base text-white">4. 5% Auto Split Swap</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every direct swap through `swapTokenToUSDT` routes 5% into stability mechanisms: Buyback wallet (2%), Liquidity pool (1.5%), DAO treasury (1%), and Marketing (0.5%).
          </p>
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-indigo-300">
            Immutable contract distribution on Polygon
          </div>
        </div>
      </div>

      {/* Interactive Protocol Calculator */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-6 border-cyan-500/30">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-lg text-white">Interactive Earnings & Cap Simulator</h3>
            <p className="text-xs text-slate-400">Calculate projected daily yields, binary matches, and 300% cycle milestones.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-orbitron text-slate-300">Self Stake Amount (INF)</label>
            <input
              type="number"
              value={calcStake}
              onChange={(e) => setCalcStake(e.target.value)}
              className="w-full bg-slate-950 border border-cyan-500/40 p-2.5 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-orbitron text-slate-300">Team Weaker Volume (INF)</label>
            <input
              type="number"
              value={calcTeamVolume}
              onChange={(e) => setCalcTeamVolume(e.target.value)}
              className="w-full bg-slate-950 border border-fuchsia-500/40 p-2.5 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-fuchsia-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-orbitron text-slate-300">Staking Mode</label>
            <button
              type="button"
              onClick={() => setCalcIsBond(!calcIsBond)}
              className={`w-full p-2.5 rounded-xl text-xs font-orbitron font-bold border transition-all ${
                calcIsBond
                  ? 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-300'
                  : 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
              }`}
            >
              {calcIsBond ? 'Bond Stake (0.75%/d)' : 'Standard (0.50%/d)'}
            </button>
          </div>
        </div>

        {/* Calculation Result Outputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-orbitron block">Daily Non-Working</span>
            <span className="font-mono font-bold text-cyan-400 text-sm">{dailyReturnInf.toFixed(2)} INF</span>
            <p className="text-[9px] text-slate-500">~${(dailyReturnInf * 0.125).toFixed(2)}/day</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-orbitron block">Binary 10% Match</span>
            <span className="font-mono font-bold text-fuchsia-400 text-sm">{binaryBonusInf.toFixed(2)} INF</span>
            <p className="text-[9px] text-slate-500">~${(binaryBonusInf * 0.125).toFixed(2)}</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-orbitron block">30-Day Potential</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {(dailyReturnInf * 30 + binaryBonusInf).toFixed(2)} INF
            </span>
            <p className="text-[9px] text-slate-500">Yield + Commissions</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-orbitron block">300% Cap Limit</span>
            <span className="font-mono font-bold text-amber-400 text-sm">{maxCapInf.toFixed(2)} INF</span>
            <p className="text-[9px] text-slate-500">Max before re-stake</p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        <h3 className="font-orbitron font-bold text-xl text-white text-center">
          Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl glass-panel border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-orbitron font-semibold text-slate-200 hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
