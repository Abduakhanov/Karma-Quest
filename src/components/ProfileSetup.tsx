import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, User, Globe } from 'lucide-react';

interface ProfileSetupProps {
  profileData: {
    name: string;
    birthDate?: Date;
    timezone: string;
  };
  onProfileChange: (data: { name: string; birthDate?: Date; timezone: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({
  profileData,
  onProfileChange,
  onNext,
  onBack
}) => {
  const { t } = useTranslation(['onboarding', 'common']);
  const [formData, setFormData] = useState(profileData);
  const [selectedAvatar, setSelectedAvatar] = useState('🧘‍♀️');

  const avatarOptions = [
    '🧘‍♀️', '🧘‍♂️', '🌟', '🔮', '🦋', '🌙', '✨', '🎭',
    '🌈', '🕉️', '⭐', '🌸', '🔥', '💎', '🌊', '🍃'
  ];

  const timezones = [
    'UTC-12', 'UTC-11', 'UTC-10', 'UTC-9', 'UTC-8', 'UTC-7', 'UTC-6', 'UTC-5',
    'UTC-4', 'UTC-3', 'UTC-2', 'UTC-1', 'UTC+0', 'UTC+1', 'UTC+2', 'UTC+3',
    'UTC+4', 'UTC+5', 'UTC+6', 'UTC+7', 'UTC+8', 'UTC+9', 'UTC+10', 'UTC+11', 'UTC+12'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    onProfileChange(newData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t('profile.title')}
        </h2>
        <p className="text-xl text-gray-600">
          {t('profile.description')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar Selection */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-purple-600" />
            {t('profile.avatar')}
          </h3>
          <div className="grid grid-cols-8 gap-3">
            {avatarOptions.map((avatar) => (
              <button
                key={avatar}
                type="button"
                onClick={() => setSelectedAvatar(avatar)}
                className={`text-2xl p-3 rounded-lg border-2 transition-all hover:scale-110 ${
                  selectedAvatar === avatar
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-300 hover:border-purple-300'
                }`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-purple-600" />
            Personal Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('profile.name')} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={t('profile.namePlaceholder')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('profile.birthDate')}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={formData.birthDate ? formData.birthDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => updateFormData({ 
                    birthDate: e.target.value ? new Date(e.target.value) : undefined 
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t('profile.birthDateHelp')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('profile.timezone')} *
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={formData.timezone}
                  onChange={(e) => updateFormData({ timezone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">{t('profile.privacy.title')}</h4>
          <p className="text-sm text-blue-700">
            {t('profile.privacy.description')}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
          >
            ← {t('common:buttons.back')}
          </button>

          <button
            type="submit"
            disabled={!formData.name.trim()}
            className={`flex items-center px-8 py-3 rounded-full font-semibold transition-all ${
              formData.name.trim()
                ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white hover:scale-105 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {t('profile.generateAnalysis')} →
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSetup;