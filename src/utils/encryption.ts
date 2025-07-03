import { AESGCM } from '@stablelib/aes-gcm';
import { randomBytes } from '@stablelib/random';
import { encode as encodeBase64, decode as decodeBase64 } from '@stablelib/base64';
import { encode as encodeUTF8, decode as decodeUTF8 } from '@stablelib/utf8';

export interface EncryptedData {
  ciphertext: string;
  nonce: string;
  keyId: string;
}

export interface EncryptionKey {
  id: string;
  key: Uint8Array;
  createdAt: Date;
}

export class EncryptionManager {
  private static instance: EncryptionManager;
  private masterKey: Uint8Array | null = null;
  private keys: Map<string, EncryptionKey> = new Map();

  private constructor() {}

  static getInstance(): EncryptionManager {
    if (!EncryptionManager.instance) {
      EncryptionManager.instance = new EncryptionManager();
    }
    return EncryptionManager.instance;
  }

  /**
   * Initialize encryption with master key
   */
  async initialize(seedPhrase?: string): Promise<void> {
    if (seedPhrase) {
      this.masterKey = await this.deriveKeyFromSeedPhrase(seedPhrase);
    } else {
      // Generate new master key
      this.masterKey = randomBytes(32);
    }

    // Store encrypted master key in localStorage
    await this.storeMasterKey();
  }

  /**
   * Generate a new seed phrase (12 words)
   */
  generateSeedPhrase(): string {
    const wordList = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
      'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
      'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
      'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
      'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'against', 'age',
      'agent', 'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm',
      'album', 'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost',
      'alone', 'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing',
      'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle',
      'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna',
      'antique', 'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve',
      'april', 'arch', 'arctic', 'area', 'arena', 'argue', 'arm', 'armed',
      'armor', 'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art',
      'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume',
      'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction',
      'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado',
      'avoid', 'awake', 'aware', 'away', 'awesome', 'awful', 'awkward', 'axis'
    ];

