import React, { useEffect, useState } from 'react';
import { Bell, BellOff, Check, X } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const NotificationManager: React.FC = () => {
  const { notificationsEnabled, setNotificationsEnabled } = useAppStore();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Show prompt if notifications are not enabled and user hasn't been asked
      if (Notification.permission === 'default' && !notificationsEnabled) {
        const hasBeenPrompted = localStorage.getItem('notification-prompted');
        if (!hasBeenPrompted) {
          setTimeout(() => setShowPrompt(true), 5000); // Show after 5 seconds
        }
      }
    }
  }, [notificationsEnabled]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setNotificationsEnabled(true);
        setShowPrompt(false);
        
        // Send welcome notification
        new Notification('KarmaQuest Notifications Enabled! 🎉', {
          body: 'We\'ll remind you to complete your daily karma tasks.',
          icon: '/favicon.ico'
        });
        
        // Schedule daily reminders
        scheduleNotifications();
      }
      
      localStorage.setItem('notification-prompted', 'true');
    }
  };

  const scheduleNotifications = () => {
    // Register service worker for background notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('Service Worker registered:', registration);
      });
    }
  };

  const toggleNotifications = () => {
    if (permission === 'granted') {
      setNotificationsEnabled(!notificationsEnabled);
    } else {
      requestPermission();
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('notification-prompted', 'true');
  };

  if (showPrompt) {
    return (
      <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm z-50">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Bell className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Stay on track with daily reminders
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Get gentle nudges to complete your karma tasks and maintain your streak.
            </p>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={requestPermission}
                className="flex items-center px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Check className="w-3 h-3 mr-1" />
                Enable
              </button>
              <button
                onClick={dismissPrompt}
                className="flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                <X className="w-3 h-3 mr-1" />
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={toggleNotifications}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
    >
      {notificationsEnabled ? (
        <Bell className="w-5 h-5 text-purple-600" />
      ) : (
        <BellOff className="w-5 h-5 text-gray-400" />
      )}
    </button>
  );
};

export default NotificationManager;