import { KarmaTest, KarmaAnalysisResult, KarmaQuestion, KarmaOption } from '../types/karma';
import { karmaTypes, getKarmaTypeById } from '../data/karmaTypes';
import { getTestByBeliefSystem } from '../data/karmaTests';

export class KarmaAnalyzer {
  static analyzeKarma(
    selectedBeliefs: string[],
    testResponses: { [testId: string]: { [questionId: string]: any } },
    profileData: any
  ): KarmaAnalysisResult {
    const karmaScores: { [karmaTypeId: string]: number } = {};
    const beliefSystemInsights: { [beliefSystem: string]: any } = {};

    // Инициализируем счетчики для всех типов кармы
    karmaTypes.forEach(type => {
      karmaScores[type.id] = 0;
    });

    // Анализируем ответы для каждой системы верований
    selectedBeliefs.forEach(beliefSystem => {
      const test = getTestByBeliefSystem(beliefSystem);
      const responses = testResponses[beliefSystem];
      
      if (test && responses) {
        const analysis = this.analyzeBeliefSystemTest(test, responses);
        
        // Добавляем очки к соответствующим типам кармы
        Object.entries(analysis.scores).forEach(([karmaType, score]) => {
          karmaScores[karmaType] = (karmaScores[karmaType] || 0) + score;
        });

        beliefSystemInsights[beliefSystem] = analysis.insights;
      }
    });

    // Находим основной и вторичный типы кармы
    const sortedKarmaTypes = Object.entries(karmaScores)
      .sort(([,a], [,b]) => b - a)
      .filter(([,score]) => score > 0);

    const primaryKarmaId = sortedKarmaTypes[0]?.[0];
    const secondaryKarmaId = sortedKarmaTypes[1]?.[0];

    const primaryKarma = getKarmaTypeById(primaryKarmaId);
    const secondaryKarma = secondaryKarmaId ? getKarmaTypeById(secondaryKarmaId) : undefined;

    if (!primaryKarma) {
      throw new Error('Не удалось определить тип кармы');
    }

    // Вычисляем уверенность в результате
    const totalScore = Object.values(karmaScores).reduce((sum, score) => sum + score, 0);
    const confidence = totalScore > 0 ? (karmaScores[primaryKarmaId] / totalScore) * 100 : 0;

    // Создаем детальный анализ
    const detailedAnalysis = this.createDetailedAnalysis(
      primaryKarma,
      secondaryKarma,
      selectedBeliefs,
      profileData
    );

    return {
      primaryKarma,
      secondaryKarma,
      confidence: Math.round(confidence),
      detailedAnalysis,
      beliefSystemInsights
    };
  }

  private static analyzeBeliefSystemTest(
    test: KarmaTest,
    responses: { [questionId: string]: any }
  ): { scores: { [karmaType: string]: number }, insights: any } {
    const scores: { [karmaType: string]: number } = {};
    const insights: any = {};

    test.questions.forEach(question => {
      const response = responses[question.id];
      if (!response) return;

      const weight = question.weight || 1;

      if (question.type === 'choice' || question.type === 'scenario') {
        const selectedOption = question.options?.find(opt => opt.id === response);
        if (selectedOption?.karmaType) {
          scores[selectedOption.karmaType] = (scores[selectedOption.karmaType] || 0) + weight;
        }
      } else if (question.type === 'scale') {
        // Для шкальных вопросов анализируем по категориям
        if (question.category === 'altruism' && response >= 7) {
          scores['helper'] = (scores['helper'] || 0) + weight;
        }
      } else if (question.type === 'priority') {
        // Для вопросов приоритета даем больше очков первым выборам
        if (Array.isArray(response)) {
          response.forEach((optionId: string, index: number) => {
            const option = question.options?.find(opt => opt.id === optionId);
            if (option?.karmaType) {
              const priorityWeight = Math.max(1, 5 - index); // 5, 4, 3, 2, 1
              scores[option.karmaType] = (scores[option.karmaType] || 0) + (weight * priorityWeight);
            }
          });
        }
      }
    });

    // Создаем инсайты для системы верований
    insights.interpretation = this.generateBeliefSystemInterpretation(test.beliefSystem, scores);
    insights.specificGuidance = this.generateSpecificGuidance(test.beliefSystem, scores);

    return { scores, insights };
  }

  private static createDetailedAnalysis(
    primaryKarma: any,
    secondaryKarma: any,
    selectedBeliefs: string[],
    profileData: any
  ) {
    const combinedTraits = [...primaryKarma.traits];
    const combinedChallenges = [...primaryKarma.challenges];
    const combinedRecommendations = [...primaryKarma.recommendations];

    if (secondaryKarma) {
      // Добавляем уникальные черты вторичной кармы
      secondaryKarma.traits.forEach((trait: string) => {
        if (!combinedTraits.includes(trait)) {
          combinedTraits.push(trait);
        }
      });

      // Добавляем уникальные вызовы
      secondaryKarma.challenges.forEach((challenge: string) => {
        if (!combinedChallenges.includes(challenge)) {
          combinedChallenges.push(challenge);
        }
      });

      // Добавляем рекомендации
      secondaryKarma.recommendations.forEach((rec: string) => {
        if (!combinedRecommendations.includes(rec)) {
          combinedRecommendations.push(rec);
        }
      });
    }

    // Персонализируем рекомендации на основе выбранных систем верований
    const personalizedRecommendations = this.personalizeRecommendations(
      combinedRecommendations,
      selectedBeliefs,
      primaryKarma
    );

    return {
      strengths: combinedTraits.slice(0, 5),
      challenges: combinedChallenges.slice(0, 3),
      lifeLesson: primaryKarma.lifeLesson,
      spiritualGift: primaryKarma.spiritualGift,
      recommendations: personalizedRecommendations.slice(0, 6)
    };
  }

