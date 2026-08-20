export interface UserContractData {
  selfStake: string; // formatted in INF
  selfStakeRaw: string;
  nonWorkingEarnings: string;
  nonWorkingEarningsRaw: string;
  workingEarnings: string;
  workingEarningsRaw: string;
  upline: string;
  sponsor: string;
  leftVolume: string;
  rightVolume: string;
  rank: number;
  lastWithdrawTime: number;
  isValidStaker: boolean;
  isDaoMember: boolean;
  isDaoPartner: boolean;
  tokenBalance: string;
  maticBalance: string;
  usdtBalance: string;
}

export interface ContractAddresses {
  buybackWallet: string;
  liquidityWallet: string;
  marketingWallet: string;
  daoWallet: string;
  emergencyWallet: string;
  infinityToken: string;
  treasury: string;
  enterprise: string;
  usdt: string;
  router: string;
  sponsor: string;
  creator: string;
}

export interface StakingTier {
  name: string;
  minAmount: number;
  dailyRate: string;
  durationDays: number;
  capMultiplier: number;
  features: string[];
}

export interface ProtocolStats {
  totalStakedINF: number;
  totalHolders: number;
  infPriceUsdt: number;
  maticPriceUsd: number;
  totalDistributedUsdt: number;
  contractStatus: 'Active' | 'Optimized' | 'Paused';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedAction?: string;
}

export type ActiveTab = 'home' | 'dashboard' | 'stake' | 'swap' | 'learning' | 'contracts' | 'referrals' | 'ai';
