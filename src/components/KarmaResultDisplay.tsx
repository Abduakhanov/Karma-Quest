import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Heart, Zap, Shield, BookOpen, Sparkles, Crown, Search } from 'lucide-react';
import { KarmaAnalysisResult } from '../types/karma';

interface KarmaResultDisplayProps {
  result: KarmaAnalysisResult;
  onContinue: () => void;
}

const KarmaResultDisplay: React.FC<KarmaResultDisplayProps> = ({ result, onContinue }) => {
  const { t } = useTranslation(['onboarding', 'common']);

  const getKarmaIcon = (karmaId: string) => {
    const icons = {
      helper: Heart,
      independent: Zap,
      creator: Sparkles,
      protector: Shield,
      teacher: BookOpen,
      healer: Heart,
      leader: Crown,
      seeker: Search
    };
    return icons[karmaId as keyof typeof icons] || Star;
  };

  const PrimaryIcon = getKarmaIcon(result.primaryKarma.id);
  const SecondaryIcon = result.secondaryKarma ? getKarmaIcon(result.secondaryKarma.id) : null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-teal-100 rounded-full px-4 py-2 mb-4">
          <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
          <span className="text-sm font-medium text-purple-700">Ваша карма определена!</span>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ваше кармическое предназначение
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Основываясь на ваших ответах, мы определили ваш уникальный кармический путь
        </p>
      </div>

      {/* Primary Karma */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-xl p-8 text-white mb-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <PrimaryIcon className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Ваша основная карма:</h3>
          <h4 className="text-4xl font-bold mb-4" style={{ color: result.primaryKarma.color }}>
            {result.primaryKarma.name}
          </h4>
          <p className="text-xl text-purple-100 mb-6 max-w-3xl mx-auto">
            {result.primaryKarma.description}
          </p>
          <div className="bg-white/10 rounded-lg p-4 inline-block">
            <div className="text-sm text-purple-100 mb-1">Уверенность в результате</div>
            <div className="text-2xl font-bold">{result.confidence}%</div>
          </div>
        </div>
      </div>

      {/* Secondary Karma */}
      {result.secondaryKarma && SecondaryIcon && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <SecondaryIcon className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Вторичная карма:</h4>
              <p className="text-purple-600 font-medium">{result.secondaryKarma.name}</p>
            </div>
          </div>
          <p className="text-gray-600">{result.secondaryKarma.description}</p>
        </div>
      )}

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Life Lesson & Spiritual Gift */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Ваш духовный путь</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                Жизненный урок
              </h4>
              <p className="text-gray-700 bg-purple-50 p-3 rounded-lg">
                {result.detailedAnalysis.lifeLesson}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-teal-600" />
                Духовный дар
              </h4>
              <p className="text-gray-700 bg-teal-50 p-3 rounded-lg">
                {result.detailedAnalysis.spiritualGift}
              </p>
            </div>
          </div>
        </div>

        {/* Element & Chakra */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Энергетический профиль</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Стихия</h4>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: result.primaryKarma.color }}
                />
                <span className="text-gray-700 capitalize">{result.primaryKarma.element}</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Основная чакра</h4>
              <p className="text-gray-700">{result.primaryKarma.chakra}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Совместимые типы кармы</h4>
              <div className="flex flex-wrap gap-2">
                {result.primaryKarma.compatibleTypes.map((typeId) => (
                  <span 
                    key={typeId}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {t(`common:karma.types.${typeId}`)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Ваши сильные стороны
          </h3>
          <div className="space-y-3">
            {result.detailedAnalysis.strengths.map((strength, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-gray-700">{strength}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-orange-500" />
            Области для роста
          </h3>
          <div className="space-y-3">
            {result.detailedAnalysis.challenges.map((challenge, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-gray-700">{challenge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Рекомендации для развития</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.detailedAnalysis.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-teal-50 rounded-lg">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {index + 1}
              </div>
              <p className="text-sm text-gray-700 flex-1">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Belief System Insights */}
      {Object.keys(result.beliefSystemInsights).length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Инсайты систем верований</h3>
          <div className="space-y-6">
            {Object.entries(result.beliefSystemInsights).map(([system, insights]) => (
              <div key={system} className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-gray-900 mb-2 capitalize">{system}</h4>
                <p className="text-gray-700 mb-3">{insights.interpretation}</p>
                <div className="space-y-1">
                  {insights.specificGuidance.map((guidance: string, index: number) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center">
                      <div className="w-1 h-1 bg-purple-500 rounded-full mr-2" />
                      {guidance}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="text-center">
        <button
          onClick={onContinue}
          className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-lg"
        >
          Продолжить к созданию квестов
        </button>
      </div>
    </div>
  );
};

export default KarmaResultDisplay;