    const words: string[] = [];
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      words.push(wordList[randomIndex]);
    }
    
    return words.join(' ');
  }

  /**
   * Derive key from seed phrase using PBKDF2
   */
  private async deriveKeyFromSeedPhrase(seedPhrase: string): Promise<Uint8Array> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(seedPhrase),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    const salt = encoder.encode('karmaquest-salt-v1');
    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const exported = await crypto.subtle.exportKey('raw', derivedKey);
    return new Uint8Array(exported);
  }

  /**
   * Store master key encrypted in localStorage
   */
  private async storeMasterKey(): Promise<void> {
    if (!this.masterKey) throw new Error('Master key not initialized');

    // For now, store base64 encoded (in production, this should be encrypted with device key)
    const encoded = encodeBase64(this.masterKey);
    localStorage.setItem('karmaquest-master-key', encoded);
  }

  /**
   * Load master key from localStorage
   */
  async loadMasterKey(): Promise<boolean> {
    const stored = localStorage.getItem('karmaquest-master-key');
    if (!stored) return false;

    try {
      this.masterKey = decodeBase64(stored);
      return true;
    } catch (error) {
      console.error('Failed to load master key:', error);
      return false;
    }
  }

  /**
   * Generate a new encryption key for data
   */
  generateDataKey(): EncryptionKey {
    const keyId = this.generateKeyId();
    const key = randomBytes(32);
    const encryptionKey: EncryptionKey = {
      id: keyId,
      key,
      createdAt: new Date()
    };

    this.keys.set(keyId, encryptionKey);
    return encryptionKey;
  }

  /**
   * Encrypt data with AES-GCM
   */
  async encryptData(data: string, keyId?: string): Promise<EncryptedData> {
    if (!this.masterKey) throw new Error('Encryption not initialized');

    let encryptionKey: EncryptionKey;
    
    if (keyId && this.keys.has(keyId)) {
      encryptionKey = this.keys.get(keyId)!;
    } else {
      encryptionKey = this.generateDataKey();
    }

    const nonce = randomBytes(12);
    const plaintext = encodeUTF8(data);
    
    const aes = new AESGCM(encryptionKey.key);
    const ciphertext = aes.seal(nonce, plaintext);

    return {
      ciphertext: encodeBase64(ciphertext),
      nonce: encodeBase64(nonce),
      keyId: encryptionKey.id
    };
  }

  /**
   * Decrypt data with AES-GCM
   */
  async decryptData(encryptedData: EncryptedData): Promise<string> {
    if (!this.masterKey) throw new Error('Encryption not initialized');

    const encryptionKey = this.keys.get(encryptedData.keyId);
    if (!encryptionKey) throw new Error('Encryption key not found');

    const nonce = decodeBase64(encryptedData.nonce);
    const ciphertext = decodeBase64(encryptedData.ciphertext);

    const aes = new AESGCM(encryptionKey.key);
    const plaintext = aes.open(nonce, ciphertext);

    if (!plaintext) throw new Error('Decryption failed');

    return decodeUTF8(plaintext);
  }

  /**
   * Export encrypted keys for backup
   */
  async exportKeys(): Promise<string> {
    if (!this.masterKey) throw new Error('Encryption not initialized');

    const keysData = Array.from(this.keys.entries()).map(([id, key]) => ({
      id,
      key: encodeBase64(key.key),
      createdAt: key.createdAt.toISOString()
    }));

    const dataToEncrypt = JSON.stringify(keysData);
    const encrypted = await this.encryptWithMasterKey(dataToEncrypt);
    return encodeBase64(encrypted);
  }

  /**
   * Import encrypted keys from backup
   */
  async importKeys(encryptedKeys: string): Promise<void> {
    if (!this.masterKey) throw new Error('Encryption not initialized');

    try {
      const encrypted = decodeBase64(encryptedKeys);
      const decrypted = await this.decryptWithMasterKey(encrypted);
      const keysData = JSON.parse(decrypted);

      this.keys.clear();
      for (const keyData of keysData) {
        this.keys.set(keyData.id, {
          id: keyData.id,
          key: decodeBase64(keyData.key),
          createdAt: new Date(keyData.createdAt)
        });
      }
    } catch (error) {
      throw new Error('Failed to import keys: ' + error);
    }
  }

  /**
   * Encrypt data directly with master key
   */
  private async encryptWithMasterKey(data: string): Promise<Uint8Array> {
    if (!this.masterKey) throw new Error('Master key not available');

    const nonce = randomBytes(12);
    const plaintext = encodeUTF8(data);
    
    const aes = new AESGCM(this.masterKey);
    const ciphertext = aes.seal(nonce, plaintext);

    // Prepend nonce to ciphertext
    const result = new Uint8Array(nonce.length + ciphertext.length);
    result.set(nonce);
    result.set(ciphertext, nonce.length);
    
    return result;
  }

  /**
   * Decrypt data directly with master key
   */
  private async decryptWithMasterKey(encryptedData: Uint8Array): Promise<string> {
    if (!this.masterKey) throw new Error('Master key not available');

    const nonce = encryptedData.slice(0, 12);
    const ciphertext = encryptedData.slice(12);

    const aes = new AESGCM(this.masterKey);
    const plaintext = aes.open(nonce, ciphertext);

    if (!plaintext) throw new Error('Decryption failed');

    return decodeUTF8(plaintext);
  }

  /**
   * Generate unique key ID
   */
  private generateKeyId(): string {
    return 'key_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Clear all keys and master key (logout)
   */
  clear(): void {
    this.masterKey = null;
    this.keys.clear();
    localStorage.removeItem('karmaquest-master-key');
  }

  /**
   * Check if encryption is initialized
   */
  isInitialized(): boolean {
    return this.masterKey !== null;
  }
}