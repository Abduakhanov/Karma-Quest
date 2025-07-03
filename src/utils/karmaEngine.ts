import { BeliefSystem, KarmaAnalysis, Task } from '../types';
import { beliefSystems, taskTemplates } from '../data/mockData';

export class KarmaEngine {
  static async generateKarmaAnalysis(
    selectedBeliefs: string[],
    profileData: { name: string; birthDate?: Date; timezone: string }
  ): Promise<KarmaAnalysis> {
    // Simulate API calls to different belief system adapters
    await new Promise(resolve => setTimeout(resolve, 2000));

    const insights: KarmaAnalysis['insights'] = {};
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

  static generateSuggestedTasks(selectedBeliefs: string[]): Task[] {
    const tasks: Task[] = [];
    const categories = ['health', 'spirituality', 'relationships', 'finances', 'career'];

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

    // Add some generic tasks
    const genericTasks: Task[] = [
      {
        id: 'generic-1',
        title: 'Practice gratitude journaling',
        description: 'Write down 3 things you\'re grateful for today',
        category: 'spirituality',
        priority: 3,
        completed: false,
        xpReward: 20,
        createdAt: new Date(),
        source: 'auto-generated'
      },
      {
        id: 'generic-2',
        title: 'Take a mindful walk',
        description: 'Go for a 20-minute walk while focusing on your surroundings',
        category: 'health',
        priority: 2,
        completed: false,
        xpReward: 15,
        createdAt: new Date(),
        source: 'auto-generated'
      },
      {
        id: 'generic-3',
        title: 'Call a loved one',
        description: 'Reach out to someone important to you and have a meaningful conversation',
        category: 'relationships',
        priority: 4,
        completed: false,
        xpReward: 30,
        createdAt: new Date(),
        source: 'auto-generated'
      }
    ];

    return [...tasks, ...genericTasks].slice(0, 12); // Limit to 12 suggested tasks
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