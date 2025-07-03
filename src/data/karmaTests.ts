import { KarmaTest } from '../types/karma';
import { extendedKarmaTests } from './extendedKarmaTests';

// Объединяем базовые и расширенные тесты
export const karmaTests: { [beliefSystem: string]: KarmaTest } = {
  // Базовые тесты (короткие, для быстрого определения)
  ...{
    astrology: {
      id: 'astrology-basic-karma-test',
      beliefSystem: 'astrology',
      scoringMethod: 'weighted',
      questions: [
        {
          id: 'astro-basic-1',
          type: 'choice',
          question: 'Какая стихия больше всего резонирует с вашей душой?',
          weight: 3,
          options: [
            { id: 'fire', text: 'Огонь - страсть, действие, лидерство', value: 'fire', karmaType: 'leader' },
            { id: 'earth', text: 'Земля - стабильность, защита, практичность', value: 'earth', karmaType: 'protector' },
            { id: 'air', text: 'Воздух - идеи, общение, свобода', value: 'air', karmaType: 'creator' },
            { id: 'water', text: 'Вода - эмоции, интуиция, исцеление', value: 'water', karmaType: 'healer' }
          ]
        },
        {
          id: 'astro-basic-2',
          type: 'scenario',
          question: 'В сложной ситуации вы чаще всего...',
          weight: 2,
          options: [
            { id: 'help', text: 'Помогаю другим справиться с проблемой', value: 'helper', karmaType: 'helper' },
            { id: 'analyze', text: 'Ищу глубинные причины происходящего', value: 'seeker', karmaType: 'seeker' },
            { id: 'act', text: 'Беру ответственность и действую', value: 'leader', karmaType: 'leader' },
            { id: 'create', text: 'Нахожу творческое решение', value: 'creator', karmaType: 'creator' }
          ]
        }
      ],
      resultMapping: {
        'leader': 'leader',
        'protector': 'protector',
        'creator': 'creator',
        'healer': 'healer',
        'helper': 'helper',
        'teacher': 'teacher',
        'seeker': 'seeker',
        'independent': 'independent'
      }
    }
  }
};

// Функция для получения теста (базового или расширенного)
export const getTestByBeliefSystem = (beliefSystem: string, extended = true): KarmaTest | undefined => {
  if (extended) {
    return extendedKarmaTests[beliefSystem] || karmaTests[beliefSystem];
  }
  return karmaTests[beliefSystem];
};

// Функция для получения только расширенного теста
export const getExtendedTestByBeliefSystem = (beliefSystem: string): KarmaTest | undefined => {
  return extendedKarmaTests[beliefSystem];
};