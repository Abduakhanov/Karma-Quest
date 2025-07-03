import { BeliefSystem, Achievement, User, KarmaAnalysis, Task } from '../types';

export const beliefSystems: BeliefSystem[] = [
  {
    id: 'astrology',
    name: 'Astrology',
    description: 'Celestial influence on personality and life events through planetary positions',
    icon: '🌟',
    category: 'spiritual',
    adapterKey: 'astrology_adapter',
    popular: true
  },
  {
    id: 'numerology',
    name: 'Numerology',
    description: 'Mystical relationship between numbers and life events',
    icon: '🔢',
    category: 'spiritual',
    adapterKey: 'numerology_adapter',
    popular: true
  },
  {
    id: 'psychology',
    name: 'Psychology',
    description: 'Scientific study of mind, behavior, and cognitive patterns',
    icon: '🧠',
    category: 'scientific',
    adapterKey: 'psychology_adapter',
    popular: true
  },
  {
    id: 'human-design',
    name: 'Human Design',
    description: 'System combining astrology, I Ching, Kabbalah, and chakras',
    icon: '🎯',
    category: 'spiritual',
    adapterKey: 'human_design_adapter',
    popular: false
  },
  {
    id: 'tarot',
    name: 'Tarot',
    description: 'Divination and self-reflection using symbolic cards',
    icon: '🔮',
    category: 'spiritual',
    adapterKey: 'tarot_adapter',
    popular: true
  },
  {
    id: 'mbti',
    name: 'Myers-Briggs',
    description: 'Personality type indicator based on cognitive preferences',
    icon: '🎭',
    category: 'psychological',
    adapterKey: 'mbti_adapter',
    popular: true
  },
  {
    id: 'chakras',
    name: 'Chakra System',
    description: 'Seven energy centers governing physical and spiritual well-being',
    icon: '🌈',
    category: 'spiritual',
    adapterKey: 'chakra_adapter',
    popular: false
  },
  {
    id: 'enneagram',
    name: 'Enneagram',
    description: 'Nine personality types system focusing on core motivations',
    icon: '⭐',
    category: 'psychological',
    adapterKey: 'enneagram_adapter',
    popular: false
  },
  {
    id: 'chinese-zodiac',
    name: 'Chinese Zodiac',
    description: 'Twelve-year cycle of animals representing personality traits',
    icon: '🐉',
    category: 'traditional',
    adapterKey: 'chinese_zodiac_adapter',
    popular: false
  },
  {
    id: 'ayurveda',
    name: 'Ayurveda',
    description: 'Ancient Indian system of medicine and life balance',
    icon: '🕉️',
    category: 'traditional',
    adapterKey: 'ayurveda_adapter',
    popular: false
  }
];

export const achievements: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first karma analysis',
    icon: '👶',
    unlocked: true,
    unlockedAt: new Date('2024-01-20'),
    xpReward: 50,
    condition: 'complete_onboarding'
  },
  {
    id: 'belief-explorer',
    title: 'Belief Explorer',
    description: 'Select 3 or more belief systems',
    icon: '🔍',
    unlocked: true,
    unlockedAt: new Date('2024-01-20'),
    xpReward: 75,
    condition: 'select_3_beliefs'
  },
  {
    id: 'task-starter',
    title: 'Task Starter',
    description: 'Complete your first task',
    icon: '✅',
    unlocked: true,
    unlockedAt: new Date('2024-01-22'),
    xpReward: 25,
    condition: 'complete_first_task'
  },
  {
    id: 'task-master',
    title: 'Task Master',
    description: 'Complete 10 tasks',
    icon: '🏆',
    unlocked: false,
    xpReward: 100,
    condition: 'complete_10_tasks'
  },
  {
    id: 'diary-keeper',
    title: 'Diary Keeper',
    description: 'Write 5 diary entries',
    icon: '📔',
    unlocked: false,
    xpReward: 75,
    condition: 'write_5_entries'
  },
  {
    id: 'streak-warrior',
    title: 'Streak Warrior',
    description: 'Complete tasks for 7 days in a row',
    icon: '🔥',
    unlocked: false,
    xpReward: 200,
    condition: 'complete_7_day_streak'
  },
  {
    id: 'seeker',
    title: 'The Seeker',
    description: 'Try 5 different belief systems',
    icon: '🌟',
    unlocked: false,
    xpReward: 150,
    condition: 'try_5_beliefs'
  },
  {
    id: 'level-up',
    title: 'Level Up',
    description: 'Reach level 5',
    icon: '⬆️',
    unlocked: false,
    xpReward: 100,
    condition: 'reach_level_5'
  }
];

