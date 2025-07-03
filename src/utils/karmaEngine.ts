import { BeliefSystem, KarmaAnalysis, Task } from '../types';
import { KarmaAnalysisResult } from '../types/karma';
import { beliefSystems, taskTemplates } from '../data/mockData';
import { EnhancedKarmaAnalyzer } from './enhancedKarmaAnalyzer';
import { getExtendedTestByBeliefSystem } from '../data/extendedKarmaTests';

export class KarmaEngine {
  static async generateKarmaAnalysis(
    selectedBeliefs: string[],
    profileData: { name: string; birthDate?: Date; timezone: string },
    testResponses?: { [beliefSystem: string]: { [questionId: string]: any } }
  ): Promise<KarmaAnalysisResult> {
    // Simulate API calls to different belief system adapters
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (testResponses) {
      // Используем новый расширенный анализатор кармы
      return EnhancedKarmaAnalyzer.analyzeKarma(selectedBeliefs, testResponses, profileData);
    }

    // Fallback к старому методу для совместимости
    return this.generateLegacyKarmaAnalysis(selectedBeliefs, profileData);
  }

  private static async generateLegacyKarmaAnalysis(
    selectedBeliefs: string[],
    profileData: { name: string; birthDate?: Date; timezone: string }
  ): Promise<any> {
    const insights: any = {};
    let totalScore = 0;

    for (const beliefId of selectedBeliefs) {
      const belief = beliefSystems.find(b => b.id === beliefId);
      if (belief) {
        const score = this.calculateBeliefScore(belief, profileData);
        insights[beliefId] = {
          score,
          explanation: this.generateExplanation(belief, profileData),
          recommendations: this.generateRecommendations(belief)
        };
        totalScore += score;
      }
    }

    const overallScore = Math.round(totalScore / selectedBeliefs.length);

    return {
      overallScore,
      strengths: this.generateStrengths(selectedBeliefs, overallScore),
      challenges: this.generateChallenges(selectedBeliefs, overallScore),
      recommendations: this.generateGlobalRecommendations(selectedBeliefs),
      areas: {
        health: Math.max(60, overallScore + Math.random() * 20 - 10),
        relationships: Math.max(60, overallScore + Math.random() * 20 - 10),
        finances: Math.max(60, overallScore + Math.random() * 20 - 10),
        spirituality: Math.max(60, overallScore + Math.random() * 20 - 10),
        career: Math.max(60, overallScore + Math.random() * 20 - 10)
      },
      insights
    };
  }

