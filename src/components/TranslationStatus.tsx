import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Clock, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useQuestMutations } from '../hooks/useQuests';

interface TranslationStatusProps {
  fallback?: string;
  translationInProgress?: boolean;
  missingCount?: number;
  onRetry?: () => void;
}

const TranslationStatus: React.FC<TranslationStatusProps> = ({
  fallback,
  translationInProgress,
  missingCount = 0,
  onRetry
}) => {
  const { t, i18n } = useTranslation(['common', 'tasks']);
  const { requestTranslation } = useQuestMutations();

  if (!fallback && !translationInProgress) {
    return null;
  }

  const handleRequestTranslation = async () => {
    try {
      // Request translation for missing quests
      await requestTranslation('*', i18n.language);
      onRetry?.();
    } catch (error) {
      console.error('Failed to request translation:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {translationInProgress ? (
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
          ) : (
            <Globe className="w-5 h-5 text-blue-600" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium text-blue-900">
              {translationInProgress ? t('tasks:translation.inProgress') : t('tasks:translation.fallback')}
            </h4>
            {missingCount > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                {missingCount} {t('tasks:translation.missing')}
              </span>
            )}
          </div>
          
          <p className="text-sm text-blue-700 mb-3">
            {translationInProgress 
              ? t('tasks:translation.processingMessage')
              : t('tasks:translation.fallbackMessage', { language: fallback?.toUpperCase() })
            }
          </p>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRequestTranslation}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {translationInProgress ? t('tasks:translation.refresh') : t('tasks:translation.request')}
            </button>
            
            <div className="flex items-center space-x-1 text-xs text-blue-600">
              <Clock className="w-3 h-3" />
              <span>{t('tasks:translation.estimatedTime')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationStatus;