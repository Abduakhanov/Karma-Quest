import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  totalXp: number;
  avatar: string;
  joinDate: Date;
  beliefSystems: string[];
  onboardingStage: 'landing' | 'belief-pick' | 'profile' | 'insight' | 'quest-builder' | 'dashboard';
  birthDate?: Date;
  timezone?: string;
  streak: number;
  lastActiveDate?: Date;
  darkMode: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'relationships' | 'finances' | 'spirituality' | 'career';
  priority: 1 | 2 | 3 | 4 | 5;
  completed: boolean;
  xpReward: number;
  dueDate?: Date;
  createdAt: Date;
  source: 'auto-generated' | 'user-created' | 'expert-assigned';
  beliefSystemSource?: string;
  expertId?: string;
}

export interface DiaryEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  mood: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  insights?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  xpReward: number;
  condition: string;
}

export interface KarmaAnalysis {
  overallScore: number;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  areas: {
    health: number;
    relationships: number;
    finances: number;
    spirituality: number;
    career: number;
  };
  insights: {
    [beliefSystemId: string]: {
      score: number;
      explanation: string;
      recommendations: string[];
    };
  };
}

interface AppState {
  // User & Auth
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Navigation
  currentPage: 'landing' | 'onboarding' | 'dashboard' | 'tasks' | 'diary' | 'rewards' | 'marketplace';
  setCurrentPage: (page: AppState['currentPage']) => void;
  
  // Onboarding
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  
  // Karma Analysis
  karmaAnalysis: KarmaAnalysis | null;
  setKarmaAnalysis: (analysis: KarmaAnalysis | null) => void;
  
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTask: (taskId: string) => void;
  
  // Diary
  diaryEntries: DiaryEntry[];
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id'>) => void;
  deleteDiaryEntry: (entryId: string) => void;
  
  // Achievements
  achievements: Achievement[];
  unlockAchievement: (achievementId: string) => void;
  
  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Dark Mode
  toggleDarkMode: () => void;
  
  // Streak Management
  updateStreak: () => void;
  
  // Notifications
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      currentPage: 'landing',
      onboardingStep: 0,
      karmaAnalysis: null,
      tasks: [],
      diaryEntries: [],
      achievements: [
        {
          id: 'first-steps',
          title: 'First Steps',
          description: 'Complete your first karma analysis',
          icon: '👶',
          unlocked: false,
          xpReward: 50,
          condition: 'complete_onboarding'
        },
        {
          id: 'task-starter',
          title: 'Task Starter',
          description: 'Complete your first task',
          icon: '✅',
          unlocked: false,
          xpReward: 25,
          condition: 'complete_first_task'
        },
        {
          id: 'streak-warrior',
          title: 'Streak Warrior',
          description: 'Complete tasks for 7 days in a row',
          icon: '🔥',
          unlocked: false,
          xpReward: 200,
          condition: 'complete_7_day_streak'
        }
      ],
      isLoading: false,
      notificationsEnabled: false,

      // Actions
      setUser: (user) => set({ user }),
      
      setCurrentPage: (currentPage) => set({ currentPage }),
      
      setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
      
      setKarmaAnalysis: (karmaAnalysis) => set({ karmaAnalysis }),
      
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date()
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },
      
      toggleTask: (taskId) => {
        set((state) => {
          const task = state.tasks.find(t => t.id === taskId);
          if (!task) return state;

          const updatedTasks = state.tasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          );

          let updatedUser = state.user;
          let updatedAchievements = state.achievements;

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
              return achievement;
            });
          }

          return {
            tasks: updatedTasks,
            user: updatedUser,
            achievements: updatedAchievements
          };
        });
      },
      
      addDiaryEntry: (entryData) => {
        const newEntry: DiaryEntry = {
          ...entryData,
          id: Date.now().toString()
        };
        set((state) => ({
          diaryEntries: [newEntry, ...state.diaryEntries]
        }));
      },
      
      deleteDiaryEntry: (entryId) => {
        set((state) => ({
          diaryEntries: state.diaryEntries.filter(entry => entry.id !== entryId)
        }));
      },
      
      unlockAchievement: (achievementId) => {
        set((state) => ({
          achievements: state.achievements.map(achievement =>
            achievement.id === achievementId
              ? { ...achievement, unlocked: true, unlockedAt: new Date() }
              : achievement
          )
        }));
      },
      
      setIsLoading: (isLoading) => set({ isLoading }),
      
      toggleDarkMode: () => {
        set((state) => {
          const newDarkMode = !state.user?.darkMode;
          document.documentElement.classList.toggle('dark', newDarkMode);
          return {
            user: state.user ? { ...state.user, darkMode: newDarkMode } : null
          };
        });
      },
      
      updateStreak: () => {
        set((state) => {
          if (!state.user) return state;
          
          const today = new Date();
          const lastActive = state.user.lastActiveDate ? new Date(state.user.lastActiveDate) : null;
          
          let newStreak = state.user.streak;
          
          if (!lastActive) {
            newStreak = 1;
          } else {
            const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 1) {
              newStreak += 1;
            } else if (daysDiff > 1) {
              newStreak = 1;
            }
          }
          
          // Check for streak achievements
          let updatedAchievements = state.achievements;
          if (newStreak >= 7) {
            updatedAchievements = updatedAchievements.map(achievement =>
              achievement.id === 'streak-warrior' && !achievement.unlocked
                ? { ...achievement, unlocked: true, unlockedAt: new Date() }
                : achievement
            );
          }
          
          return {
            user: {
              ...state.user,
              streak: newStreak,
              lastActiveDate: today
            },
            achievements: updatedAchievements
          };
        });
      },
      
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled })
    }),
    {
      name: 'karmaquest-storage',
      partialize: (state) => ({
        user: state.user,
        tasks: state.tasks,
        diaryEntries: state.diaryEntries,
        achievements: state.achievements,
        karmaAnalysis: state.karmaAnalysis,
        notificationsEnabled: state.notificationsEnabled
      })
    }
  )
);