  static generateSuggestedTasks(selectedBeliefs: string[], karmaType?: string): Task[] {
    const tasks: Task[] = [];
    const categories = ['health', 'spirituality', 'relationships', 'finances', 'career'];

    // Генерируем задачи на основе типа кармы
    if (karmaType) {
      const karmaTasks = this.generateKarmaSpecificTasks(karmaType);
      tasks.push(...karmaTasks);
    }

    for (const category of categories) {
      for (const beliefId of selectedBeliefs) {
        const categoryTasks = taskTemplates[category]?.[beliefId];
        if (categoryTasks) {
          tasks.push(...categoryTasks.map(task => ({
            ...task,
            id: `${task.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          })));
        }
      }
    }

    // Добавляем универсальные задачи на основе кармы
    if (karmaType) {
      const universalTasks = this.generateUniversalKarmaTasks(karmaType);
      tasks.push(...universalTasks);
    }

    // Добавляем некоторые общие задачи
    const genericTasks: Task[] = [
      {
        id: 'generic-1',
        title: 'Практика благодарности',
        description: 'Запишите 3 вещи, за которые вы благодарны сегодня',
        category: 'spirituality',
        priority: 3,
        completed: false,
        xpReward: 20,
        createdAt: new Date(),
        source: 'auto-generated'
      },
      {
        id: 'generic-2',
        title: 'Осознанная прогулка',
        description: 'Совершите 20-минутную прогулку, фокусируясь на окружающем мире',
        category: 'health',
        priority: 2,
        completed: false,
        xpReward: 15,
        createdAt: new Date(),
        source: 'auto-generated'
      },
      {
        id: 'generic-3',
        title: 'Связь с близкими',
        description: 'Свяжитесь с важным для вас человеком и проведите содержательный разговор',
        category: 'relationships',
        priority: 4,
        completed: false,
        xpReward: 30,
        createdAt: new Date(),
        source: 'auto-generated'
      }
    ];

    return [...tasks, ...genericTasks].slice(0, 15); // Ограничиваем до 15 предложенных задач
  }

  private static generateKarmaSpecificTasks(karmaType: string): Task[] {
    const karmaTasks: { [key: string]: Task[] } = {
      helper: [
        {
          id: 'helper-1',
          title: 'Помогите незнакомцу',
          description: 'Найдите способ помочь кому-то, кого вы не знаете',
          category: 'relationships',
          priority: 4,
          completed: false,
          xpReward: 35,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        },
        {
          id: 'helper-2',
          title: 'Волонтерская работа',
          description: 'Посвятите 2 часа волонтерской деятельности',
          category: 'spirituality',
          priority: 5,
          completed: false,
          xpReward: 50,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        },
        {
          id: 'helper-3',
          title: 'Поддержите друга',
          description: 'Активно выслушайте друга, который переживает трудности',
          category: 'relationships',
          priority: 3,
          completed: false,
          xpReward: 25,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        }
      ],
      independent: [
        {
          id: 'independent-1',
          title: 'Примите решение самостоятельно',
          description: 'Сделайте важный выбор, полагаясь только на свою интуицию',
          category: 'spirituality',
          priority: 4,
          completed: false,
          xpReward: 30,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        },
        {
          id: 'independent-2',
          title: 'Время в одиночестве',
          description: 'Проведите день наедине с собой, без социальных медиа',
          category: 'health',
          priority: 3,
          completed: false,
          xpReward: 25,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        },
        {
          id: 'independent-3',
          title: 'Следуйте своему пути',
          description: 'Сделайте что-то, что важно для вас, несмотря на мнение других',
          category: 'spirituality',
          priority: 5,
          completed: false,
          xpReward: 40,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        }
      ],
      creator: [
        {
          id: 'creator-1',
          title: 'Создайте что-то новое',
          description: 'Воплотите в жизнь творческую идею, которая давно у вас в голове',
          category: 'spirituality',
          priority: 5,
          completed: false,
          xpReward: 40,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        },
        {
          id: 'creator-2',
          title: 'Поделитесь творчеством',
          description: 'Покажите свое творение другим людям',
          category: 'relationships',
          priority: 3,
          completed: false,
          xpReward: 30,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        },
        {
          id: 'creator-3',
          title: 'Вдохновите других',
          description: 'Поделитесь своим творческим процессом с кем-то еще',
          category: 'relationships',
          priority: 4,
          completed: false,
          xpReward: 35,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        }
      ],
      leader: [
        {
          id: 'leader-1',
          title: 'Возглавьте проект',
          description: 'Инициируйте и возглавьте групповую активность',
          category: 'career',
          priority: 5,
          completed: false,
          xpReward: 45,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        },
        {
          id: 'leader-2',
          title: 'Наставничество',
          description: 'Станьте ментором для кого-то младшего или менее опытного',
          category: 'relationships',
          priority: 4,
          completed: false,
          xpReward: 35,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        },
        {
          id: 'leader-3',
          title: 'Вдохновите команду',
          description: 'Мотивируйте группу людей к достижению общей цели',
          category: 'career',
          priority: 4,
          completed: false,
          xpReward: 40,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        }
      ],
      teacher: [
        {
          id: 'teacher-1',
          title: 'Поделитесь знанием',
          description: 'Научите кого-то новому навыку или поделитесь опытом',
          category: 'relationships',
          priority: 4,
          completed: false,
          xpReward: 35,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        },
        {
          id: 'teacher-2',
          title: 'Создайте обучающий контент',
          description: 'Напишите статью или создайте видео на тему, в которой разбираетесь',
          category: 'spirituality',
          priority: 3,
          completed: false,
          xpReward: 30,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        }
      ],
      healer: [
        {
          id: 'healer-1',
          title: 'Исцеляющее присутствие',
          description: 'Проведите время с кем-то, кто нуждается в эмоциональной поддержке',
          category: 'relationships',
          priority: 5,
          completed: false,
          xpReward: 40,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        },
        {
          id: 'healer-2',
          title: 'Энергетическое очищение',
          description: 'Проведите ритуал очищения пространства или медитацию исцеления',
          category: 'spirituality',
          priority: 4,
          completed: false,
          xpReward: 35,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        }
      ],
      protector: [
        {
          id: 'protector-1',
          title: 'Защитите уязвимых',
          description: 'Встаньте на защиту того, кто не может защитить себя сам',
          category: 'relationships',
          priority: 5,
          completed: false,
          xpReward: 45,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        },
        {
          id: 'protector-2',
          title: 'Создайте безопасность',
          description: 'Обеспечьте безопасное пространство для группы или сообщества',
          category: 'relationships',
          priority: 4,
          completed: false,
          xpReward: 35,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        }
      ],
      seeker: [
        {
          id: 'seeker-1',
          title: 'Глубокое исследование',
          description: 'Изучите философский или духовный вопрос, который вас интересует',
          category: 'spirituality',
          priority: 4,
          completed: false,
          xpReward: 35,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        },
        {
          id: 'seeker-2',
          title: 'Медитативная практика',
          description: 'Проведите час в глубокой медитации или созерцании',
          category: 'spirituality',
          priority: 3,
          completed: false,
          xpReward: 30,
          createdAt: new Date(),
          source: 'auto-generated',
          beliefSystemSource: 'karma-type'
        }
      ]
    };

    return karmaTasks[karmaType] || [];
  }

  private static generateUniversalKarmaTasks(karmaType: string): Task[] {
    // Универсальные задачи, которые подходят всем типам кармы, но адаптированы под конкретный тип
    const universalTasks: Task[] = [
      {
        id: `universal-meditation-${karmaType}`,
        title: 'Кармическая медитация',
        description: `Медитируйте 15 минут, фокусируясь на своем предназначении как ${this.getKarmaTypeName(karmaType)}`,
        category: 'spirituality',
        priority: 3,
        completed: false,
        xpReward: 25,
        createdAt: new Date(),
        source: 'auto-generated',
        beliefSystemSource: 'karma-universal'
      },
      {
        id: `universal-reflection-${karmaType}`,
        title: 'Дневник кармы',
        description: `Запишите, как вы проявили качества ${this.getKarmaTypeName(karmaType)} сегодня`,
        category: 'spirituality',
        priority: 2,
        completed: false,
        xpReward: 20,
        createdAt: new Date(),
        source: 'auto-generated',
        beliefSystemSource: 'karma-universal'
      }
    ];

    return universalTasks;
  }

  private static getKarmaTypeName(karmaType: string): string {
    const names: { [key: string]: string } = {
      helper: 'помощника людям',
      independent: 'независимого духа',
      creator: 'творца и созидателя',
      protector: 'защитника и хранителя',
      teacher: 'учителя и наставника',
      healer: 'целителя душ',
      leader: 'лидера и вдохновителя',
      seeker: 'искателя истины'
    };
    return names[karmaType] || karmaType;
  }

  private static calculateBeliefScore(belief: BeliefSystem, profileData: any): number {
    // Mock scoring algorithm based on belief system
    const baseScore = 65 + Math.random() * 30;
    
    if (belief.category === 'spiritual') {
      return Math.min(95, baseScore + 10);
    } else if (belief.category === 'psychological') {
      return Math.min(90, baseScore + 5);
    }
    
    return Math.round(baseScore);
  }

  private static generateExplanation(belief: BeliefSystem, profileData: any): string {
    const explanations = {
      astrology: `Based on your birth date, your astrological profile shows strong ${this.getRandomElement(['intuitive', 'analytical', 'creative'])} tendencies with ${this.getRandomElement(['fire', 'earth', 'air', 'water'])} sign influences.`,
      psychology: `Your psychological profile indicates ${this.getRandomElement(['high', 'moderate', 'balanced'])} levels of ${this.getRandomElement(['openness', 'conscientiousness', 'extraversion'])} with strong ${this.getRandomElement(['emotional intelligence', 'cognitive flexibility', 'resilience'])}.`,
      numerology: `Your life path number reveals a ${this.getRandomElement(['natural leader', 'creative visionary', 'analytical thinker'])} with strong ${this.getRandomElement(['communication', 'intuitive', 'practical'])} abilities.`,
      chakras: `Your energy centers show ${this.getRandomElement(['balanced', 'active', 'developing'])} ${this.getRandomElement(['heart', 'throat', 'crown'])} chakra with opportunities for ${this.getRandomElement(['grounding', 'expression', 'spiritual growth'])}.`,
      tarot: `The cards suggest you're in a phase of ${this.getRandomElement(['transformation', 'growth', 'manifestation'])} with strong ${this.getRandomElement(['intuitive', 'creative', 'leadership'])} energies.`
    };

    return explanations[belief.id as keyof typeof explanations] || `Your ${belief.name} profile shows positive indicators for personal growth and development.`;
  }

  private static generateRecommendations(belief: BeliefSystem): string[] {
    const recommendations = {
      astrology: ['Work with lunar cycles for planning', 'Focus on your rising sign qualities', 'Practice planetary meditations'],
      psychology: ['Develop emotional regulation skills', 'Practice cognitive reframing', 'Build mindfulness habits'],
      numerology: ['Align actions with your life path', 'Use your power numbers for decisions', 'Practice number meditation'],
      chakras: ['Balance your energy centers daily', 'Practice chakra-specific meditations', 'Use corresponding colors and crystals'],
      tarot: ['Draw daily guidance cards', 'Practice intuitive reading', 'Journal about card messages']
    };

    return recommendations[belief.id as keyof typeof recommendations] || ['Practice self-reflection', 'Develop awareness', 'Trust your intuition'];
  }

  private static generateStrengths(beliefs: string[], score: number): string[] {
    const strengthPool = [
      'Strong intuitive abilities',
      'Natural empathy and compassion',
      'Creative problem-solving skills',
      'Leadership potential',
      'Excellent communication abilities',
      'Deep spiritual connection',
      'Analytical thinking',
      'Emotional intelligence',
      'Adaptability and flexibility',
      'Strong moral compass'
    ];

    return this.getRandomElements(strengthPool, 3);
  }

  private static generateChallenges(beliefs: string[], score: number): string[] {
    const challengePool = [
      'Tendency to overthink situations',
      'Perfectionism can lead to procrastination',
      'Difficulty setting boundaries',
      'Self-doubt in decision making',
      'Sensitivity to others\' emotions',
      'Impatience with slow progress',
      'Avoiding difficult conversations',
      'Comparing yourself to others',
      'Fear of taking risks',
      'Struggling with work-life balance'
    ];

    return this.getRandomElements(challengePool, 3);
  }

  private static generateGlobalRecommendations(beliefs: string[]): string[] {
    const recommendations = [
      'Practice daily meditation for mental clarity',
      'Keep a gratitude journal to shift perspective',
      'Engage in regular physical exercise',
      'Develop a consistent sleep routine',
      'Practice setting healthy boundaries',
      'Cultivate meaningful relationships',
      'Pursue creative self-expression',
      'Learn stress management techniques'
    ];

    return this.getRandomElements(recommendations, 4);
  }

  private static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}