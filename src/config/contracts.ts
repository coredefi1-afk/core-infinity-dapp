export const POLYGON_CHAIN_ID = 137;
export const POLYGON_CHAIN_ID_HEX = '0x89';

export const POLYGON_NETWORK_CONFIG = {
  chainId: POLYGON_CHAIN_ID_HEX,
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: [
    'https://polygon-rpc.com',
    'https://rpc.ankr.com/polygon',
    'https://1rpc.io/matic',
    'https://polygon.llamarpc.com'
  ],
  blockExplorerUrls: ['https://polygonscan.com'],
};

export const CONTRACT_ADDRESSES = {
  buybackWallet: '0x35521e5657cF9B1658eb8a2E97E68237122d1a5f',
  liquidityWallet: '0xa72a6De3ebB1050c49fDE04aC5f13B54f3224881',
  marketingWallet: '0x97910BD3Fb11A94aE3AA855C0C37883E324C087A',
  daoWallet: '0x624F24f9509b7419bCF78beec977b982c817207E',
  emergencyWallet: '0xdE9b707C146Be963Ca7FAB5F830AB3721C510D01',
  infinityToken: '0x7B36C9Ae762EDB5c4eFb36C070CD2E3593f8dbc9',
  treasury: '0x63e082909ceDC328A96c80e8f941C7e672860CC2',
  enterprise: '0x59c3D0aE3a5f51C9Da4685d6F929A3a5F8da73C1',
  usdt: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  router: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
  sponsor: '0xB0Dd6626D9De86047073E62C161B8787C17Eb601',
  creator: '0xc1c19599c851a4a5ada91ff58749fba0a66f0a42',
};

// Enterprise ABI matching Polygon deployment
export const ENTERPRISE_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'bool', name: '_isBond', type: 'bool' },
      { internalType: 'address', name: '_upline', type: 'address' },
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_tokenAmount', type: 'uint256' },
      { internalType: 'uint256', name: '_minUsdtOut', type: 'uint256' },
    ],
    name: 'swapTokenToUSDT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'users',
    outputs: [
      { internalType: 'uint256', name: 'selfStake', type: 'uint256' },
      { internalType: 'uint256', name: 'nonWorkingEarnings', type: 'uint256' },
      { internalType: 'uint256', name: 'workingEarnings', type: 'uint256' },
      { internalType: 'address', name: 'upline', type: 'address' },
      { internalType: 'address', name: 'sponsor', type: 'address' },
      { internalType: 'uint256', name: 'leftVolume', type: 'uint256' },
      { internalType: 'uint256', name: 'rightVolume', type: 'uint256' },
      { internalType: 'uint8', name: 'rank', type: 'uint8' },
      { internalType: 'uint256', name: 'lastWithdrawTime', type: 'uint256' },
      { internalType: 'bool', name: 'isValidStaker', type: 'bool' },
      { internalType: 'bool', name: 'isDaoMember', type: 'bool' },
      { internalType: 'bool', name: 'isDaoPartner', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

// Standard ERC20 / Infinity Token ABI
export const TOKEN_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

export const RANK_NAMES = [
  'Unranked Member',
  'Genesis Node',
  'Pioneer Sentinel',
  'Vanguard Titan',
  'Apex Governor',
  'Infinity Ambassador',
];
