import { KarmaTest, KarmaAnalysisResult, KarmaQuestion } from '../types/karma';
import { karmaTypes, getKarmaTypeById } from '../data/karmaTypes';
import { getExtendedTestByBeliefSystem } from '../data/extendedKarmaTests';

export class EnhancedKarmaAnalyzer {
  static analyzeKarma(
    selectedBeliefs: string[],
    testResponses: { [testId: string]: { [questionId: string]: any } },
    profileData: any
  ): KarmaAnalysisResult {
    const karmaScores: { [karmaTypeId: string]: number } = {};
    const beliefSystemInsights: { [beliefSystem: string]: any } = {};
    const detailedScoring: { [beliefSystem: string]: { [karmaType: string]: number } } = {};

    // Инициализируем счетчики для всех типов кармы
    karmaTypes.forEach(type => {
      karmaScores[type.id] = 0;
    });

    // Анализируем ответы для каждой системы верований
    selectedBeliefs.forEach(beliefSystem => {
      const test = getExtendedTestByBeliefSystem(beliefSystem);
      const responses = testResponses[beliefSystem];
      
      if (test && responses) {
        const analysis = this.analyzeExtendedBeliefSystemTest(test, responses, profileData);
        
        // Сохраняем детальные очки для каждой системы
        detailedScoring[beliefSystem] = analysis.scores;
        
        // Добавляем очки к соответствующим типам кармы с весом системы
        const systemWeight = this.getBeliefSystemWeight(beliefSystem);
        Object.entries(analysis.scores).forEach(([karmaType, score]) => {
          karmaScores[karmaType] = (karmaScores[karmaType] || 0) + (score * systemWeight);
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

    // Вычисляем уверенность в результате (более сложная формула)
    const totalScore = Object.values(karmaScores).reduce((sum, score) => sum + score, 0);
    const primaryScore = karmaScores[primaryKarmaId];
    const secondaryScore = secondaryKarmaId ? karmaScores[secondaryKarmaId] : 0;
    
    // Уверенность зависит от разрыва между первым и вторым местом
    const scoreDifference = primaryScore - secondaryScore;
    const baseConfidence = totalScore > 0 ? (primaryScore / totalScore) * 100 : 0;
    const confidenceBonus = Math.min(20, scoreDifference * 2); // Бонус за четкость результата
    const confidence = Math.min(95, baseConfidence + confidenceBonus);

    // Создаем детальный анализ
    const detailedAnalysis = this.createEnhancedDetailedAnalysis(
      primaryKarma,
      secondaryKarma,
      selectedBeliefs,
      profileData,
      detailedScoring
    );

    return {
      primaryKarma,
      secondaryKarma,
      confidence: Math.round(confidence),
      detailedAnalysis,
      beliefSystemInsights
    };
  }

  private static analyzeExtendedBeliefSystemTest(
    test: KarmaTest,
    responses: { [questionId: string]: any },
    profileData: any
  ): { scores: { [karmaType: string]: number }, insights: any } {
    const scores: { [karmaType: string]: number } = {};
    const insights: any = {};
    const responsePatterns: { [pattern: string]: number } = {};

    test.questions.forEach(question => {
      const response = responses[question.id];
      if (!response) return;

      const weight = question.weight || 1;

      if (question.type === 'choice' || question.type === 'scenario') {
        const selectedOption = question.options?.find(opt => opt.id === response);
        if (selectedOption?.karmaType) {
          scores[selectedOption.karmaType] = (scores[selectedOption.karmaType] || 0) + weight;
          
          // Отслеживаем паттерны ответов
          const pattern = `${question.type}_${selectedOption.karmaType}`;
          responsePatterns[pattern] = (responsePatterns[pattern] || 0) + 1;
        }
      } else if (question.type === 'scale') {
        // Более сложная обработка шкальных вопросов
        this.processScaleResponse(question, response, weight, scores);
      } else if (question.type === 'priority') {
        // Улучшенная обработка приоритетов
        this.processPriorityResponse(question, response, weight, scores);
      }
    });

    // Создаем более детальные инсайты
    insights.interpretation = this.generateEnhancedBeliefSystemInterpretation(
      test.beliefSystem, 
      scores, 
      responsePatterns,
      profileData
    );
    insights.specificGuidance = this.generateEnhancedSpecificGuidance(
      test.beliefSystem, 
      scores,
      responsePatterns
    );
    insights.personalizedRecommendations = this.generatePersonalizedRecommendations(
      test.beliefSystem,
      scores,
      profileData
    );

    return { scores, insights };
  }

  private static processScaleResponse(
    question: KarmaQuestion,
    response: number,
    weight: number,
    scores: { [karmaType: string]: number }
  ) {
    // Более сложная логика для шкальных вопросов
    if (question.category === 'empathy') {
      if (response >= 8) {
        scores['helper'] = (scores['helper'] || 0) + weight * 2;
        scores['healer'] = (scores['healer'] || 0) + weight;
      } else if (response >= 6) {
        scores['helper'] = (scores['helper'] || 0) + weight;
      } else if (response <= 3) {
        scores['independent'] = (scores['independent'] || 0) + weight;
      }
    } else if (question.category === 'control') {
      if (response >= 8) {
        scores['leader'] = (scores['leader'] || 0) + weight * 2;
        scores['protector'] = (scores['protector'] || 0) + weight;
      } else if (response <= 3) {
        scores['seeker'] = (scores['seeker'] || 0) + weight;
        scores['independent'] = (scores['independent'] || 0) + weight;
      }
    }
  }

  private static processPriorityResponse(
    question: KarmaQuestion,
    response: string[],
    weight: number,
    scores: { [karmaType: string]: number }
  ) {
    if (Array.isArray(response)) {
      response.forEach((optionId: string, index: number) => {
        const option = question.options?.find(opt => opt.id === optionId);
        if (option?.karmaType) {
          // Экспоненциальное убывание веса для приоритетов
          const priorityWeight = Math.pow(2, Math.max(0, 5 - index));
          scores[option.karmaType] = (scores[option.karmaType] || 0) + (weight * priorityWeight);
        }
      });
    }
  }

  private static getBeliefSystemWeight(beliefSystem: string): number {
    // Разные веса для разных систем верований
    const weights = {
      psychology: 1.2, // Психология имеет больший вес как научная система
      astrology: 1.0,
      chakras: 1.1,
      numerology: 0.9,
      tarot: 0.8
    };
    return weights[beliefSystem as keyof typeof weights] || 1.0;
  }

  private static generateEnhancedBeliefSystemInterpretation(
    beliefSystem: string,
    scores: any,
    patterns: any,
    profileData: any
  ): string {
    const topKarmaType = Object.entries(scores)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0];

    const enhancedInterpretations: { [key: string]: { [karmaType: string]: string } } = {
      astrology: {
        helper: `Ваша астрологическая карта показывает сильное влияние водных знаков и Венеры. ${profileData.birthDate ? 'Учитывая вашу дату рождения, ' : ''}планетарные аспекты указывают на природную склонность к эмпатии и желанию помогать другим найти свой путь в жизни.`,
        leader: `Огненные знаки и сильное Солнце в вашей карте создают мощную энергию лидерства. Марс в благоприятном аспекте наделяет вас способностью вдохновлять и вести других к достижению их целей.`,
        creator: `Воздушные знаки и Меркурий в творческих домах указывают на богатое воображение. Уран приносит инновационные идеи, а Венера добавляет эстетическое чувство в ваши творения.`,
        protector: `Земные знаки и сильный Сатурн создают надежную защитную энергию. Ваша карта показывает природную склонность к созданию безопасности и стабильности для других.`,
        teacher: `Юпитер в сильной позиции и аспекты к Меркурию указывают на дар передачи знаний. Ваша мудрость приходит через опыт и глубокое понимание жизненных циклов.`,
        healer: `Нептун и Луна в гармоничных аспектах создают мощную исцеляющую энергию. Ваша чувствительность к энергиям других делает вас природным целителем душ.`,
        seeker: `Сильный Юпитер и аспекты к высшим планетам указывают на духовный поиск. Ваша карта показывает глубокую потребность в понимании высших истин.`,
        independent: `Уран в сильной позиции и акцент на фиксированных знаках дают вам силу идти своим уникальным путем, не завися от мнения других.`
      },
      psychology: {
        helper: `Ваш психологический профиль показывает высокие показатели по шкалам эмпатии и альтруизма. Исследования показывают, что люди с таким профилем естественно тяготеют к профессиям помощи.`,
        leader: `Ваши результаты указывают на высокий эмоциональный интеллект и способность к стратегическому мышлению. Эти качества являются ключевыми для эффективного лидерства.`,
        creator: `Высокие показатели открытости опыту и дивергентного мышления указывают на творческую личность. Ваш мозг естественно генерирует нестандартные решения.`,
        protector: `Ваш профиль показывает высокую совестливость и чувство справедливости. Эти черты характерны для людей, которые естественно защищают других.`,
        teacher: `Сочетание терпения, ясности мышления и желания делиться знаниями делает вас природным педагогом. Ваш стиль обучения основан на понимании и поддержке.`,
        healer: `Высокая эмоциональная чувствительность в сочетании с желанием помогать указывает на природные способности к исцелению. Ваша эмпатия - это ваш главный инструмент.`,
        seeker: `Ваша любознательность и потребность в понимании глубоких вопросов характерны для исследовательского типа личности. Вы естественно ищете смысл во всем.`,
        independent: `Высокие показатели самостоятельности и внутренней мотивации указывают на независимую натуру. Вы лучше всего функционируете, когда можете следовать своему внутреннему компасу.`
      },
      chakras: {
        helper: `Ваша сердечная чакра особенно активна и сбалансирована. Это проявляется в естественном желании помогать и способности чувствовать потребности других.`,
        leader: `Коронная чакра и солнечное сплетение работают в гармонии, создавая мощную энергию духовного лидерства. Вы можете направлять высшие энергии для трансформации.`,
        creator: `Сакральная и горловая чакры активно взаимодействуют, создавая поток творческой энергии. Ваши творения несут в себе глубокую эмоциональную силу.`,
        protector: `Солнечное сплетение и корневая чакра создают мощную защитную энергию. Вы естественно создаете безопасное пространство для других.`,
        teacher: `Горловая чакра и третий глаз работают синхронно, позволяя вам ясно передавать высшие знания. Ваши слова несут исцеляющую силу.`,
        healer: `Сердечная чакра излучает мощную исцеляющую энергию. Ваше присутствие само по себе оказывает терапевтическое воздействие на окружающих.`,
        seeker: `Третий глаз и коронная чакра открыты для получения высших знаний. Вы естественно настроены на тонкие энергии и духовные истины.`,
        independent: `Корневая чакра дает вам прочную связь с собственной силой. Вы черпаете энергию из своего внутреннего источника, не завися от внешних влияний.`
      }
    };

    return enhancedInterpretations[beliefSystem]?.[topKarmaType] || 
           `Ваш профиль в ${beliefSystem} указывает на уникальный духовный путь с акцентом на ${topKarmaType}.`;
  }

  private static generateEnhancedSpecificGuidance(
    beliefSystem: string,
    scores: any,
    patterns: any
  ): string[] {
    const topKarmaType = Object.entries(scores)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0];

    const enhancedGuidance: { [key: string]: { [karmaType: string]: string[] } } = {
      astrology: {
        helper: [
          'Изучите транзиты Венеры для усиления способности к состраданию',
          'Работайте с лунными циклами для развития интуитивной помощи',
          'Медитируйте на 12-й дом для углубления служения другим'
        ],
        leader: [
          'Изучите солнечные возвращения для планирования лидерских инициатив',
          'Работайте с энергией Марса для развития решительности',
          'Используйте ретроградные периоды для внутреннего развития лидерства'
        ],
        creator: [
          'Следите за транзитами Урана для творческих прорывов',
          'Работайте с энергией Венеры для эстетического развития',
          'Используйте новолуния для запуска творческих проектов'
        ]
      },
      psychology: {
        helper: [
          'Изучите техники активного слушания для улучшения помощи',
          'Развивайте эмоциональную регуляцию для предотвращения выгорания',
          'Практикуйте техники установления границ в отношениях помощи'
        ],
        leader: [
          'Развивайте навыки эмоционального интеллекта для лучшего лидерства',
          'Изучайте теории мотивации для вдохновения команды',
          'Практикуйте техники принятия решений в условиях неопределенности'
        ]
      }
    };

    return enhancedGuidance[beliefSystem]?.[topKarmaType] || [
      `Продолжайте изучать ${beliefSystem} для развития вашего кармического пути`,
      'Практикуйте регулярную медитацию для углубления понимания',
      'Ведите дневник инсайтов для отслеживания прогресса'
    ];
  }

  private static generatePersonalizedRecommendations(
    beliefSystem: string,
    scores: any,
    profileData: any
  ): string[] {
    const recommendations = [];
    const topKarmaType = Object.entries(scores)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0];

    // Персонализация на основе профиля
    if (profileData.birthDate) {
      const age = new Date().getFullYear() - profileData.birthDate.getFullYear();
      if (age < 30) {
        recommendations.push('В вашем возрасте особенно важно экспериментировать с разными аспектами вашей кармы');
      } else if (age > 50) {
        recommendations.push('Ваш жизненный опыт позволяет глубже понять и воплотить вашу кармическую миссию');
      }
    }

    // Рекомендации на основе системы верований
    if (beliefSystem === 'astrology') {
      recommendations.push('Создайте персональный астрологический календарь для оптимального использования планетарных энергий');
    } else if (beliefSystem === 'chakras') {
      recommendations.push('Разработайте ежедневную практику работы с чакрами, соответствующими вашему кармическому типу');
    }

    return recommendations;
  }

  private static createEnhancedDetailedAnalysis(
    primaryKarma: any,
    secondaryKarma: any,
    selectedBeliefs: string[],
    profileData: any,
    detailedScoring: any
  ) {
    const combinedTraits = [...primaryKarma.traits];
    const combinedChallenges = [...primaryKarma.challenges];
    const combinedRecommendations = [...primaryKarma.recommendations];

    if (secondaryKarma) {
      // Интеллектуальное объединение черт
      secondaryKarma.traits.forEach((trait: string) => {
        if (!combinedTraits.some(t => t.toLowerCase().includes(trait.toLowerCase()))) {
          combinedTraits.push(`${trait} (вторичная карма)`);
        }
      });

      combinedChallenges.push(`Баланс между ${primaryKarma.name.toLowerCase()} и ${secondaryKarma.name.toLowerCase()}`);
    }

    // Анализ синергии между системами верований
    const beliefSynergy = this.analyzeBeliefsSystemSynergy(selectedBeliefs, detailedScoring);
    if (beliefSynergy) {
      combinedRecommendations.push(beliefSynergy);
    }

    return {
      strengths: combinedTraits.slice(0, 6),
      challenges: combinedChallenges.slice(0, 4),
      lifeLesson: this.enhanceLifeLesson(primaryKarma.lifeLesson, secondaryKarma),
      spiritualGift: this.enhanceSpiritualGift(primaryKarma.spiritualGift, selectedBeliefs),
      recommendations: combinedRecommendations.slice(0, 8)
    };
  }

  private static analyzeBeliefsSystemSynergy(
    selectedBeliefs: string[],
    detailedScoring: any
  ): string | null {
    if (selectedBeliefs.length < 2) return null;

    // Анализируем согласованность результатов между системами
    const consistencyScore = this.calculateConsistencyScore(detailedScoring);
    
    if (consistencyScore > 0.8) {
      return 'Все выбранные системы верований указывают на одинаковый кармический путь - это признак очень четкого предназначения';
    } else if (consistencyScore < 0.5) {
      return 'Разные системы верований показывают различные аспекты вашей кармы - это указывает на многогранную духовную природу';
    }
    
    return null;
  }

  private static calculateConsistencyScore(detailedScoring: any): number {
    const systems = Object.keys(detailedScoring);
    if (systems.length < 2) return 1;

    let totalConsistency = 0;
    let comparisons = 0;

    for (let i = 0; i < systems.length; i++) {
      for (let j = i + 1; j < systems.length; j++) {
        const system1 = detailedScoring[systems[i]];
        const system2 = detailedScoring[systems[j]];
        
        const consistency = this.calculateSystemConsistency(system1, system2);
        totalConsistency += consistency;
        comparisons++;
      }
    }

    return comparisons > 0 ? totalConsistency / comparisons : 0;
  }

  private static calculateSystemConsistency(system1: any, system2: any): number {
    const types1 = Object.entries(system1).sort(([,a], [,b]) => (b as number) - (a as number));
    const types2 = Object.entries(system2).sort(([,a], [,b]) => (b as number) - (a as number));
    
    const top1 = types1[0]?.[0];
    const top2 = types2[0]?.[0];
    
    return top1 === top2 ? 1 : 0.5; // Полная согласованность или частичная
  }

  private static enhanceLifeLesson(baseLesson: string, secondaryKarma: any): string {
    if (!secondaryKarma) return baseLesson;
    
    return `${baseLesson}, интегрируя при этом качества ${secondaryKarma.name.toLowerCase()}`;
  }

  private static enhanceSpiritualGift(baseGift: string, selectedBeliefs: string[]): string {
    const beliefEnhancements = {
      astrology: 'через понимание космических циклов',
      psychology: 'через глубокое понимание человеческой природы',
      chakras: 'через работу с энергетическими центрами',
      numerology: 'через понимание числовых вибраций',
      tarot: 'через символическое мышление и интуицию'
    };

    const enhancements = selectedBeliefs
      .map(belief => beliefEnhancements[belief as keyof typeof beliefEnhancements])
      .filter(Boolean);

    if (enhancements.length > 0) {
      return `${baseGift} ${enhancements.join(', ')}`;
    }

    return baseGift;
  }
}