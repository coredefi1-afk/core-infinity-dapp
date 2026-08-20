import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { SideDrawer } from './components/SideDrawer';
import { HeroSection } from './components/HeroSection';
import { DashboardView } from './components/DashboardView';
import { StakingHub } from './components/StakingHub';
import { SwapPortal } from './components/SwapPortal';
import { LearningHub } from './components/LearningHub';
import { ContractInspector } from './components/ContractInspector';
import { ReferralHub } from './components/ReferralHub';
import { AIAnalyzerHub } from './components/AIAnalyzerHub';
import { Footer } from './components/Footer';
import { ActiveTab, UserContractData, ProtocolStats } from './types';
import {
  connectWallet,
  fetchUserData,
  fetchProtocolStats,
  getWeb3Provider,
  executeStake,
  executeSwap,
  approveInfinityTokens,
} from './services/web3';
import { CONTRACT_ADDRESSES } from './config/contracts';
import { ethers } from 'ethers';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [userData, setUserData] = useState<UserContractData | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [protocolStats, setProtocolStats] = useState<ProtocolStats>({
    totalStakedINF: 2845000,
    totalHolders: 12450,
    infPriceUsdt: 0.125,
    maticPriceUsd: 0.58,
    totalDistributedUsdt: 345080,
    contractStatus: 'Active',
  });

  // Load protocol stats on startup
  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await fetchProtocolStats();
        setProtocolStats(stats);
      } catch (err) {
        console.warn('Protocol stats fetch fallback:', err);
      }
    }
    loadStats();
  }, []);

  // Sync user data
  const refreshUserData = useCallback(async (address?: string) => {
    const targetAddr = address || walletAddress;
    if (!targetAddr) return;

    setIsLoadingData(true);
    try {
      const data = await fetchUserData(targetAddr, provider || undefined);
      setUserData(data);
    } catch (err) {
      console.error('Error refreshing on-chain data:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, [walletAddress, provider]);

  // Connect wallet handler
  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      if (window.ethereum) {
        const result = await connectWallet();
        setWalletAddress(result.address);
        setProvider(result.provider);
        setSigner(result.signer);
        await refreshUserData(result.address);
      } else {
        // Fallback for browsers without wallet extension: Simulate demonstration wallet or prompt installation
        alert('No Web3 wallet extension found. Connecting to Polygon Mainnet read-only node.');
        const dummyDemoAddr = '0xB0Dd6626D9De86047073E62C161B8787C17Eb601';
        setWalletAddress(dummyDemoAddr);
        await refreshUserData(dummyDemoAddr);
      }
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      alert(err?.message || 'Connection rejected or failed.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    setWalletAddress(null);
    setSigner(null);
    setUserData(null);
  };

  // Quick Stake from Menu Drawer
  const handleQuickStake = async (amount: string) => {
    if (!walletAddress || !signer) {
      await handleConnectWallet();
      return;
    }
    try {
      setIsLoadingData(true);
      const approveTx = await approveInfinityTokens(amount, signer);
      await approveTx.wait();
      const stakeTx = await executeStake(amount, false, CONTRACT_ADDRESSES.sponsor, signer);
      await stakeTx.wait();
      alert(`Staking Successful! ${amount} INF staked on Polygon.`);
      refreshUserData();
      setIsMenuOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Quick staking failed.');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Quick Swap from Menu Drawer
  const handleQuickSwap = async (amount: string) => {
    if (!walletAddress || !signer) {
      await handleConnectWallet();
      return;
    }
    try {
      setIsLoadingData(true);
      const swapTx = await executeSwap(amount, '0', signer);
      await swapTx.wait();
      alert(`Swap Successful! ${amount} INF converted to USDT on Polygon.`);
      refreshUserData();
      setIsMenuOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Quick swap failed.');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Listen to account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          refreshUserData(accounts[0]);
        } else {
          handleDisconnectWallet();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [refreshUserData]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between cyber-grid relative selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onToggleMenu={() => setIsMenuOpen(true)}
        walletAddress={walletAddress}
        userData={userData}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
        isConnecting={isConnecting}
      />

      {/* Slide-out Menu Drawer */}
      <SideDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        setActiveTab={setActiveTab}
        onRefreshDashboard={() => refreshUserData()}
        onQuickStake={handleQuickStake}
        onQuickSwap={handleQuickSwap}
        walletAddress={walletAddress}
        userData={userData}
      />

      {/* Main Content Area with Framer Motion AnimatePresence slide-fade transitions */}
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto w-full min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14, scale: 0.995 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.28,
                ease: [0.16, 1, 0.3, 1], // fluid cubic ease-out
              },
            }}
            exit={{
              opacity: 0,
              y: -10,
              scale: 0.995,
              transition: {
                duration: 0.18,
                ease: 'easeIn',
              },
            }}
            className="w-full"
          >
            {activeTab === 'home' && (
              <HeroSection
                setActiveTab={setActiveTab}
                onConnectWallet={handleConnectWallet}
                walletAddress={walletAddress}
                protocolStats={protocolStats}
              />
            )}

            {activeTab === 'dashboard' && (
              <DashboardView
                userData={userData}
                walletAddress={walletAddress}
                onRefresh={() => refreshUserData()}
                isLoading={isLoadingData}
                setActiveTab={setActiveTab}
                onConnectWallet={handleConnectWallet}
              />
            )}

            {activeTab === 'stake' && (
              <StakingHub
                walletAddress={walletAddress}
                userData={userData}
                onRefreshData={() => refreshUserData()}
                onConnectWallet={handleConnectWallet}
                signer={signer}
              />
            )}

            {activeTab === 'swap' && (
              <SwapPortal
                walletAddress={walletAddress}
                userData={userData}
                onRefreshData={() => refreshUserData()}
                onConnectWallet={handleConnectWallet}
                signer={signer}
              />
            )}

            {activeTab === 'referrals' && (
              <ReferralHub
                walletAddress={walletAddress}
                userData={userData}
                onConnectWallet={handleConnectWallet}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'learning' && <LearningHub />}

            {activeTab === 'contracts' && <ContractInspector />}

            {activeTab === 'ai' && (
              <AIAnalyzerHub
                userData={userData}
                walletAddress={walletAddress}
                onConnectWallet={handleConnectWallet}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
