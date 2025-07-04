import React from 'react';
import { Flame, Calendar } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const StreakWidget: React.FC = () => {
  const { user } = useAppStore();
  
  if (!user) return null;

  const streak = user.streak || 0;
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600 bg-purple-100';
    if (streak >= 14) return 'text-orange-600 bg-orange-100';
    if (streak >= 7) return 'text-red-600 bg-red-100';
    if (streak >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return 'Legendary streak! 🏆';
    if (streak >= 14) return 'On fire! 🔥';
    if (streak >= 7) return 'Great momentum! ⚡';
    if (streak >= 3) return 'Building habits! 💪';
    if (streak >= 1) return 'Getting started! 🌱';
    return 'Start your streak today! 🚀';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Flame className="w-5 h-5 mr-2 text-orange-500" />
          Daily Streak
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStreakColor(streak)}`}>
          {streak} days
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {streak}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {getStreakMessage(streak)}
        </p>
        
        {/* Streak visualization */}
        <div className="flex justify-center space-x-1 mb-4">
          {Array.from({ length: Math.min(7, streak + 1) }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index < streak
                  ? 'bg-gradient-to-r from-orange-400 to-red-500'
                  : 'bg-gray-200 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
        
        <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="w-3 h-3 mr-1" />
          {user.lastActiveDate 
            ? `Last active: ${new Date(user.lastActiveDate).toLocaleDateString()}`
            : 'Complete a task to start your streak!'
          }
        </div>
      </div>
    </div>
  );
};

export default StreakWidget;