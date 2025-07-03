import React, { createContext, useContext, useState, useEffect } from 'react';

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  mintKarmaBadge: (achievementId: string) => Promise<string | null>;
  getUserBadges: () => Promise<any[]>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        localStorage.setItem('web3Connected', 'true');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
    localStorage.removeItem('web3Connected');
  };

  const mintKarmaBadge = async (achievementId: string): Promise<string | null> => {
    if (!account) {
      throw new Error('Wallet not connected');
    }

    try {
      // Mock implementation for demo
      console.log('Minting badge for achievement:', achievementId);
      
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return '0x' + Math.random().toString(16).substr(2, 64);
    } catch (error) {
      console.error('Error minting badge:', error);
      return null;
    }
  };

  const getUserBadges = async (): Promise<any[]> => {
    if (!account) {
      return [];
    }

    try {
      // Mock data for demonstration
      const mockBadges = [
        { 
          id: '1', 
          name: 'First Steps', 
          image: '🏆', 
          rarity: 'common'
        },
        { 
          id: '2', 
          name: 'Task Master', 
          image: '⭐', 
          rarity: 'rare'
        }
      ];
      
      return mockBadges;
    } catch (error) {
      console.error('Error fetching badges:', error);
      return [];
    }
  };

  const value: Web3ContextType = {
    account,
    isConnected,
    connect,
    disconnect,
    mintKarmaBadge,
    getUserBadges
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};