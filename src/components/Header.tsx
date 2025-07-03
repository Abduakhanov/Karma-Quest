import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, Crown, Menu, X } from 'lucide-react';
import { AppState } from '../types';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  state: AppState;
  onNavigate: (page: AppState['currentPage']) => void;
}

const Header: React.FC<HeaderProps> = ({ state, onNavigate }) => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  if (state.currentPage === 'landing') {
    return (
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🌟</div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                KarmaQuest
              </span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">
                {t('landing.features.analysis.title')}
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors">
                Pricing
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <button
                onClick={() => onNavigate('onboarding')}
                className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-2 rounded-full hover:scale-105 transition-transform"
              >
                {t('landing.cta')}
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (!state.user) return null;

  return (
    <header className="bg-white shadow-sm border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🌟</div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                KarmaQuest
              </span>
            </div>
            
            <nav className="hidden md:flex space-x-6 ml-8">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`text-sm font-medium transition-colors ${
                  state.currentPage === 'dashboard' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                {t('navigation.dashboard')}
              </button>
              <button
                onClick={() => onNavigate('tasks')}
                className={`text-sm font-medium transition-colors ${
                  state.currentPage === 'tasks' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                {t('navigation.tasks')}
              </button>
              <button
                onClick={() => onNavigate('diary')}
                className={`text-sm font-medium transition-colors ${
                  state.currentPage === 'diary' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                {t('navigation.diary')}
              </button>
              <button
                onClick={() => onNavigate('rewards')}
                className={`text-sm font-medium transition-colors ${
                  state.currentPage === 'rewards' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                {t('navigation.rewards')}
              </button>
              <button
                onClick={() => onNavigate('marketplace')}
                className={`text-sm font-medium transition-colors ${
                  state.currentPage === 'marketplace' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                {t('navigation.marketplace')}
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-teal-50 px-3 py-1 rounded-full">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">{t('navigation.profile')} {state.user.level}</span>
              <span className="text-xs text-gray-600">({state.user.xp} XP)</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-2xl">{state.user.avatar}</div>
              <span className="text-sm font-medium text-gray-700">{state.user.name}</span>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-purple-100">
          <nav className="px-4 py-2 space-y-1">
            {[
              { key: 'dashboard', page: 'dashboard' as const },
              { key: 'tasks', page: 'tasks' as const },
              { key: 'diary', page: 'diary' as const },
              { key: 'rewards', page: 'rewards' as const },
              { key: 'marketplace', page: 'marketplace' as const }
            ].map(({ key, page }) => (
              <button
                key={key}
                onClick={() => {
                  onNavigate(page);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
              >
                {t(`navigation.${key}`)}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;