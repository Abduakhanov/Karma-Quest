import React from 'react';
import { Flame, Calendar, Target, Zap } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const StreakWidget: React.FC = () => {
  const { user, tasks } = useAppStore();
  
  if (!user) return null;

  const streak = user.streak || 0;
  const completedToday = tasks.filter(task => {
    if (!task.completed) return false;
    const today = new Date().toDateString();
    const taskDate = new Date(task.createdAt).toDateString();
    return today === taskDate;
  }).length;

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
    if (streak >= 14) return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
    if (streak >= 7) return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
    if (streak >= 3) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
    return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return 'Legendary streak! 🏆';
    if (streak >= 14) return 'On fire! 🔥';
    if (streak >= 7) return 'Great momentum! ⚡';
    if (streak >= 3) return 'Building habits! 💪';
    if (streak >= 1) return 'Getting started! 🌱';
    return 'Start your streak today! 🚀';
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '👑';
    if (streak >= 14) return '🔥';
    if (streak >= 7) return '⚡';
    if (streak >= 3) return '💪';
    if (streak >= 1) return '🌱';
    return '🚀';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Flame className="w-5 h-5 mr-2 text-orange-500" />
          Daily Streak
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStreakColor(streak)}`}>
          {streak} days
        </div>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-6xl mb-2 animate-pulse-slow">
          {getStreakEmoji(streak)}
        </div>
        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {streak}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {getStreakMessage(streak)}
        </p>
        
        {/* Streak visualization */}
        <div className="flex justify-center space-x-1 mb-4">
          {Array.from({ length: Math.min(7, Math.max(7, streak + 1)) }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index < streak
                  ? 'bg-gradient-to-r from-orange-400 to-red-500 animate-pulse'
                  : 'bg-gray-200 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Today's Progress */}
      <div className="bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Today's Tasks</span>
          <div className="flex items-center text-purple-600 dark:text-purple-400">
            <Target className="w-4 h-4 mr-1" />
            <span className="text-sm font-bold">{completedToday}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-teal-600 transition-all duration-500"
            style={{ width: `${Math.min(100, (completedToday / Math.max(1, tasks.length)) * 100)}%` }}
          />
        </div>
      </div>

      {/* Streak Milestones */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Next Milestones</h4>
        {[
          { days: 3, label: 'Habit Builder', icon: '💪' },
          { days: 7, label: 'Week Warrior', icon: '⚡' },
          { days: 14, label: 'Fire Keeper', icon: '🔥' },
          { days: 30, label: 'Legend', icon: '👑' }
        ].map(milestone => (
          <div key={milestone.days} className={`flex items-center justify-between text-xs ${
            streak >= milestone.days 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            <div className="flex items-center">
              <span className="mr-2">{milestone.icon}</span>
              <span>{milestone.label}</span>
            </div>
            <div className="flex items-center">
              {streak >= milestone.days ? (
                <span className="text-green-500">✓</span>
              ) : (
                <span>{milestone.days - streak} days to go</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Calendar className="w-3 h-3 mr-1" />
        {user.lastActiveDate 
          ? `Last active: ${new Date(user.lastActiveDate).toLocaleDateString()}`
          : 'Complete a task to start your streak!'
        }
      </div>
    </div>
  );
};

export default StreakWidget;