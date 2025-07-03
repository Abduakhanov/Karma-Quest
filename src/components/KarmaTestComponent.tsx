import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Star, Heart, Brain, Eye, Zap } from 'lucide-react';
import { KarmaTest, KarmaQuestion, KarmaOption } from '../types/karma';
import { getTestByBeliefSystem } from '../data/karmaTests';

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
  const { t } = useTranslation(['onboarding', 'common']);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ [questionId: string]: any }>({});

  const test = getTestByBeliefSystem(beliefSystem);
  if (!test) return null;

  const currentQuestion = test.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;
  const canProceed = responses[currentQuestion.id] !== undefined;

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(responses);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
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
                className={`w-full p-4 text-left rounded-xl border-2 transition-all hover:scale-105 ${
                  responses[question.id] === option.id
                    ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-teal-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    responses[question.id] === option.id
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                  }`}>
                    {responses[question.id] === option.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                  <span className="text-gray-900">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-6">
            <div className="flex justify-between text-sm text-gray-600">
              <span>1 - Совсем не важно</span>
              <span>10 - Крайне важно</span>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => handleResponse(question.id, value)}
                  className={`w-12 h-12 rounded-full border-2 transition-all hover:scale-110 ${
                    responses[question.id] === value
                      ? 'border-purple-500 bg-purple-500 text-white'
                      : 'border-gray-300 text-gray-600 hover:border-purple-300'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        );

      case 'priority':
        const selectedPriorities = responses[question.id] || [];
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Перетащите или нажмите для расстановки приоритетов (1 - самое важное)
            </p>
            {question.options?.map((option, index) => {
              const priorityIndex = selectedPriorities.indexOf(option.id);
              const isSelected = priorityIndex !== -1;
              
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    const newPriorities = [...selectedPriorities];
                    if (isSelected) {
                      newPriorities.splice(priorityIndex, 1);
                    } else {
                      newPriorities.push(option.id);
                    }
                    handleResponse(question.id, newPriorities);
                  }}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.text}</span>
                    {isSelected && (
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                        {priorityIndex + 1}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
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

  const Icon = getBeliefSystemIcon(beliefSystem);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-teal-100 rounded-full px-4 py-2 mb-4">
          <Icon className="w-5 h-5 text-purple-600 mr-2" />
          <span className="text-sm font-medium text-purple-700 capitalize">
            Тест: {beliefSystem}
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Определение вашей кармы
        </h2>
        
        {/* Progress */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          {test.questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index <= currentQuestionIndex
                  ? 'bg-gradient-to-r from-purple-600 to-teal-600'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        
        <div className="text-sm text-gray-600">
          Вопрос {currentQuestionIndex + 1} из {test.questions.length}
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQuestion.question}
        </h3>
        
        {renderQuestion(currentQuestion)}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          {currentQuestionIndex === 0 ? 'Назад' : 'Предыдущий'}
        </button>

        <div className="text-center">
          {!canProceed && (
            <p className="text-sm text-gray-500">
              Выберите ответ для продолжения
            </p>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all ${
            canProceed
              ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white hover:scale-105 shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLastQuestion ? 'Завершить тест' : 'Далее'}
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default KarmaTestComponent;