export const mockUser: User = {
  id: '1',
  name: 'Karma Seeker',
  email: 'seeker@karmaquest.com',
  level: 3,
  xp: 450,
  totalXp: 450,
  avatar: '🧘‍♀️',
  joinDate: new Date('2024-01-15'),
  beliefSystems: ['astrology', 'psychology', 'chakras'],
  onboardingStage: 'dashboard',
  birthDate: new Date('1990-06-15'),
  timezone: 'UTC+3'
};

export const mockKarmaAnalysis: KarmaAnalysis = {
  overallScore: 72,
  strengths: ['Strong intuition and empathetic nature', 'Creative problem-solving abilities', 'Natural leadership qualities'],
  challenges: ['Tendency to overthink decisions', 'Perfectionism can lead to procrastination', 'Difficulty setting boundaries'],
  recommendations: [
    'Practice daily meditation for 10 minutes to calm the mind',
    'Express gratitude in a journal to shift focus to positives',
    'Engage in creative activities to channel your artistic energy',
    'Set healthy boundaries with others to protect your energy'
  ],
  areas: {
    health: 68,
    relationships: 78,
    finances: 65,
    spirituality: 85,
    career: 70
  },
  insights: {
    astrology: {
      score: 78,
      explanation: 'As a Gemini with Cancer rising, you have a natural curiosity and emotional depth. Your Mercury in Gemini enhances communication skills.',
      recommendations: ['Focus on grounding practices', 'Develop consistent routines', 'Trust your intuitive insights']
    },
    psychology: {
      score: 72,
      explanation: 'Your personality profile suggests high openness to experience and conscientiousness, with moderate extraversion.',
      recommendations: ['Embrace new learning opportunities', 'Practice mindfulness techniques', 'Build structured goal-setting habits']
    },
    chakras: {
      score: 85,
      explanation: 'Your heart and crown chakras are well-balanced, indicating strong spiritual connection and capacity for love.',
      recommendations: ['Work on solar plexus chakra for confidence', 'Practice throat chakra exercises for communication', 'Maintain crown chakra through meditation']
    }
  }
};

export const taskTemplates: { [category: string]: { [beliefSystem: string]: Task[] } } = {
  health: {
    astrology: [
      {
        id: 'astro-health-1',
        title: 'Moon phase wellness routine',
        description: 'Align your self-care practices with the current moon phase for optimal energy',
        category: 'health',
        priority: 3,
        completed: false,
        xpReward: 25,
        createdAt: new Date(),
        source: 'auto-generated',
        beliefSystemSource: 'astrology'
      }
    ],
    psychology: [
      {
        id: 'psych-health-1',
        title: 'Mindfulness meditation practice',
        description: 'Practice 10 minutes of mindfulness meditation to reduce stress and improve focus',
        category: 'health',
        priority: 4,
        completed: false,
        xpReward: 30,
        createdAt: new Date(),
        source: 'auto-generated',
        beliefSystemSource: 'psychology'
      }
    ],
    chakras: [
      {
        id: 'chakra-health-1',
        title: 'Root chakra grounding exercise',
        description: 'Spend 15 minutes in nature to strengthen your connection to earth energy',
        category: 'health',
        priority: 3,
        completed: false,
        xpReward: 20,
        createdAt: new Date(),
        source: 'auto-generated',
        beliefSystemSource: 'chakras'
      }
    ]
  },
  spirituality: {
    astrology: [
      {
        id: 'astro-spirit-1',
        title: 'Planetary hour meditation',
        description: 'Meditate during your ruling planet\'s hour for enhanced spiritual connection',
        category: 'spirituality',
        priority: 4,
        completed: false,
        xpReward: 35,
        createdAt: new Date(),
        source: 'auto-generated',
        beliefSystemSource: 'astrology'
      }
    ],
    tarot: [
      {
        id: 'tarot-spirit-1',
        title: 'Daily card reflection',
        description: 'Draw a daily tarot card and reflect on its message for personal guidance',
        category: 'spirituality',
        priority: 2,
        completed: false,
        xpReward: 15,
        createdAt: new Date(),
        source: 'auto-generated',
        beliefSystemSource: 'tarot'
      }
    ]
  },
  relationships: {
    psychology: [
      {
        id: 'psych-rel-1',
        title: 'Active listening practice',
        description: 'Practice active listening with a friend or family member for 20 minutes',
        category: 'relationships',
        priority: 3,
        completed: false,
        xpReward: 25,
        createdAt: new Date(),
        source: 'auto-generated',
        beliefSystemSource: 'psychology'
      }
    ]
  }
};