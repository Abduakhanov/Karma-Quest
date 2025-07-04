import React, { useEffect, useState } from 'react';
import { Bell, BellOff, Check, X, Zap } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const NotificationManager: React.FC = () => {
  const { notificationsEnabled, setNotificationsEnabled } = useAppStore();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showPrompt, setShowPrompt] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
        setShowSuccess(true);
        
        // Send welcome notification
        new Notification('KarmaQuest Notifications Enabled! 🎉', {
          body: 'We\'ll remind you to complete your daily karma tasks.',
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
        
        // Schedule daily reminders
        scheduleNotifications();
        
        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      }
      
      localStorage.setItem('notification-prompted', 'true');
    }
  };

  const scheduleNotifications = () => {
    // Register service worker for background notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('Service Worker registered:', registration);
        
        // Schedule daily reminder
        if ('setInterval' in window) {
          // Check every hour if it's time for daily reminder (9 AM)
          setInterval(() => {
            const now = new Date();
            if (now.getHours() === 9 && now.getMinutes() === 0) {
              new Notification('Daily Karma Check! 🌟', {
                body: 'Time to complete your karma tasks and maintain your streak!',
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: 'daily-reminder'
              });
            }
          }, 60000); // Check every minute
        }
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

  return (
    <>
      {/* Notification Toggle Button */}
      <button
        onClick={toggleNotifications}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
        title={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
      >
        {notificationsEnabled ? (
          <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        ) : (
          <BellOff className="w-5 h-5 text-gray-400" />
        )}
        {notificationsEnabled && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white rounded-lg shadow-xl p-4 max-w-sm z-50 animate-slide-up">
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6 text-yellow-300" />
            <div>
              <h4 className="font-semibold">Notifications Enabled!</h4>
              <p className="text-sm text-green-100">You'll receive daily karma reminders</p>
            </div>
          </div>
        </div>
      )}

      {/* Initial Prompt */}
      {showPrompt && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm z-50 animate-slide-up">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
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
      )}
    </>
  );
};

export default NotificationManager;