import React from 'react';
import { User, Crown, Menu, X } from 'lucide-react';
import { User as UserType } from '../store/appStore';
import Logo from './Logo';
import DarkModeToggle from './DarkModeToggle';
import NotificationManager from './NotificationManager';

interface HeaderProps {
  user: UserType | null;
  currentPage: string;
  onNavigate: (page: any) => void;
}

const Header: React.FC<HeaderProps> = ({ user, currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogoClick = () => {
    onNavigate('landing');
  };

  if (currentPage === 'landing') {
    return (
      <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-purple-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo onClick={handleLogoClick} />
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Pricing
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <button
                onClick={() => onNavigate('onboarding')}
                className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-2 rounded-full hover:scale-105 transition-transform"
              >
                Begin Your Journey
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (!user) return null;

  const navigationItems = [
    { key: 'dashboard', page: 'dashboard' as const, label: 'Dashboard' },
    { key: 'tasks', page: 'tasks' as const, label: 'Tasks' },
    { key: 'diary', page: 'diary' as const, label: 'Diary' },
    { key: 'rewards', page: 'rewards' as const, label: 'Rewards' }
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-purple-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Logo onClick={handleLogoClick} />
            
            <nav className="hidden md:flex space-x-6 ml-8">
              {navigationItems.map(({ key, page, label }) => (
                <button
                  key={key}
                  onClick={() => onNavigate(page)}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === page 
                      ? 'text-purple-600 dark:text-purple-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationManager />
            <DarkModeToggle />
            
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20 px-3 py-1 rounded-full">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium dark:text-white">Level {user.level}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">({user.xp} XP)</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-2xl">{user.avatar}</div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-purple-100 dark:border-gray-700">
          <nav className="px-4 py-2 space-y-1">
            {navigationItems.map(({ key, page, label }) => (
              <button
                key={key}
                onClick={() => {
                  onNavigate(page);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg"
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;