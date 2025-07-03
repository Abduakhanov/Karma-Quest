import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
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

// Mock Karma Badge Contract ABI (simplified)
const KARMA_BADGE_ABI = [
  "function mint(address to, uint256 tokenId, string memory uri) public",
  "function balanceOf(address owner, uint256 id) public view returns (uint256)",
  "function uri(uint256 id) public view returns (string memory)",
  "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)"
];

const KARMA_BADGE_CONTRACT = "0x1234567890123456789012345678901234567890"; // Mock contract address

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if already connected
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
          setProvider(provider);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        setAccount(address);
        setProvider(provider);
        setIsConnected(true);
        
        // Store connection state
        localStorage.setItem('web3Connected', 'true');
      } catch (error) {
        console.error('Error connecting wallet:', error);
        throw error;
      }
    } else {
      throw new Error('MetaMask is not installed');
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setIsConnected(false);
    localStorage.removeItem('web3Connected');
  };

  const mintKarmaBadge = async (achievementId: string): Promise<string | null> => {
    if (!provider || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(KARMA_BADGE_CONTRACT, KARMA_BADGE_ABI, signer);
      
      // Generate token ID based on achievement
      const tokenId = ethers.keccak256(ethers.toUtf8Bytes(achievementId));
      const metadataUri = `https://api.karmaquest.com/metadata/${achievementId}`;
      
      const tx = await contract.mint(account, tokenId, metadataUri);
      const receipt = await tx.wait();
      
      return receipt.hash;
    } catch (error) {
      console.error('Error minting badge:', error);
      return null;
    }
  };

  const getUserBadges = async (): Promise<any[]> => {
    if (!provider || !account) {
      return [];
    }

    try {
      const contract = new ethers.Contract(KARMA_BADGE_CONTRACT, KARMA_BADGE_ABI, provider);
      
      // This is a simplified implementation
      // In reality, you'd query events or use a subgraph
      const badges = [];
      
      // Mock data for demonstration
      const mockBadges = [
        { id: '1', name: 'First Steps', image: '🏆', rarity: 'common' },
        { id: '2', name: 'Task Master', image: '⭐', rarity: 'rare' }
      ];
      
      return mockBadges;
    } catch (error) {
      console.error('Error fetching badges:', error);
      return [];
    }
  };

  const value: Web3ContextType = {
    account,
    provider,
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