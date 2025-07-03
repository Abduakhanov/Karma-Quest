import React from 'react';
import { TrendingUp, Heart, DollarSign, Brain, Briefcase, Star, Sparkles, ArrowRight } from 'lucide-react';
import { KarmaAnalysis } from '../types';
import { beliefSystems } from '../data/mockData';

interface KarmaInsightProps {
  karmaAnalysis: KarmaAnalysis;
  selectedBeliefs: string[];
  onNext: () => void;
  onBack: () => void;
}

const KarmaInsight: React.FC<KarmaInsightProps> = ({
  karmaAnalysis,
  selectedBeliefs,
  onNext,
  onBack
}) => {
  const areaIcons = {
    health: Heart,
    relationships: Heart,
    finances: DollarSign,
    spirituality: Star,
    career: Briefcase
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-teal-100 rounded-full px-4 py-2 mb-4">
          <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
          <span className="text-sm font-medium text-purple-700">Your Karma Analysis is Ready!</span>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Your Cosmic Profile
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Based on your selected belief systems, here's your personalized karma analysis
        </p>
      </div>

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-xl p-8 text-white mb-8">
        <div className="text-center">
          <div className="text-6xl font-bold mb-2">{karmaAnalysis.overallScore}</div>
          <div className="text-xl font-medium mb-4">Overall Karma Score</div>
          <div className="flex justify-center space-x-4">
            {selectedBeliefs.map(beliefId => {
              const belief = beliefSystems.find(b => b.id === beliefId);
              return belief ? (
                <div key={beliefId} className="flex items-center bg-white/20 rounded-full px-3 py-1">
                  <span className="text-lg mr-1">{belief.icon}</span>
                  <span className="text-sm">{belief.name}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Life Areas Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Life Areas Analysis
          </h3>
          
          <div className="space-y-4">
            {Object.entries(karmaAnalysis.areas).map(([area, score]) => {
              const Icon = areaIcons[area as keyof typeof areaIcons];
              return (
                <div key={area} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">{area}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getScoreColor(score)}`}>
                        {Math.round(score)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
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
        </div>

        {/* Belief System Insights */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-teal-600" />
            System Insights
          </h3>
          
          <div className="space-y-4">
            {selectedBeliefs.map(beliefId => {
              const belief = beliefSystems.find(b => b.id === beliefId);
              const insight = karmaAnalysis.insights[beliefId];
              
              if (!belief || !insight) return null;
              
              return (
                <div key={beliefId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{belief.icon}</span>
                      <span className="font-medium text-gray-900">{belief.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getScoreColor(insight.score)}`}>
                      {insight.score}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{insight.explanation}</p>
                  <div className="text-xs text-purple-600">
                    Key recommendations: {insight.recommendations.slice(0, 2).join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Strengths & Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Strengths ✨</h3>
          <div className="space-y-3">
            {karmaAnalysis.strengths.map((strength, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-gray-700">{strength}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Growth Areas 🌱</h3>
          <div className="space-y-3">
            {karmaAnalysis.challenges.map((challenge, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-gray-700">{challenge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Cosmic Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {karmaAnalysis.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-teal-50 rounded-lg">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {index + 1}
              </div>
              <p className="text-sm text-gray-700 flex-1">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          ← Back
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Ready to turn these insights into action?
          </p>
        </div>

        <button
          onClick={onNext}
          className="flex items-center bg-gradient-to-r from-purple-600 to-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg"
        >
          Create Action Plan
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default KarmaInsight;