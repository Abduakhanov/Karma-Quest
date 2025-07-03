import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import { SecurityManager } from '../utils/security';

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
  verifySignature: (message: string, signature: string) => Promise<boolean>;
  mintKarmaBadge: (achievementId: string) => Promise<string | null>;
  getUserBadges: () => Promise<any[]>;
  siweLogin: () => Promise<{ message: string; signature: string } | null>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

// Enhanced Karma Badge Contract ABI with security features
const KARMA_BADGE_ABI = [
  "function mint(address to, uint256 tokenId, string memory uri, bytes memory signature) public",
  "function balanceOf(address owner, uint256 id) public view returns (uint256)",
  "function uri(uint256 id) public view returns (string memory)",
  "function setApprovalForAll(address operator, bool approved) public",
  "function isApprovedForAll(address account, address operator) public view returns (bool)",
  "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)",
  "event URI(string value, uint256 indexed id)"
];

const KARMA_BADGE_CONTRACT = "0x1234567890123456789012345678901234567890"; // Mock contract address

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const securityManager = SecurityManager.getInstance();

  useEffect(() => {
    checkConnection();
    setupEventListeners();
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

  const setupEventListeners = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    // Reload the page when chain changes for security
    window.location.reload();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    setIsConnecting(true);
    
    try {
      // Rate limiting check
      if (!securityManager.checkRateLimit('wallet_connect', 5, 60000)) {
        throw new Error('Too many connection attempts. Please wait a minute.');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      await provider.send("eth_requestAccounts", []);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      // Verify the connection with a simple signature
      const message = `Connect to KarmaQuest at ${new Date().toISOString()}`;
      const signature = await signer.signMessage(message);
      
      // Verify the signature locally
      const recoveredAddress = ethers.verifyMessage(message, signature);
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        throw new Error('Signature verification failed');
      }
      
      setAccount(address);
      setProvider(provider);
      setIsConnected(true);
      
      // Store connection state securely
      localStorage.setItem('web3Connected', 'true');
      localStorage.setItem('web3Address', address);
      
      securityManager.recordLoginAttempt(address, true, {
        userAgent: navigator.userAgent
      });
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      
      if (account) {
        securityManager.recordLoginAttempt(account, false, {
          userAgent: navigator.userAgent
        });
      }
      
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setIsConnected(false);
    localStorage.removeItem('web3Connected');
    localStorage.removeItem('web3Address');
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!provider || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      const signer = await provider.getSigner();
      return await signer.signMessage(message);
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  };

  const verifySignature = async (message: string, signature: string): Promise<boolean> => {
    if (!account) {
      throw new Error('No account connected');
    }

    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === account.toLowerCase();
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  };

  const siweLogin = async (): Promise<{ message: string; signature: string } | null> => {
    if (!provider || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      const nonce = securityManager.generateNonce();
      const domain = window.location.host;
      const origin = window.location.origin;
      
      const siweMessage = new SiweMessage({
        domain,
        address: account,
        statement: 'Sign in to KarmaQuest with Ethereum',
        uri: origin,
        version: '1',
        chainId: await provider.getNetwork().then(n => Number(n.chainId)),
        nonce,
        issuedAt: new Date().toISOString()
      });

      const message = siweMessage.prepareMessage();
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);

      // Verify the signature
      const verification = await securityManager.verifySiweMessage(message, signature);
      if (!verification.valid) {
        throw new Error(verification.error || 'SIWE verification failed');
      }

      return { message, signature };
    } catch (error) {
      console.error('Error with SIWE login:', error);
      throw error;
    }
  };

  const mintKarmaBadge = async (achievementId: string): Promise<string | null> => {
    if (!provider || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      // Rate limiting for minting
      if (!securityManager.checkRateLimit(`mint_${account}`, 10, 3600000)) {
        throw new Error('Minting rate limit exceeded. Please wait an hour.');
      }

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(KARMA_BADGE_CONTRACT, KARMA_BADGE_ABI, signer);
      
      // Generate deterministic token ID
      const tokenId = ethers.keccak256(ethers.toUtf8Bytes(`${achievementId}_${account}`));
      const metadataUri = `https://api.karmaquest.com/metadata/${achievementId}`;
      
      // Create signature for server-side verification
      const message = `mint:${account}:${tokenId}:${achievementId}:${Date.now()}`;
      const signature = await signMessage(message);
      
      // In production, verify with backend before minting
      const tx = await contract.mint(account, tokenId, metadataUri, signature);
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
      
      // In production, query events or use a subgraph
      const badges = [];
      
      // Mock data for demonstration
      const mockBadges = [
        { 
          id: '1', 
          name: 'First Steps', 
          image: '🏆', 
          rarity: 'common',
          tokenId: ethers.keccak256(ethers.toUtf8Bytes('first-steps')),
          mintedAt: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'Task Master', 
          image: '⭐', 
          rarity: 'rare',
          tokenId: ethers.keccak256(ethers.toUtf8Bytes('task-master')),
          mintedAt: new Date().toISOString()
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
    provider,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    signMessage,
    verifySignature,
    mintKarmaBadge,
    getUserBadges,
    siweLogin
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};