  private static generateBeliefSystemInterpretation(beliefSystem: string, scores: any): string {
    const topKarmaType = Object.entries(scores)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0];

    const interpretations: { [key: string]: { [karmaType: string]: string } } = {
      astrology: {
        helper: 'Ваша астрологическая карта показывает сильное влияние Венеры и Луны, что указывает на природную склонность к заботе о других.',
        leader: 'Солнце и Марс доминируют в вашей карте, наделяя вас природными лидерскими качествами.',
        creator: 'Меркурий и Уран создают мощную комбинацию для творческого самовыражения.',
        protector: 'Марс и Сатурн в вашей карте указывают на роль защитника и хранителя.',
        teacher: 'Юпитер и Меркурий наделяют вас мудростью и способностью делиться знаниями.',
        healer: 'Нептун и Луна создают глубокую связь с исцеляющими энергиями.',
        seeker: 'Юпитер и Нептун направляют вас на поиск высших истин.',
        independent: 'Уран и Сатурн дают вам силу идти своим уникальным путем.'
      },
      psychology: {
        helper: 'Ваш психологический профиль показывает высокий уровень эмпатии и альтруизма.',
        leader: 'Вы демонстрируете сильные лидерские качества и способность мотивировать других.',
        creator: 'Ваша креативность и открытость новому опыту выделяют вас как творческую личность.',
        protector: 'Ваша ответственность и забота о справедливости делают вас природным защитником.',
        teacher: 'Ваше терпение и способность к объяснению указывают на талант учителя.',
        healer: 'Ваша чувствительность и интуиция создают природные способности к исцелению.',
        seeker: 'Ваша любознательность и глубина мышления направляют вас к поиску истины.',
        independent: 'Ваша самостоятельность и внутренняя мотивация показывают независимую натуру.'
      },
      chakras: {
        helper: 'Ваша сердечная чакра особенно активна, что проявляется в естественном желании помогать.',
        leader: 'Коронная чакра и солнечное сплетение создают мощную энергию лидерства.',
        creator: 'Сакральная и горловая чакры работают в гармонии для творческого самовыражения.',
        protector: 'Солнечное сплетение и корневая чакра дают вам силу защищать других.',
        teacher: 'Горловая чакра и третий глаз активны, что способствует передаче знаний.',
        healer: 'Сердечная чакра излучает исцеляющую энергию для окружающих.',
        seeker: 'Третий глаз и коронная чакра открывают путь к высшему знанию.',
        independent: 'Корневая чакра дает вам силу стоять на собственных ногах.'
      }
    };

    return interpretations[beliefSystem]?.[topKarmaType] || 
           `Ваш профиль в ${beliefSystem} указывает на уникальный духовный путь.`;
  }

  private static generateSpecificGuidance(beliefSystem: string, scores: any): string[] {
    const guidance: { [key: string]: string[] } = {
      astrology: [
        'Изучите транзиты планет для понимания жизненных циклов',
        'Работайте с энергиями новолуния и полнолуния',
        'Медитируйте на свой солнечный знак для усиления природных качеств'
      ],
      psychology: [
        'Практикуйте техники осознанности для развития самопознания',
        'Ведите дневник эмоций для лучшего понимания себя',
        'Изучайте когнитивно-поведенческие техники'
      ],
      chakras: [
        'Практикуйте медитацию на чакры ежедневно',
        'Используйте соответствующие кристаллы для балансировки энергии',
        'Работайте с мантрами для активации энергетических центров'
      ],
      numerology: [
        'Изучите значение вашего числа жизненного пути',
        'Используйте персональные числа для принятия решений',
        'Практикуйте нумерологическую медитацию'
      ],
      tarot: [
        'Делайте ежедневные расклады для самопознания',
        'Медитируйте на архетипы Старших Арканов',
        'Ведите дневник таро для отслеживания паттернов'
      ]
    };

    return guidance[beliefSystem] || [
      'Продолжайте изучать выбранную систему верований',
      'Практикуйте регулярную медитацию',
      'Ведите духовный дневник'
    ];
  }

  private static personalizeRecommendations(
    recommendations: string[],
    selectedBeliefs: string[],
    primaryKarma: any
  ): string[] {
    const personalized = [...recommendations];

    // Добавляем специфические рекомендации на основе систем верований
    if (selectedBeliefs.includes('astrology')) {
      personalized.push(`Изучите влияние ${primaryKarma.element} стихии на вашу жизнь`);
    }

    if (selectedBeliefs.includes('chakras')) {
      personalized.push(`Работайте с ${primaryKarma.chakra} для усиления вашего дара`);
    }

    if (selectedBeliefs.includes('psychology')) {
      personalized.push('Изучайте психологию личности для лучшего самопонимания');
    }

    return personalized;
  }
}