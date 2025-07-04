import React, { useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import DiarySystem from './components/DiarySystem';
import RewardsHub from './components/RewardsHub';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';
import BackToTop from './components/BackToTop';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import NotificationManager from './components/NotificationManager';
import { useAppStore } from './store/appStore';
import { OnboardingData } from './types';
import { KarmaEngine } from './utils/karmaEngine';

const App: React.FC = () => {
  const {
    user,
    currentPage,
    karmaAnalysis,
    tasks,
    diaryEntries,
    achievements,
    isLoading,
    setUser,
    setCurrentPage,
    setKarmaAnalysis,
    addTask,
    toggleTask,
    addDiaryEntry,
    deleteDiaryEntry,
    setIsLoading,
    updateStreak
  } = useAppStore();

  // Update streak on app load
  useEffect(() => {
    if (user) {
      updateStreak();
    }
  }, [user, updateStreak]);

  const handleNavigation = (page: typeof currentPage) => {
    setCurrentPage(page);
  };

  const handleOnboardingComplete = async (onboardingData: OnboardingData) => {
    setIsLoading(true);

    try {
      // Create user from onboarding data
      const newUser = {
        id: Date.now().toString(),
        name: onboardingData.profileData.name,
        email: `${onboardingData.profileData.name.toLowerCase().replace(/\s+/g, '')}@karmaquest.com`,
        level: 1,
        xp: 50, // Starting XP for completing onboarding
        totalXp: 50,
        avatar: '🧘‍♀️',
        joinDate: new Date(),
        beliefSystems: onboardingData.selectedBeliefs,
        onboardingStage: 'dashboard' as const,
        birthDate: onboardingData.profileData.birthDate,
        timezone: onboardingData.profileData.timezone,
        streak: 0,
        darkMode: false
      };

      // Generate suggested tasks
      const suggestedTasks = KarmaEngine.generateSuggestedTasks(onboardingData.selectedBeliefs);
      
      // Filter selected tasks
      const selectedTasks = suggestedTasks.filter(task => 
        onboardingData.selectedTasks.includes(task.id)
      );

      // Add selected tasks
      selectedTasks.forEach(task => {
        addTask({
          title: task.title,
          description: task.description,
          category: task.category,
          priority: task.priority,
          completed: false,
          xpReward: task.xpReward,
          source: task.source,
          beliefSystemSource: task.beliefSystemSource
        });
      });

      setUser(newUser);
      setKarmaAnalysis(onboardingData.karmaInsight || null);
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigation} />;
      case 'onboarding':
        return (
          <Onboarding
            onComplete={handleOnboardingComplete}
            onBack={() => handleNavigation('landing')}
          />
        );
      case 'dashboard':
        return karmaAnalysis && user ? (
          <Dashboard
            user={user}
            karmaAnalysis={karmaAnalysis}
            tasks={tasks}
            diaryEntries={diaryEntries}
            achievements={achievements}
            onNavigate={handleNavigation}
          />
        ) : null;
      case 'tasks':
        return (
          <TaskManager
            tasks={tasks}
            onTaskToggle={toggleTask}
            onAddTask={addTask}
          />
        );
      case 'diary':
        return (
          <DiarySystem
            diaryEntries={diaryEntries}
            onAddEntry={addDiaryEntry}
            onDeleteEntry={deleteDiaryEntry}
          />
        );
      case 'rewards':
        return <RewardsHub user={user} achievements={achievements} />;
      default:
        return <LandingPage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <Header 
        user={user}
        currentPage={currentPage}
        onNavigate={handleNavigation}
      />
      {renderCurrentPage()}
      <BackToTop />
      <PWAInstallPrompt />
      <OfflineIndicator />
      <KeyboardShortcuts />
      <NotificationManager />
    </div>
  );
};

export default App;