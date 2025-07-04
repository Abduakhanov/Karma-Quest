import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { OnboardingData, Task } from '../types';
import { KarmaAnalysisResult } from '../types/karma';
import BeliefSystemSelector from './BeliefSystemSelector';
import ProfileSetup from './ProfileSetup';
import KarmaTestComponent from './KarmaTestComponent';
import KarmaResultDisplay from './KarmaResultDisplay';
import QuestBuilder from './QuestBuilder';
import { KarmaEngine } from '../utils/karmaEngine';

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onBack: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    selectedBeliefs: [],
    profileData: {
      name: '',
      timezone: 'UTC+0'
    },
    selectedTasks: []
  });
  const [testResponses, setTestResponses] = useState<{ [beliefSystem: string]: { [questionId: string]: any } }>({});
  const [karmaResult, setKarmaResult] = useState<KarmaAnalysisResult | null>(null);

  const steps = [
    { title: 'Welcome', description: 'Let\'s begin your journey' },
    { title: 'Belief Systems', description: 'Choose systems that resonate with you' },
    { title: 'Profile Setup', description: 'Tell us about yourself' },
    { title: 'Karma Testing', description: 'Take personalized tests' },
    { title: 'Your Analysis', description: 'Your personalized karma analysis' },
    { title: 'Quest Builder', description: 'Create your action plan' }
  ];

  const handleNext = async () => {
    if (currentStep === 2) {
      // After profile setup, go to tests
      setCurrentStep(3);
      setCurrentTestIndex(0);
    } else if (currentStep === 3) {
      // Move to next test or analysis
      if (currentTestIndex < onboardingData.selectedBeliefs.length - 1) {
        setCurrentTestIndex(currentTestIndex + 1);
      } else {
        // All tests completed, generate karma analysis
        setIsLoading(true);
        try {
          const karmaAnalysis = await KarmaEngine.generateKarmaAnalysis(
            onboardingData.selectedBeliefs,
            onboardingData.profileData,
            testResponses
          );
          setKarmaResult(karmaAnalysis);
          setCurrentStep(4);
        } catch (error) {
          console.error('Failed to generate karma analysis:', error);
        } finally {
          setIsLoading(false);
        }
      }
    } else if (currentStep === 4) {
      // Move to quest builder
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // Complete onboarding
      const finalData = {
        ...onboardingData,
        karmaInsight: karmaResult
      };
      onComplete(finalData);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      onBack();
    } else if (currentStep === 3 && currentTestIndex > 0) {
      setCurrentTestIndex(currentTestIndex - 1);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBeliefSelection = (beliefs: string[]) => {
    setOnboardingData(prev => ({ ...prev, selectedBeliefs: beliefs }));
  };

  const handleProfileChange = (profileData: OnboardingData['profileData']) => {
    setOnboardingData(prev => ({ ...prev, profileData }));
  };

  const handleTestComplete = (responses: { [questionId: string]: any }) => {
    const currentBeliefSystem = onboardingData.selectedBeliefs[currentTestIndex];
    setTestResponses(prev => ({
      ...prev,
      [currentBeliefSystem]: responses
    }));
    handleNext();
  };

  const handleTaskSelection = (taskIds: string[]) => {
    setOnboardingData(prev => ({ ...prev, selectedTasks: taskIds }));
  };

  const handleCustomTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    console.log('Custom task created:', task);
  };

  const renderStep = () => {
    if (isLoading) {
      return (
        <div className="text-center py-16">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Analyzing Your Karma
          </h3>
          <p className="text-gray-600">
            Processing your responses to create personalized insights...
          </p>
        </div>
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <div className="text-center">
            <div className="text-6xl mb-6">🌟</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to KarmaQuest
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover your cosmic potential through personalized insights from multiple belief systems
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform flex items-center"
              >
                Begin Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        );

      case 1:
        return (
          <BeliefSystemSelector
            selectedBeliefs={onboardingData.selectedBeliefs}
            onSelectionChange={handleBeliefSelection}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 2:
        return (
          <ProfileSetup
            profileData={onboardingData.profileData}
            onProfileChange={handleProfileChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 3:
        const currentBeliefSystem = onboardingData.selectedBeliefs[currentTestIndex];
        return (
          <KarmaTestComponent
            beliefSystem={currentBeliefSystem}
            onComplete={handleTestComplete}
            onBack={handleBack}
          />
        );

      case 4:
        return karmaResult ? (
          <KarmaResultDisplay
            result={karmaResult}
            onContinue={handleNext}
          />
        ) : null;

      case 5:
        const suggestedTasks = karmaResult 
          ? KarmaEngine.generateSuggestedTasks(
              onboardingData.selectedBeliefs, 
              karmaResult.primaryKarma.id
            )
          : [];
        
        return (
          <QuestBuilder
            suggestedTasks={suggestedTasks}
            selectedTasks={onboardingData.selectedTasks}
            onTaskSelection={handleTaskSelection}
            onCustomTask={handleCustomTask}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      default:
        return null;
    }
  };

  const getCurrentStepForProgress = () => {
    if (currentStep === 3) {
      // For tests, show progress within the step
      return 3 + (currentTestIndex / onboardingData.selectedBeliefs.length);
    }
    return currentStep;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  index <= getCurrentStepForProgress()
                    ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-1 mx-2 rounded-full transition-all ${
                    index < getCurrentStepForProgress() ? 'bg-gradient-to-r from-purple-600 to-teal-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900">
              {currentStep === 3 
                ? `Test: ${onboardingData.selectedBeliefs[currentTestIndex]} (${currentTestIndex + 1}/${onboardingData.selectedBeliefs.length})`
                : steps[currentStep]?.title
              }
            </h1>
            <p className="text-sm text-gray-600">
              {currentStep === 3 
                ? `Determining your karma through ${onboardingData.selectedBeliefs[currentTestIndex]}`
                : steps[currentStep]?.description
              }
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;