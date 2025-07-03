import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay if user hasn't dismissed it
      const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-dismissed');
      if (!hasSeenPrompt) {
        setTimeout(() => setShowPrompt(true), 5000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-dismissed', 'true');
  };

  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-50 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-teal-600 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Install KarmaQuest</h3>
            <p className="text-sm text-gray-600">Get the full app experience</p>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          <span>Works offline</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          <span>Push notifications</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          <span>Faster loading</span>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={handleInstall}
          className="flex-1 bg-gradient-to-r from-purple-600 to-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:scale-105 transition-transform flex items-center justify-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Later
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;