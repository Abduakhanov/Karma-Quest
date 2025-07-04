import React from 'react';
import { TrendingUp, Heart, DollarSign, Brain, Briefcase, Star, Target, BookOpen } from 'lucide-react';
import { User, KarmaAnalysis, Task, DiaryEntry, Achievement } from '../store/appStore';
import LoadingSkeleton from './LoadingSkeleton';
import StreakWidget from './StreakWidget';

interface DashboardProps {
  user: User;
  karmaAnalysis: KarmaAnalysis;
  tasks: Task[];
  diaryEntries: DiaryEntry[];
  achievements: Achievement[];
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  karmaAnalysis, 
  tasks, 
  diaryEntries, 
  achievements, 
  onNavigate 
}) => {
  const areaIcons = {
    health: Heart,
    relationships: Heart,
    finances: DollarSign,
    spirituality: Star,
    career: Briefcase
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.name}! 🌟
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your cosmic overview and progress on your karma quest
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Karma</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{karmaAnalysis.overallScore}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Level</p>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{user.level}</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasks Complete</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks}/{totalTasks}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Diary Entries</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{diaryEntries.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Karma Analysis */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Karma Analysis</h2>
            
            <div className="space-y-4">
              {Object.entries(karmaAnalysis.areas).map(([area, score]) => {
                const Icon = areaIcons[area as keyof typeof areaIcons];
                return (
                  <div key={area} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{area}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getScoreColor(score)}`}>
                          {Math.round(score)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getScoreBarColor(score)}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button
              onClick={() => onNavigate('tasks')}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              View All Tasks
            </button>
          </div>

          {/* Streak Widget */}
          <div>
            <StreakWidget />
          </div>
        </div>

        {/* Strengths & Challenges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Your Strengths ✨</h2>
            <div className="space-y-3">
              {karmaAnalysis.strengths.map((strength, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Growth Areas 🌱</h2>
            <div className="space-y-3">
              {karmaAnalysis.challenges.map((challenge, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-gray-700 dark:text-gray-300">{challenge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Cosmic Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {karmaAnalysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20 rounded-lg">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;