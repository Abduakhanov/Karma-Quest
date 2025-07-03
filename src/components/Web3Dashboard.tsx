import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, Award, Coins, ExternalLink, Copy, Check } from 'lucide-react';
import { useWeb3 } from './Web3Provider';

const Web3Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { account, isConnected, connect, disconnect, mintKarmaBadge, getUserBadges } = useWeb3();
  const [badges, setBadges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isConnected) {
      loadUserBadges();
    }
  }, [isConnected]);

  const loadUserBadges = async () => {
    try {
      const userBadges = await getUserBadges();
      setBadges(userBadges);
    } catch (error) {
      console.error('Error loading badges:', error);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await connect();
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMintBadge = async (achievementId: string) => {
    setIsLoading(true);
    try {
      const txHash = await mintKarmaBadge(achievementId);
      if (txHash) {
        console.log('Badge minted successfully:', txHash);
        await loadUserBadges();
      }
    } catch (error) {
      console.error('Minting failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {t('web3.connect')}
        </h3>
        
        <p className="text-gray-600 mb-6">
          Connect your wallet to mint NFT badges and track your on-chain progress
        </p>
        
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('common.loading') : t('web3.connect')}
        </button>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Supported wallets: MetaMask, WalletConnect, Coinbase Wallet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Info */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">Connected Wallet</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm opacity-90">{formatAddress(account!)}</span>
                <button
                  onClick={copyAddress}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={disconnect}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {t('web3.disconnect')}
          </button>
        </div>
      </div>

      {/* NFT Badges */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Award className="w-5 h-5 mr-2 text-purple-600" />
            {t('web3.badges')}
          </h3>
          
          <button
            onClick={() => handleMintBadge('first-steps')}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-transform disabled:opacity-50"
          >
            {isLoading ? t('common.loading') : t('web3.mint')}
          </button>
        </div>
        
        {badges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="bg-gradient-to-br from-purple-50 to-teal-50 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">{badge.image}</div>
                <h4 className="font-medium text-gray-900 text-sm">{badge.name}</h4>
                <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                  badge.rarity === 'rare' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {badge.rarity}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No NFT badges yet</p>
            <p className="text-sm text-gray-500">Complete achievements to mint your first badge!</p>
          </div>
        )}
      </div>

      {/* On-Chain Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Coins className="w-5 h-5 mr-2 text-teal-600" />
          {t('web3.onChain')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{badges.length}</div>
            <div className="text-sm text-gray-600">NFT Badges Owned</div>
          </div>
          
          <div className="bg-teal-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-teal-600">0</div>
            <div className="text-sm text-gray-600">On-Chain XP</div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600">0</div>
            <div className="text-sm text-gray-600">Karma Tokens</div>
          </div>
        </div>
      </div>

      {/* Blockchain Explorer Link */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">View on Blockchain Explorer</h4>
            <p className="text-sm text-gray-600">Track your transactions and NFTs</p>
          </div>
          <button className="flex items-center text-purple-600 hover:text-purple-700 font-medium">
            <ExternalLink className="w-4 h-4 mr-1" />
            Open
          </button>
        </div>
      </div>
    </div>
  );
};

export default Web3Dashboard;