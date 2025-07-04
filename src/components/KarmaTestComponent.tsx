import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, Brain, Eye, Zap, Clock, CheckCircle } from 'lucide-react';
import { KarmaTest, KarmaQuestion, KarmaOption } from '../types/karma';
import { getExtendedTestByBeliefSystem } from '../data/extendedKarmaTests';

interface KarmaTestComponentProps {
  beliefSystem: string;
  onComplete: (responses: { [questionId: string]: any }) => void;
  onBack: () => void;
}

const KarmaTestComponent: React.FC<KarmaTestComponentProps> = ({
  beliefSystem,
  onComplete,
  onBack
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ [questionId: string]: any }>({});
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const test = getExtendedTestByBeliefSystem(beliefSystem);
  if (!test) return null;

  const currentQuestion = test.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;
  const canProceed = responses[currentQuestion.id] !== undefined;
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Add test metadata
      const testMetadata = {
        totalTime: Date.now() - startTime,
        beliefSystem,
        completedAt: new Date().toISOString()
      };
      
      onComplete({ ...responses, _metadata: testMetadata });
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setQuestionStartTime(Date.now());
    } else {
      onBack();
    }
  };

  const renderQuestion = (question: KarmaQuestion) => {
    switch (question.type) {
      case 'choice':
      case 'scenario':
        return (
          <div className="space-y-4">
            {question.options?.map((option) => (
              <button
                key={option.id}
                onClick={() => handleResponse(question.id, option.id)}
                className={`w-full p-6 text-left rounded-xl border-2 transition-all hover:scale-[1.02] ${
                  responses[question.id] === option.id
                    ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-teal-50 shadow-lg transform scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-6 h-6 rounded-full border-2 mt-1 flex-shrink-0 transition-all ${
                    responses[question.id] === option.id
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                  }`}>
                    {responses[question.id] === option.id && (
                      <CheckCircle className="w-full h-full text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-900 leading-relaxed">{option.text}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-6">
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>1 - Not important at all</span>
              <span>5 - Neutral</span>
              <span>10 - Extremely important</span>
            </div>
            
            <div className="relative">
              <div className="flex justify-between mb-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleResponse(question.id, value)}
                    className={`w-12 h-12 rounded-full border-2 transition-all hover:scale-110 font-semibold ${
                      responses[question.id] === value
                        ? 'border-purple-500 bg-purple-500 text-white shadow-lg scale-110'
                        : 'border-gray-300 text-gray-600 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              
              {/* Visual scale */}
              <div className="h-2 bg-gray-200 rounded-full mt-4">
                {responses[question.id] && (
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-teal-600 rounded-full transition-all duration-300"
                    style={{ width: `${(responses[question.id] / 10) * 100}%` }}
                  />
                )}
              </div>
            </div>
            
            {responses[question.id] && (
              <div className="text-center">
                <span className="text-lg font-semibold text-purple-600">
                  Your answer: {responses[question.id]}/10
                </span>
              </div>
            )}
          </div>
        );

      case 'priority':
        const selectedPriorities = responses[question.id] || [];
        const maxSelections = Math.min(5, question.options?.length || 0);
        
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">
                <strong>Instructions:</strong> Select and prioritize up to {maxSelections} options. 
                Click on an option to add it to your priority list.
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Selected: {selectedPriorities.length}/{maxSelections}
              </p>
            </div>
            
            {/* Priority list */}
            {selectedPriorities.length > 0 && (
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-purple-900 mb-3">Your priorities:</h4>
                <div className="space-y-2">
                  {selectedPriorities.map((optionId: string, index: number) => {
                    const option = question.options?.find(opt => opt.id === optionId);
                    return (
                      <div key={optionId} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="text-purple-800">{option?.text}</span>
                        <button
                          onClick={() => {
                            const newPriorities = selectedPriorities.filter((id: string) => id !== optionId);
                            handleResponse(question.id, newPriorities);
                          }}
                          className="text-purple-500 hover:text-purple-700 ml-auto"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Available options */}
            <div className="space-y-3">
              {question.options?.map((option) => {
                const isSelected = selectedPriorities.includes(option.id);
                const canSelect = !isSelected && selectedPriorities.length < maxSelections;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      if (isSelected) {
                        const newPriorities = selectedPriorities.filter((id: string) => id !== option.id);
                        handleResponse(question.id, newPriorities);
                      } else if (canSelect) {
                        const newPriorities = [...selectedPriorities, option.id];
                        handleResponse(question.id, newPriorities);
                      }
                    }}
                    disabled={!canSelect && !isSelected}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-100 opacity-50'
                        : canSelect
                        ? 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                        : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={isSelected ? 'text-purple-700' : 'text-gray-900'}>
                        {option.text}
                      </span>
                      {isSelected && (
                        <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {selectedPriorities.indexOf(option.id) + 1}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getBeliefSystemIcon = (system: string) => {
    const icons = {
      astrology: Star,
      psychology: Brain,
      chakras: Heart,
      numerology: Zap,
      tarot: Eye
    };
    return icons[system as keyof typeof icons] || Star;
  };

  const getBeliefSystemName = (system: string) => {
    const names = {
      astrology: 'Astrology',
      psychology: 'Psychology',
      chakras: 'Chakras',
      numerology: 'Numerology',
      tarot: 'Tarot'
    };
    return names[system as keyof typeof names] || system;
  };

  const Icon = getBeliefSystemIcon(beliefSystem);
  const estimatedTimeLeft = Math.max(0, (test.questions.length - currentQuestionIndex - 1) * 45); // 45 seconds per question

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-teal-100 rounded-full px-6 py-3 mb-6">
          <Icon className="w-6 h-6 text-purple-600 mr-3" />
          <span className="text-lg font-semibold text-purple-700">
            {getBeliefSystemName(beliefSystem)}
          </span>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Deep Karma Analysis
        </h2>
        
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          This extended test will help accurately determine your karmic purpose through the lens of {getBeliefSystemName(beliefSystem).toLowerCase()}
        </p>
        
        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-teal-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Question {currentQuestionIndex + 1} of {test.questions.length}</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>~{Math.ceil(estimatedTimeLeft / 60)} min remaining</span>
            </div>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {currentQuestionIndex + 1}
              </div>
              {currentQuestion.weight && currentQuestion.weight > 2 && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                  Key Question
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {currentQuestion.type === 'scenario' && '📖 Scenario'}
              {currentQuestion.type === 'choice' && '🎯 Choice'}
              {currentQuestion.type === 'scale' && '📊 Scale'}
              {currentQuestion.type === 'priority' && '📋 Priorities'}
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">
            {currentQuestion.question}
          </h3>
        </div>
        
        {renderQuestion(currentQuestion)}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          {currentQuestionIndex === 0 ? 'Back to Profile' : 'Previous Question'}
        </button>

        <div className="text-center">
          {!canProceed && (
            <p className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
              {currentQuestion.type === 'priority' 
                ? 'Select at least one option'
                : 'Choose an answer to continue'
              }
            </p>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex items-center px-8 py-3 rounded-full font-semibold transition-all ${
            canProceed
              ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white hover:scale-105 shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLastQuestion ? (
            <>
              Complete Analysis
              <CheckCircle className="w-5 h-5 ml-2" />
            </>
          ) : (
            <>
              Next Question
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </div>

      {/* Test Info */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>🔒 Your answers are confidential</span>
            <span>⚡ No right or wrong answers</span>
          </div>
          <span>💡 Answer intuitively</span>
        </div>
      </div>
    </div>
  );
};

export default KarmaTestComponent;