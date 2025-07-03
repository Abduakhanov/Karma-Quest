import React, { useState } from 'react';
import { Shield, Eye, Database, Globe, CheckCircle, AlertTriangle } from 'lucide-react';

interface ConsentFlowProps {
  onComplete: (consents: ConsentData) => void;
  onDecline: () => void;
}

interface ConsentData {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  ageConfirmed: boolean;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

const ConsentFlow: React.FC<ConsentFlowProps> = ({ onComplete, onDecline }) => {
  const [step, setStep] = useState<'age' | 'privacy' | 'cookies' | 'summary'>('age');
  const [consents, setConsents] = useState<ConsentData>({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    personalization: false,
    ageConfirmed: false,
    termsAccepted: false,
    privacyAccepted: false
  });

  const updateConsent = (key: keyof ConsentData, value: boolean) => {
    setConsents(prev => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 'age':
        return consents.ageConfirmed;
      case 'privacy':
        return consents.termsAccepted && consents.privacyAccepted;
      case 'cookies':
        return true; // Optional consents
      case 'summary':
        return consents.ageConfirmed && consents.termsAccepted && consents.privacyAccepted;
      default:
        return false;
    }
  };

  const handleNext = () => {
    switch (step) {
      case 'age':
        setStep('privacy');
        break;
      case 'privacy':
        setStep('cookies');
        break;
      case 'cookies':
        setStep('summary');
        break;
      case 'summary':
        onComplete(consents);
        break;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'age':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Age Verification
            </h2>
            
            <p className="text-gray-600 mb-6">
              To use KarmaQuest, you must be at least 16 years old. 
              This helps us comply with data protection regulations.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div className="text-left">
                  <h4 className="font-medium text-blue-900 mb-1">Why we ask</h4>
                  <p className="text-sm text-blue-700">
                    We're required by GDPR and other privacy laws to verify age before 
                    collecting personal data from minors.
                  </p>
                </div>
              </div>
            </div>
            
            <label className="flex items-center justify-center space-x-3 mb-6">
              <input
                type="checkbox"
                checked={consents.ageConfirmed}
                onChange={(e) => updateConsent('ageConfirmed', e.target.checked)}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-gray-700">
                I confirm that I am 16 years of age or older
              </span>
            </label>
          </div>
        );

      case 'privacy':
        return (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Privacy & Terms
              </h2>
              
              <p className="text-gray-600">
                Please review and accept our privacy policy and terms of service
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Privacy Policy</h3>
                <p className="text-sm text-gray-600 mb-3">
                  We protect your personal data with end-to-end encryption. 
                  Your diary entries are private and only you can read them.
                </p>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={consents.privacyAccepted}
                    onChange={(e) => updateConsent('privacyAccepted', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">
                    I have read and accept the <a href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</a>
                  </span>
                </label>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Terms of Service</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Our terms outline how you can use KarmaQuest responsibly 
                  and what we provide in return.
                </p>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={consents.termsAccepted}
                    onChange={(e) => updateConsent('termsAccepted', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the <a href="/terms" className="text-purple-600 hover:underline">Terms of Service</a>
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'cookies':
        return (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Cookie Preferences
              </h2>
              
              <p className="text-gray-600">
                Choose which cookies and data processing you're comfortable with
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Essential Cookies</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Required</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Necessary for the website to function properly. Cannot be disabled.
                </p>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={consents.essential}
                    disabled
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Always enabled</span>
                </label>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Help us understand how you use the app to improve your experience.
                </p>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={consents.analytics}
                    onChange={(e) => updateConsent('analytics', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Enable analytics</span>
                </label>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Personalization</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Customize your experience with personalized recommendations and content.
                </p>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={consents.personalization}
                    onChange={(e) => updateConsent('personalization', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Enable personalization</span>
                </label>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Marketing</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Receive updates about new features and special offers.
                </p>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={consents.marketing}
                    onChange={(e) => updateConsent('marketing', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Enable marketing communications</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              All Set!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Thank you for taking the time to review your privacy preferences. 
              You can change these settings anytime in your account.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">Your Choices:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Age confirmed (16+)</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex justify-between">
                  <span>Privacy Policy accepted</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex justify-between">
                  <span>Terms of Service accepted</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex justify-between">
                  <span>Analytics</span>
                  {consents.analytics ? 
                    <CheckCircle className="w-4 h-4 text-green-600" /> : 
                    <span className="text-gray-400">Disabled</span>
                  }
                </div>
                <div className="flex justify-between">
                  <span>Personalization</span>
                  {consents.personalization ? 
                    <CheckCircle className="w-4 h-4 text-green-600" /> : 
                    <span className="text-gray-400">Disabled</span>
                  }
                </div>
                <div className="flex justify-between">
                  <span>Marketing</span>
                  {consents.marketing ? 
                    <CheckCircle className="w-4 h-4 text-green-600" /> : 
                    <span className="text-gray-400">Disabled</span>
                  }
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {['age', 'privacy', 'cookies', 'summary'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step === stepName 
                    ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white' 
                    : index < ['age', 'privacy', 'cookies', 'summary'].indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-20 h-1 mx-2 rounded-full transition-all ${
                    index < ['age', 'privacy', 'cookies', 'summary'].indexOf(step) 
                      ? 'bg-green-500' 
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <button
              onClick={() => {
                const steps = ['age', 'privacy', 'cookies', 'summary'];
                const currentIndex = steps.indexOf(step);
                if (currentIndex > 0) {
                  setStep(steps[currentIndex - 1] as any);
                } else {
                  onDecline();
                }
              }}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {step === 'age' ? 'Decline' : 'Back'}
            </button>
            
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 'summary' ? 'Start Journey' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentFlow;