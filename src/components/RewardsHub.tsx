import React, { useState } from 'react';
import { Trophy, Star, Crown, Gift, Zap, Heart, Target, BookOpen, Users, Sparkles } from 'lucide-react';
import { AppState, Achievement } from '../types';

interface RewardsHubProps {
  state: AppState;
  achievements: Achievement[];
}

const RewardsHub: React.FC<RewardsHubProps> = ({ state, achievements }) => {
  const [selectedTab, setSelectedTab] = useState<'achievements' | 'avatars' | 'stats'>('achievements');
  
  const { user } = state;
  if (!user) return null;

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  
  const avatarOptions = [
    { id: 'seeker', emoji: '🧘‍♀️', name: 'Peaceful Seeker', cost: 0, unlocked: true },
    { id: 'mystic', emoji: '🔮', name: 'Mystic Oracle', cost: 100, unlocked: user.xp >= 100 },
    { id: 'warrior', emoji: '⚔️', name: 'Karma Warrior', cost: 200, unlocked: user.xp >= 200 },
    { id: 'wizard', emoji: '🧙‍♂️', name: 'Wisdom Wizard', cost: 300, unlocked: user.xp >= 300 },
    { id: 'phoenix', emoji: '🔥', name: 'Phoenix Rising', cost: 500, unlocked: user.xp >= 500 },
    { id: 'dragon', emoji: '🐉', name: 'Dragon Master', cost: 1000, unlocked: user.xp >= 1000 },
    { id: 'unicorn', emoji: '🦄', name: 'Unicorn Spirit', cost: 750, unlocked: user.level >= 10 },
    { id: 'star', emoji: '⭐', name: 'Stellar Being', cost: 1500, unlocked: user.level >= 15 }
  ];

  const levelProgress = (user.xp % 100) / 100;
  const nextLevelXP = Math.ceil(user.xp / 100) * 100;

  const renderAchievements = () => (
    <div className="space-y-6">
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Unlocked Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements.map(achievement => (
              <div key={achievement.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-yellow-600">+{achievement.xpReward} XP</span>
                      {achievement.unlockedAt && (
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-gray-500" />
          Coming Soon
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lockedAchievements.map(achievement => (
            <div key={achievement.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 opacity-75">
              <div className="flex items-center space-x-3">
                <div className="text-3xl filter grayscale">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-700">{achievement.title}</h4>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">+{achievement.xpReward} XP</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAvatars = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
          Avatar Collection
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {avatarOptions.map(avatar => (
            <div key={avatar.id} className={`relative p-4 rounded-xl border-2 transition-all ${
              avatar.unlocked
                ? user.avatar === avatar.emoji
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-purple-300 cursor-pointer'
                : 'border-gray-200 bg-gray-50 opacity-50'
            }`}>
              <div className="text-center">
                <div className="text-4xl mb-2">{avatar.emoji}</div>
                <h4 className="font-medium text-gray-900 text-sm">{avatar.name}</h4>
                <div className="mt-2">
                  {avatar.cost === 0 ? (
                    <span className="text-xs text-green-600">Free</span>
                  ) : avatar.unlocked ? (
                    <span className="text-xs text-purple-600">Unlocked</span>
                  ) : (
                    <span className="text-xs text-gray-500">{avatar.cost} XP</span>
                  )}
                </div>
              </div>
              {user.avatar === avatar.emoji && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Level Progress</h3>
            <Crown className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">Level {user.level}</div>
          <div className="w-full bg-white rounded-full h-2 mb-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-teal-600"
              style={{ width: `${levelProgress * 100}%` }}
            />
          </div>
          <div className="text-sm text-gray-600">
            {user.xp} / {nextLevelXP} XP to next level
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Tasks Completed</h3>
            <Target className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-3xl font-bold text-teal-600 mb-2">
            {state.tasks.filter(t => t.completed).length}
          </div>
          <div className="text-sm text-gray-600">
            {Math.round((state.tasks.filter(t => t.completed).length / Math.max(state.tasks.length, 1)) * 100)}% completion rate
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Diary Entries</h3>
            <BookOpen className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {state.diaryEntries.length}
          </div>
          <div className="text-sm text-gray-600">
            Personal reflections recorded
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Achievements</h3>
            <Trophy className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {unlockedAchievements.length}
          </div>
          <div className="text-sm text-gray-600">
            Out of {achievements.length} total
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Belief Systems</h3>
            <Heart className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {user.beliefSystems.length}
          </div>
          <div className="text-sm text-gray-600">
            Active systems
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Journey Started</h3>
            <Zap className="w-5 h-5 text-pink-600" />
          </div>
          <div className="text-3xl font-bold text-pink-600 mb-2">
            {Math.ceil((Date.now() - user.joinDate.getTime()) / (1000 * 60 * 60 * 24))}
          </div>
          <div className="text-sm text-gray-600">
            Days ago
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards Hub</h1>
          <p className="text-gray-600">
            Track your progress, unlock achievements, and customize your journey
          </p>
        </div>

        {/* User Level Card */}
        <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{user.avatar}</div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-purple-100">Level {user.level} • {user.xp} Total XP</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{user.level}</div>
              <div className="text-sm text-purple-100">Current Level</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to Level {user.level + 1}</span>
              <span>{Math.round(levelProgress * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-white"
                style={{ width: `${levelProgress * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'achievements', label: 'Achievements', icon: Trophy },
                { id: 'avatars', label: 'Avatars', icon: Crown },
                { id: 'stats', label: 'Statistics', icon: Star }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                      selectedTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          <div className="p-6">
            {selectedTab === 'achievements' && renderAchievements()}
            {selectedTab === 'avatars' && renderAvatars()}
            {selectedTab === 'stats' && renderStats()}
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-r from-purple-100 to-teal-100 rounded-xl p-6">
          <div className="text-center">
            <Gift className="w-12 h-12 mx-auto mb-4 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Support KarmaQuest</h3>
            <p className="text-gray-600 mb-4">
              Help us continue developing this platform and unlock exclusive rewards
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
              Make a Donation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsHub;