import React, { useState } from 'react';
import {
  FileCode2,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Search,
  Filter,
  Layers,
  Lock,
  Cpu,
} from 'lucide-react';
import { CONTRACT_ADDRESSES } from '../config/contracts';

interface ContractItem {
  key: string;
  name: string;
  category: 'Core Engine' | 'Token & Liquidity' | 'Governance & Security' | 'System Nodes';
  address: string;
  description: string;
  isVerified: boolean;
}

export const ContractInspector: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const contracts: ContractItem[] = [
    {
      key: 'enterprise',
      name: 'Core Infinity Enterprise Contract',
      category: 'Core Engine',
      address: CONTRACT_ADDRESSES.enterprise,
      description: 'Primary protocol state machine: handles stake deposits, dual yield engine, binary volume tracking, user ranks, and token-to-USDT swaps.',
      isVerified: true,
    },
    {
      key: 'infinityToken',
      name: 'Infinity Protocol Token (INF)',
      category: 'Token & Liquidity',
      address: CONTRACT_ADDRESSES.infinityToken,
      description: 'Native ERC20 utility and yield token powering the Core Infinity matrix on Polygon.',
      isVerified: true,
    },
    {
      key: 'treasury',
      name: 'Treasury Reserve Vault',
      category: 'Token & Liquidity',
      address: CONTRACT_ADDRESSES.treasury,
      description: 'Secures protocol reserves and serves as the non-custodial yield buffer for daily returns.',
      isVerified: true,
    },
    {
      key: 'usdt',
      name: 'Polygon Tether USD (USDT)',
      category: 'Token & Liquidity',
      address: CONTRACT_ADDRESSES.usdt,
      description: 'Official Polygon PoS USDT stablecoin contract used as the settlement pairing.',
      isVerified: true,
    },
    {
      key: 'router',
      name: 'QuickSwap DEX Router v2',
      category: 'Token & Liquidity',
      address: CONTRACT_ADDRESSES.router,
      description: 'Polygon decentralized exchange routing aggregator for automated liquidity replenishment.',
      isVerified: true,
    },
    {
      key: 'buybackWallet',
      name: 'Deflationary Buyback Reserve (2%)',
      category: 'Governance & Security',
      address: CONTRACT_ADDRESSES.buybackWallet,
      description: 'Receives 2.0% of every swap fee to execute automated market buybacks and token burns.',
      isVerified: true,
    },
    {
      key: 'liquidityWallet',
      name: 'Auto-Liquidity Injection Pool (1.5%)',
      category: 'Token & Liquidity',
      address: CONTRACT_ADDRESSES.liquidityWallet,
      description: 'Receives 1.5% of swap volume to permanently deepen DEX liquidity pools on Polygon.',
      isVerified: true,
    },
    {
      key: 'daoWallet',
      name: 'DAO Governance Treasury (1.0%)',
      category: 'Governance & Security',
      address: CONTRACT_ADDRESSES.daoWallet,
      description: 'Community-directed multi-sig governance pool for protocol expansion proposals.',
      isVerified: true,
    },
    {
      key: 'marketingWallet',
      name: 'Ecosystem Expansion Wallet (0.5%)',
      category: 'Governance & Security',
      address: CONTRACT_ADDRESSES.marketingWallet,
      description: 'Supports international developer grants, marketing campaigns, and node incentives.',
      isVerified: true,
    },
    {
      key: 'emergencyWallet',
      name: 'Circuit Breaker Safety Reserve',
      category: 'Governance & Security',
      address: CONTRACT_ADDRESSES.emergencyWallet,
      description: 'Cold security reserve dedicated to risk mitigation and emergency liquidity buffers.',
      isVerified: true,
    },
    {
      key: 'sponsor',
      name: 'Genesis Root Sponsor Node',
      category: 'System Nodes',
      address: CONTRACT_ADDRESSES.sponsor,
      description: 'The master upline root for decentralized binary network placement.',
      isVerified: true,
    },
    {
      key: 'creator',
      name: 'Protocol Creator & Deployer',
      category: 'System Nodes',
      address: CONTRACT_ADDRESSES.creator,
      description: 'Original deployer authority address verified on Polygon block explorer.',
      isVerified: true,
    },
  ];

  const handleCopy = (address: string, key: string) => {
    navigator.clipboard.writeText(address);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-orbitron">
          <FileCode2 className="w-3.5 h-3.5" />
          <span>12 VERIFIED POLYGON SMART CONTRACTS</span>
        </div>
        <h1 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white">
          Smart Contract Registry
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Complete transparency and direct on-chain access to all verified contract addresses, vaults, and governance wallets on Polygon PoS Mainnet.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl glass-panel border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by contract name, role, or 0x..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          {['All', 'Core Engine', 'Token & Liquidity', 'Governance & Security', 'System Nodes'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-orbitron whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Contract Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredContracts.map((item) => (
          <div
            key={item.key}
            className="p-5 rounded-3xl glass-panel space-y-3.5 border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-orbitron tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                    {item.category}
                  </span>
                  <h3 className="font-orbitron font-bold text-sm sm:text-base text-white mt-1.5">
                    {item.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-1 text-emerald-400 text-[11px] font-mono shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>

            {/* Address Box */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs font-mono text-cyan-300">
                <span className="truncate mr-2 select-all">{item.address}</span>
                <button
                  onClick={() => handleCopy(item.address, item.key)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-all shrink-0"
                  title="Copy Address"
                >
                  {copiedKey === item.key ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="flex justify-end">
                <a
                  href={`https://polygonscan.com/address/${item.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-cyan-400 font-orbitron transition-colors"
                >
                  <span>View on Polygonscan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
