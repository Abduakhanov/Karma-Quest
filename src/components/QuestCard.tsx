import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Clock, Zap, Globe, CheckCircle, Circle } from 'lucide-react';
import { Quest } from '../types/quest';
import LoadingSkeleton from './LoadingSkeleton';

interface QuestCardProps {
  quest: Quest;
  onToggle?: (questKey: string) => void;
  showTranslationStatus?: boolean;
}

const QuestCard: React.FC<QuestCardProps> = ({ 
  quest, 
  onToggle, 
  showTranslationStatus = false 
}) => {
  const { t, i18n } = useTranslation(['common', 'tasks']);

  const categoryColors = {
    health: 'bg-red-50 border-red-200 text-red-700',
    relationships: 'bg-pink-50 border-pink-200 text-pink-700',
    finances: 'bg-green-50 border-green-200 text-green-700',
    spirituality: 'bg-purple-50 border-purple-200 text-purple-700',
    career: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  const priorityColors = {
    1: 'text-gray-600',
    2: 'text-blue-600',
    3: 'text-yellow-600',
    4: 'text-orange-600',
    5: 'text-red-600'
  };

  const getTranslationQualityColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`p-6 rounded-xl border-2 transition-all hover:shadow-md ${
      quest.completed 
        ? 'bg-gray-50 border-gray-200 opacity-75' 
        : 'bg-white border-gray-200 hover:border-purple-300'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          {onToggle && (
            <button
              onClick={() => onToggle(quest.key)}
              className="mt-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {quest.completed ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>
          )}
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className={`font-semibold ${quest.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {quest.title}
              </h3>
              
              {showTranslationStatus && quest.translatedBy && i18n.language !== 'en' && (
                <div className="flex items-center space-x-1">
                  <Globe className="w-3 h-3 text-gray-400" />
                  <span className={`text-xs ${getTranslationQualityColor(quest.qualityScore)}`}>
                    {quest.translatedBy === 'gpt' ? 'AI' : quest.translatedBy === 'human' ? 'Human' : 'Auto'}
                  </span>
                </div>
              )}
            </div>
            
            {quest.description && (
              <p className={`text-sm mb-3 ${quest.completed ? 'text-gray-500' : 'text-gray-600'}`}>
                {quest.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>{t('common:units.priority')} {quest.priority}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-purple-500" />
                <span>+{quest.xpReward} {t('common:units.xp')}</span>
              </div>
              {quest.beliefSystem && (
                <div className="flex items-center space-x-1">
                  <span className="text-gray-400">•</span>
                  <span className="capitalize">{quest.beliefSystem}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[quest.category]}`}>
            {t(`tasks:categories.${quest.category}`)}
          </span>
          
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[quest.priority]} bg-gray-100`}>
            {quest.priority}★
          </div>
          
          {quest.completed && (
            <div className="text-xs text-green-600 font-medium">
              ✓ {t('common:status.completed')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const QuestCardSkeleton: React.FC = () => (
  <div className="p-6 rounded-xl border-2 border-gray-200 bg-white">
    <div className="flex items-start space-x-3 mb-4">
      <LoadingSkeleton variant="avatar" className="w-6 h-6 rounded-full" />
      <div className="flex-1">
        <LoadingSkeleton variant="text" width="w-3/4" height="h-5" className="mb-2" />
        <LoadingSkeleton variant="text" lines={2} height="h-4" className="mb-3" />
        <div className="flex space-x-4">
          <LoadingSkeleton variant="text" width="w-16" height="h-3" />
          <LoadingSkeleton variant="text" width="w-12" height="h-3" />
          <LoadingSkeleton variant="text" width="w-20" height="h-3" />
        </div>
      </div>
      <LoadingSkeleton variant="button" className="w-16 h-6" />
    </div>
  </div>
);

export default QuestCard;