import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { AppState, OnboardingData, KarmaAnalysis, Task } from '../types';
import BeliefSystemSelector from './BeliefSystemSelector';
import ProfileSetup from './ProfileSetup';
import KarmaInsight from './KarmaInsight';
import QuestBuilder from './QuestBuilder';
import { KarmaEngine } from '../utils/karmaEngine';

interface OnboardingProps {
  state: AppState;
  onComplete: (data: OnboardingData) => void;
  onBack: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ state, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    selectedBeliefs: [],
    profileData: {
      name: '',
      timezone: 'UTC+0'
    },
    selectedTasks: []
  });

  const steps = [
    { title: 'Welcome', description: 'Let\'s begin your journey' },
    { title: 'Choose Systems', description: 'Select belief systems that resonate with you' },
    { title: 'Your Profile', description: 'Tell us about yourself' },
    { title: 'Karma Insight', description: 'Your personalized analysis' },
    { title: 'Quest Builder', description: 'Create your action plan' }
  ];

  const handleNext = async () => {
    if (currentStep === 2) {
      // Generate karma analysis after profile setup
      setIsLoading(true);
      try {
        const karmaAnalysis = await KarmaEngine.generateKarmaAnalysis(
          onboardingData.selectedBeliefs,
          onboardingData.profileData
        );
        setOnboardingData(prev => ({ ...prev, karmaInsight: karmaAnalysis }));
        setCurrentStep(currentStep + 1);
      } catch (error) {
        console.error('Failed to generate karma analysis:', error);
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === 4) {
      // Complete onboarding
      onComplete(onboardingData);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      onBack();
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

  const handleTaskSelection = (taskIds: string[]) => {
    setOnboardingData(prev => ({ ...prev, selectedTasks: taskIds }));
  };

  const handleCustomTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    // This would typically be handled by the parent component
    console.log('Custom task created:', task);
  };

  const renderStep = () => {
    if (isLoading) {
      return (
        <div className="text-center py-16">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Generating Your Karma Analysis
          </h3>
          <p className="text-gray-600">
            Consulting the cosmic forces and analyzing your profile...
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
              Embark on a personalized journey of self-discovery and growth. 
              We'll help you unlock insights from the wisdom traditions you trust most.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform flex items-center"
              >
                Let's Begin
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
        return onboardingData.karmaInsight ? (
          <KarmaInsight
            karmaAnalysis={onboardingData.karmaInsight}
            selectedBeliefs={onboardingData.selectedBeliefs}
            onNext={handleNext}
            onBack={handleBack}
          />
        ) : null;

      case 4:
        const suggestedTasks = onboardingData.karmaInsight 
          ? KarmaEngine.generateSuggestedTasks(onboardingData.selectedBeliefs)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-1 mx-2 rounded-full transition-all ${
                    index < currentStep ? 'bg-gradient-to-r from-purple-600 to-teal-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900">{steps[currentStep].title}</h1>
            <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
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