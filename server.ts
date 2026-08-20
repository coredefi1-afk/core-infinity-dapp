import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy-loaded Gemini client
  let geminiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!geminiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not configured');
      }
      geminiClient = new GoogleGenAI({ apiKey });
    }
    return geminiClient;
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      network: 'Polygon Mainnet (Chain ID 137)',
      timestamp: new Date().toISOString(),
    });
  });

  // Protocol Contracts Metadata Endpoint
  app.get('/api/contracts', (req, res) => {
    res.json({
      network: {
        name: 'Polygon PoS Mainnet',
        chainId: 137,
        currency: 'MATIC',
        explorer: 'https://polygonscan.com',
      },
      contracts: {
        enterprise: {
          address: '0x59c3D0aE3a5f51C9Da4685d6F929A3a5F8da73C1',
          name: 'Core Infinity Enterprise Engine',
          description: 'Handles staking, binary volume tracking, rank calculation, earnings capping, and direct token-to-USDT swaps.',
        },
        infinityToken: {
          address: '0x7B36C9Ae762EDB5c4eFb36C070CD2E3593f8dbc9',
          name: 'Infinity Protocol Token (INF)',
          symbol: 'INF',
          decimals: 18,
          description: 'Core utility & governance token for Infinity Protocol.',
        },
        treasury: {
          address: '0x63e082909ceDC328A96c80e8f941C7e672860CC2',
          name: 'Treasury Vault',
          description: 'Yield distribution buffer and multi-sig vault.',
        },
        usdt: {
          address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          name: 'Polygon Tether USD (PoS USDT)',
          symbol: 'USDT',
          decimals: 6,
          description: 'Polygon Native Tether USD token.',
        },
        router: {
          address: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
          name: 'QuickSwap DEX Router v2',
          description: 'Liquidity route aggregator for automated slippage management.',
        },
        sponsor: {
          address: '0xB0Dd6626D9De86047073E62C161B8787C17Eb601',
          name: 'Genesis Root Sponsor Node',
          description: 'Default master upline node for decentralized tree allocation.',
        },
        creator: {
          address: '0xc1c19599c851a4a5ada91ff58749fba0a66f0a42',
          name: 'Protocol Creator & Deployer',
        },
        buybackWallet: {
          address: '0x35521e5657cF9B1658eb8a2E97E68237122d1a5f',
          name: 'Deflationary Buyback Reserve',
        },
        liquidityWallet: {
          address: '0xa72a6De3ebB1050c49fDE04aC5f13B54f3224881',
          name: 'Auto-Liquidity Injection Pool',
        },
        marketingWallet: {
          address: '0x97910BD3Fb11A94aE3AA855C0C37883E324C087A',
          name: 'Ecosystem Expansion & Marketing Pool',
        },
        daoWallet: {
          address: '0x624F24f9509b7419bCF78beec977b982c817207E',
          name: 'Community DAO Governance Treasury',
        },
        emergencyWallet: {
          address: '0xdE9b707C146Be963Ca7FAB5F830AB3721C510D01',
          name: 'Protocol Circuit Breaker & Safety Reserve',
        },
      },
    });
  });

  // AI Protocol Advisor Endpoint using @google/genai
  app.post('/api/ai/protocol-advisor', async (req, res) => {
    try {
      const { question, userContext, mode } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(200).json({
          reply: `### Core Infinity Protocol AI Intelligence (Offline Mode)

**Protocol Status:** Polygon Mainnet Cluster 0x59c3...73C1 Active.

**Key Architecture Metrics:**
- **Standard Staking:** 0.50% daily non-working rewards.
- **Bond Staking:** 0.75% daily accelerated yield.
- **300% Sustainable Cap:** Cumulative payout limit protects liquidity.
- **Binary Engine:** 10% matching volume on weaker leg.
- **5% DEX Split:** 2% Buyback & Burn, 1.5% Liquidity, 1% DAO, 0.5% Marketing.

*Note: Configure \`GEMINI_API_KEY\` in your environment settings for real-time generative neural audits and natural language inquiries.*`,
          mode: mode || 'chat',
          timestamp: new Date().toISOString(),
        });
      }

      const ai = getGeminiClient();

      const systemInstruction = `You are the Core Infinity Protocol AI Chief Strategist & Technical Architect.
You deliver exhaustive, institutional-grade A to Z intelligence, mathematical breakdowns, tokenomic mechanics, binary matrix optimizations, and smart contract security audits for the Core Infinity / Infinity Protocol ecosystem running on Polygon Mainnet.

Full Protocol Architecture & Specifications:
1. Network Layer:
   - Primary: Polygon PoS Mainnet (Chain ID 137). Low latency, sub-cent gas fees. Native token: MATIC/POL.
2. Verified Smart Contract Cluster:
   - Enterprise Master Contract: 0x59c3D0aE3a5f51C9Da4685d6F929A3a5F8da73C1 (Staking, Binary matching, swaps, user registries)
   - Infinity Token (INF): 0x7B36C9Ae762EDB5c4eFb36C070CD2E3593f8dbc9 (18 decimals, core utility & staking asset)
   - Treasury Vault: 0x63e082909ceDC328A96c80e8f941C7e672860CC2 (Yield buffer reserve)
   - Polygon Native USDT: 0xc2132D05D31c914a87C6611C10748AEb04B58e8F (6 decimals, settlement pair)
   - QuickSwap DEX Router v2: 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff
   - Genesis Root Sponsor Node: 0xB0Dd6626D9De86047073E62C161B8787C17Eb601
   - Creator/Deployer: 0xc1c19599c851a4a5ada91ff58749fba0a66f0a42
   - Deflationary Buyback Wallet (2%): 0x35521e5657cF9B1658eb8a2E97E68237122d1a5f
   - Auto-Liquidity Injection Pool (1.5%): 0xa72a6De3ebB1050c49fDE04aC5f13B54f3224881
   - DAO Governance Treasury (1%): 0x624F24f9509b7419bCF78beec977b982c817207E
   - Ecosystem Expansion Marketing (0.5%): 0x97910BD3Fb11A94aE3AA855C0C37883E324C087A
   - Circuit Breaker Emergency Wallet: 0xdE9b707C146Be963Ca7FAB5F830AB3721C510D01

3. Staking & Yield Mechanics:
   - Minimum Deposit: 10 INF.
   - Dual-Staking Modes:
     * Standard Flexible Stake: 0.50% daily non-working rewards.
     * Bond Stake: 0.75% daily accelerated yield with locked commitment.
   - 300% Maximum Return Cap Algorithm: All cumulative earnings (Non-working daily yield + Working binary matching commissions) are capped at exactly 3x (300%) of the active stake deposit. Once reached, a user must re-stake to reset cap headroom and continue generating network revenue.

4. Binary Matrix & Growth Engine:
   - Binary Tree structure (Left Leg and Right Leg).
   - Working Commissions: 10% matching bonus applied to the weaker leg volume on each cycle.
   - Automated spillover from parent nodes down the binary tree.

5. 5% Automated DEX Swap Protocol Split:
   - Direct swap from INF to USDT via Enterprise contract.
   - 5.0% total protocol fee dynamically routed:
     * 2.0% -> Automated Market Buyback & Burn (Deflationary pressure)
     * 1.5% -> Auto-Liquidity Injection into QuickSwap LP
     * 1.0% -> DAO Governance Community Treasury
     * 0.5% -> Protocol Expansion & Marketing

6. Rank Tiers & DAO Governance:
   - Tiers: Unranked -> Genesis Node -> Pioneer Sentinel -> Vanguard Titan -> Apex Governor -> Infinity Ambassador.
   - Unlocks voting power, higher referral depth allowances, and exclusive dividend distribution.

Formatting & Tone:
- Deliver structured, crisp markdown with clear headers, tables, mathematical formulations, key takeaways, and tactical action items.
- Maintain a security-first, analytical, and authoritative tone.`;

      let userPrompt = '';

      if (mode === 'full_a_to_z') {
        userPrompt = `Perform a FULL A TO Z COMPREHENSIVE PROTOCOL REPORT of the Core Infinity / Infinity Protocol ecosystem.

Cover every critical dimension in depth:
- A: Architecture & Polygon Layer-2 Infrastructure
- B: Binary Tree Matrix & 10% Weaker Leg Matching Engine
- C: Capping Safeguards & The 300% Anti-Inflation Algorithm
- D: Dual-Staking Modes (Standard 0.50%/day vs Bond 0.75%/day) & Yield Compounding
- E: Economic Tokenomics, Deflationary Buybacks & 5% Swap Split Matrix
- F: Financial Projections, ROI Models & Break-even Timelines for Stakers
- G: Governance, DAO Partner Criteria & Protocol Rank Ladders
- H: Health Checks, Multi-Sig Audits & Circuit Breaker Risk Mitigations
- I: Infinity Utility & Secondary DEX Liquidity on QuickSwap
- J to Z: Journey to Decentralization, Smart Contract Verification & Tactical Playbook for Network Leaders

Provide explicit mathematical formulas, flow diagrams in ASCII/Markdown, and practical yield optimization frameworks.`;
      } else if (mode === 'portfolio_audit') {
        userPrompt = `Analyze the following connected user's real-time on-chain position:
${JSON.stringify(userContext || {}, null, 2)}

Provide a custom DIAGNOSTIC & ACTIONABLE ROADMAP:
1. Current Position Breakdown (Staked amount, earnings earned vs remaining 300% cap headroom).
2. Binary Matrix Imbalance Analysis (Left volume vs Right volume gap and exact actions needed to trigger 10% matching bonuses).
3. Projected Yield Timeline (Daily/Monthly forecasts under Standard vs Bond modes).
4. Rank Advancement Roadmap (What volume is required to reach the next tier).
5. Immediate 3-Step Strategy Recommendation for this specific user.`;
      } else {
        userPrompt = `User Context: ${JSON.stringify(userContext || {})}
User Query: ${question || 'Explain the Core Infinity Protocol mechanics'}

Provide a tactical, in-depth protocol analysis or step-by-step guidance.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || 'Unable to generate response at this time.';
      res.json({ reply, mode: mode || 'chat', timestamp: new Date().toISOString() });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({
        error: error?.message || 'Failed to communicate with AI Protocol Advisor',
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Core Infinity Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
