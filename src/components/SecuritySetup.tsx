import React, { useState, useEffect } from 'react';
import { Shield, Key, Download, Upload, AlertTriangle, CheckCircle, Copy, Eye, EyeOff } from 'lucide-react';
import { EncryptionManager } from '../utils/encryption';
import { SecurityManager } from '../utils/security';

interface SecuritySetupProps {
  onComplete: (seedPhrase: string) => void;
  onSkip?: () => void;
}

const SecuritySetup: React.FC<SecuritySetupProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState<'intro' | 'generate' | 'backup' | 'verify' | 'complete'>('intro');
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [verificationWords, setVerificationWords] = useState<string[]>([]);
  const [userVerification, setUserVerification] = useState<string[]>([]);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const encryptionManager = EncryptionManager.getInstance();
  const securityManager = SecurityManager.getInstance();

  useEffect(() => {
    if (step === 'generate') {
      generateSeedPhrase();
    }
  }, [step]);

  const generateSeedPhrase = () => {
    const phrase = encryptionManager.generateSeedPhrase();
    setSeedPhrase(phrase);
    
    // Select 3 random words for verification
    const words = phrase.split(' ');
    const randomIndices = [];
    while (randomIndices.length < 3) {
      const index = Math.floor(Math.random() * words.length);
      if (!randomIndices.includes(index)) {
        randomIndices.push(index);
      }
    }
    
    setVerificationWords(randomIndices.map(i => ({ index: i, word: words[i] })) as any);
    setUserVerification(new Array(3).fill(''));
  };

  const copySeedPhrase = async () => {
    try {
      await navigator.clipboard.writeText(seedPhrase);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy seed phrase:', error);
    }
  };

  const downloadSeedPhrase = () => {
    const blob = new Blob([seedPhrase], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'karmaquest-seed-phrase.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleVerification = () => {
    const words = seedPhrase.split(' ');
    const isCorrect = verificationWords.every((item: any, index) => 
      userVerification[index].toLowerCase().trim() === item.word.toLowerCase()
    );

    if (isCorrect) {
      setStep('complete');
      setTimeout(() => {
        onComplete(seedPhrase);
      }, 2000);
    } else {
      alert('Verification failed. Please check your words and try again.');
    }
  };

  const initializeEncryption = async () => {
    setIsLoading(true);
    try {
      await encryptionManager.initialize(seedPhrase);
      setStep('complete');
    } catch (error) {
      console.error('Failed to initialize encryption:', error);
      alert('Failed to initialize encryption. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'intro':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Secure Your Karma Journey
            </h2>
            
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Your diary entries will be encrypted end-to-end. Only you can read them, 
              not even we can access your private thoughts.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div className="text-left">
                  <h4 className="font-medium text-blue-900 mb-1">Important</h4>
                  <p className="text-sm text-blue-700">
                    You'll receive a 12-word seed phrase. This is the only way to recover your encrypted data. 
                    Store it safely and never share it with anyone.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setStep('generate')}
                className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Set Up Encryption
              </button>
              
              {onSkip && (
                <button
                  onClick={onSkip}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Skip for Now
                </button>
              )}
            </div>
          </div>
        );

      case 'generate':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Key className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Seed Phrase
            </h2>
            
            <p className="text-gray-600 mb-6">
              Write down these 12 words in order and store them safely. 
              You'll need them to recover your account.
            </p>
            
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">Seed Phrase</span>
                <button
                  onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showSeedPhrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {showSeedPhrase ? (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {seedPhrase.split(' ').map((word, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 mb-1">{index + 1}</div>
                      <div className="font-mono font-medium">{word}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 mb-4 py-8">
                  Click the eye icon to reveal your seed phrase
                </div>
              )}
              
              <div className="flex gap-2 justify-center">
                <button
                  onClick={copySeedPhrase}
                  className="flex items-center text-sm text-purple-600 hover:text-purple-700"
                  disabled={!showSeedPhrase}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                
                <button
                  onClick={downloadSeedPhrase}
                  className="flex items-center text-sm text-purple-600 hover:text-purple-700"
                  disabled={!showSeedPhrase}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setStep('backup')}
              disabled={!showSeedPhrase}
              className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              I've Saved My Seed Phrase
            </button>
          </div>
        );

      case 'backup':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verify Your Backup
            </h2>
            
            <p className="text-gray-600 mb-6">
              To make sure you've saved your seed phrase correctly, 
              please enter the following words:
            </p>
            
            <div className="space-y-4 mb-6">
              {verificationWords.map((item: any, index) => (
                <div key={index} className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Word #{item.index + 1}
                  </label>
                  <input
                    type="text"
                    value={userVerification[index]}
                    onChange={(e) => {
                      const newVerification = [...userVerification];
                      newVerification[index] = e.target.value;
                      setUserVerification(newVerification);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter the word"
                  />
                </div>
              ))}
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setStep('generate')}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              
              <button
                onClick={handleVerification}
                disabled={userVerification.some(word => !word.trim())}
                className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify
              </button>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Encryption Enabled!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Your diary entries are now protected with end-to-end encryption. 
              Your privacy is secured.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-700 font-medium">
                  Redirecting to your dashboard...
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default SecuritySetup;