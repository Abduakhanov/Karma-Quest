import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import DiarySystem from './components/DiarySystem';
import RewardsHub from './components/RewardsHub';
import ExpertMarketplace from './components/ExpertMarketplace';
import Web3Dashboard from './components/Web3Dashboard';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';
import { AppState, Task, DiaryEntry, OnboardingData } from './types';
import { mockUser, mockKarmaAnalysis, achievements } from './data/mockData';
import { KarmaEngine } from './utils/karmaEngine';
import { offlineStorage } from './utils/offlineStorage';

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const [state, setState] = useState<AppState>({
    user: null,
    currentPage: 'landing',
    onboardingStep: 0,
    karmaAnalysis: null,
    tasks: [],
    diaryEntries: [
      {
        id: '1',
        date: new Date('2024-01-20'),
        title: 'First Day of My Journey',
        content: 'Today I started my KarmaQuest journey. I\'m excited to explore different belief systems and work on personal growth. I chose astrology, psychology, and chakras as my starting systems. The karma analysis was fascinating - it highlighted my strengths in intuition and empathy, but also pointed out my tendency to overthink. I\'m looking forward to completing the recommended tasks and seeing how they impact my daily life.',
        mood: 4,
        tags: ['new-beginning', 'excited', 'personal-growth'],
        insights: 'Your enthusiasm for growth is a powerful catalyst for positive change. Consider channeling this energy into consistent daily practices.',
        sentiment: 'positive'
      },
      {
        id: '2',
        date: new Date('2024-01-22'),
        title: 'Meditation Practice',
        content: 'Completed my second meditation session today. I\'m starting to notice subtle changes in how I respond to stress. Instead of immediately reacting, I find myself taking a moment to breathe. The chakra meditation was particularly powerful - I could feel energy flowing through my body. My astrology reading suggested that as a water sign, I should focus on emotional balance, which aligns perfectly with this practice.',
        mood: 5,
        tags: ['meditation', 'chakras', 'emotional-balance'],
        insights: 'Your growing self-awareness is creating space for more mindful responses to life\'s challenges. This is a sign of genuine spiritual progress.',
        sentiment: 'positive'
      }
    ],
    achievements: achievements,
    suggestedTasks: [],
    isLoading: false
  });

  // Initialize offline storage and load saved data
  useEffect(() => {
    const initializeApp = async () => {
      await offlineStorage.init();
      
      // Load saved state from localStorage
      const savedState = localStorage.getItem('karmaquest-state');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          setState(prev => ({
            ...prev,
            ...parsed,
            // Convert date strings back to Date objects
            user: parsed.user ? {
              ...parsed.user,
              joinDate: new Date(parsed.user.joinDate),
              birthDate: parsed.user.birthDate ? new Date(parsed.user.birthDate) : undefined
            } : null,
            diaryEntries: parsed.diaryEntries?.map((entry: any) => ({
              ...entry,
              date: new Date(entry.date)
            })) || [],
            tasks: parsed.tasks?.map((task: any) => ({
              ...task,
              createdAt: new Date(task.createdAt),
              dueDate: task.dueDate ? new Date(task.dueDate) : undefined
            })) || [],
            achievements: parsed.achievements?.map((achievement: any) => ({
              ...achievement,
              unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined
            })) || achievements
          }));
        } catch (error) {
          console.error('Failed to load saved state:', error);
        }
      }

      // Load offline data if available
      try {
        const offlineTasks = await offlineStorage.getTasks();
        const offlineDiaryEntries = await offlineStorage.getDiaryEntries();
        
        if (offlineTasks.length > 0 || offlineDiaryEntries.length > 0) {
          setState(prev => ({
            ...prev,
            tasks: offlineTasks.length > 0 ? offlineTasks : prev.tasks,
            diaryEntries: offlineDiaryEntries.length > 0 ? offlineDiaryEntries : prev.diaryEntries
          }));
        }
      } catch (error) {
        console.error('Failed to load offline data:', error);
      }
    };

    initializeApp();
  }, []);

  // Save state to localStorage and offline storage whenever it changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('karmaquest-state', JSON.stringify(state));
      
      // Save to offline storage
      offlineStorage.saveTasks(state.tasks);
      offlineStorage.saveDiaryEntries(state.diaryEntries);
    }
  }, [state]);

  // Set up language change handler
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      document.documentElement.lang = lng;
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    };

    i18n.on('languageChanged', handleLanguageChange);
    handleLanguageChange(i18n.language);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const handleNavigation = (page: AppState['currentPage']) => {
    setState(prev => ({ ...prev, currentPage: page }));
  };

  const handleOnboardingComplete = async (onboardingData: OnboardingData) => {
    setState(prev => ({ ...prev, isLoading: true }));

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
        timezone: onboardingData.profileData.timezone
      };

      // Generate suggested tasks
      const suggestedTasks = KarmaEngine.generateSuggestedTasks(onboardingData.selectedBeliefs);
      
      // Filter selected tasks
      const selectedTasks = suggestedTasks.filter(task => 
        onboardingData.selectedTasks.includes(task.id)
      );

      // Update achievements
      const updatedAchievements = achievements.map(achievement => {
        if (achievement.id === 'first-steps') {
          return {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date()
          };
        }
        if (achievement.id === 'belief-explorer' && onboardingData.selectedBeliefs.length >= 3) {
          return {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date()
          };
        }
        return achievement;
      });

      setState(prev => ({
        ...prev,
        user: newUser,
        karmaAnalysis: onboardingData.karmaInsight || null,
        tasks: selectedTasks,
        achievements: updatedAchievements,
        currentPage: 'dashboard',
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleTaskToggle = async (taskId: string) => {
    setState(prev => {
      const task = prev.tasks.find(t => t.id === taskId);
      if (!task) return prev;

      const updatedTasks = prev.tasks.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );

      let updatedUser = prev.user;
      let updatedAchievements = prev.achievements;

      if (!task.completed && updatedUser) {
        // Task is being completed
        updatedUser = {
          ...updatedUser,
          xp: updatedUser.xp + task.xpReward,
          totalXp: updatedUser.totalXp + task.xpReward,
          level: Math.floor((updatedUser.xp + task.xpReward) / 100) + 1
        };

        // Check for achievements
        const completedTasksCount = updatedTasks.filter(t => t.completed).length;
        
        updatedAchievements = updatedAchievements.map(achievement => {
          if (achievement.id === 'task-starter' && completedTasksCount >= 1 && !achievement.unlocked) {
            return { ...achievement, unlocked: true, unlockedAt: new Date() };
          }
          if (achievement.id === 'task-master' && completedTasksCount >= 10 && !achievement.unlocked) {
            return { ...achievement, unlocked: true, unlockedAt: new Date() };
          }
          return achievement;
        });
      }

      const newState = {
        ...prev,
        tasks: updatedTasks,
        user: updatedUser,
        achievements: updatedAchievements
      };

      // Save to offline storage
      offlineStorage.saveTasks(updatedTasks);

      return newState;
    });
  };

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));

    // Save to offline storage
    await offlineStorage.saveTask(newTask);
  };

  const handleAddDiaryEntry = async (entryData: Omit<DiaryEntry, 'id'>) => {
    const newEntry: DiaryEntry = {
      ...entryData,
      id: Date.now().toString()
    };
    
    setState(prev => {
      const updatedEntries = [newEntry, ...prev.diaryEntries];
      
      // Check for diary keeper achievement
      let updatedAchievements = prev.achievements;
      if (updatedEntries.length >= 5) {
        updatedAchievements = updatedAchievements.map(achievement => {
          if (achievement.id === 'diary-keeper' && !achievement.unlocked) {
            return { ...achievement, unlocked: true, unlockedAt: new Date() };
          }
          return achievement;
        });
      }

      return {
        ...prev,
        diaryEntries: updatedEntries,
        achievements: updatedAchievements
      };
    });

    // Save to offline storage
    await offlineStorage.saveDiaryEntry(newEntry);
  };

  const handleDeleteDiaryEntry = (entryId: string) => {
    setState(prev => ({
      ...prev,
      diaryEntries: prev.diaryEntries.filter(entry => entry.id !== entryId)
    }));
  };

  const renderCurrentPage = () => {
    switch (state.currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigation} />;
      case 'onboarding':
        return (
          <Onboarding
            state={state}
            onComplete={handleOnboardingComplete}
            onBack={() => handleNavigation('landing')}
          />
        );
      case 'dashboard':
        return state.karmaAnalysis && state.user ? (
          <Dashboard
            state={state}
            karmaAnalysis={state.karmaAnalysis}
            onNavigate={handleNavigation}
          />
        ) : null;
      case 'tasks':
        return (
          <TaskManager
            state={state}
            onTaskToggle={handleTaskToggle}
            onAddTask={handleAddTask}
          />
        );
      case 'diary':
        return (
          <DiarySystem
            state={state}
            onAddEntry={handleAddDiaryEntry}
            onDeleteEntry={handleDeleteDiaryEntry}
          />
        );
      case 'rewards':
        return <RewardsHub state={state} achievements={state.achievements} />;
      case 'marketplace':
        return <ExpertMarketplace />;
      case 'web3':
        return <Web3Dashboard />;
      default:
        return <LandingPage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
      <Header state={state} onNavigate={handleNavigation} />
      {renderCurrentPage()}
      <PWAInstallPrompt />
      <OfflineIndicator />
    </div>
  );
};

export default App;