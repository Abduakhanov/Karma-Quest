import { KarmaTest } from '../types/karma';

export const karmaTests: { [beliefSystem: string]: KarmaTest } = {
  astrology: {
    id: 'astrology-karma-test',
    beliefSystem: 'astrology',
    scoringMethod: 'weighted',
    questions: [
      {
        id: 'astro-1',
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
        id: 'astro-2',
        type: 'scenario',
        question: 'В сложной ситуации вы чаще всего...',
        weight: 2,
        options: [
          { id: 'help', text: 'Помогаю другим справиться с проблемой', value: 'helper', karmaType: 'helper' },
          { id: 'analyze', text: 'Ищу глубинные причины происходящего', value: 'seeker', karmaType: 'seeker' },
          { id: 'act', text: 'Беру ответственность и действую', value: 'leader', karmaType: 'leader' },
          { id: 'create', text: 'Нахожу творческое решение', value: 'creator', karmaType: 'creator' }
        ]
      },
      {
        id: 'astro-3',
        type: 'choice',
        question: 'Какая планета больше всего влияет на вашу жизнь?',
        weight: 2,
        options: [
          { id: 'sun', text: 'Солнце - самовыражение и лидерство', value: 'sun', karmaType: 'leader' },
          { id: 'moon', text: 'Луна - эмоции и интуиция', value: 'moon', karmaType: 'healer' },
          { id: 'mercury', text: 'Меркурий - общение и обучение', value: 'mercury', karmaType: 'teacher' },
          { id: 'venus', text: 'Венера - любовь и гармония', value: 'venus', karmaType: 'helper' },
          { id: 'mars', text: 'Марс - действие и защита', value: 'mars', karmaType: 'protector' },
          { id: 'jupiter', text: 'Юпитер - мудрость и поиск истины', value: 'jupiter', karmaType: 'seeker' },
          { id: 'saturn', text: 'Сатурн - дисциплина и независимость', value: 'saturn', karmaType: 'independent' },
          { id: 'uranus', text: 'Уран - инновации и творчество', value: 'uranus', karmaType: 'creator' }
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
  },

  psychology: {
    id: 'psychology-karma-test',
    beliefSystem: 'psychology',
    scoringMethod: 'categorical',
    questions: [
      {
        id: 'psych-1',
        type: 'scale',
        question: 'Насколько важно для вас помогать другим людям? (1-10)',
        weight: 2,
        category: 'altruism'
      },
      {
        id: 'psych-2',
        type: 'choice',
        question: 'Что мотивирует вас больше всего?',
        weight: 3,
        options: [
          { id: 'autonomy', text: 'Свобода и независимость', value: 'independent', karmaType: 'independent' },
          { id: 'mastery', text: 'Мастерство и совершенство', value: 'creator', karmaType: 'creator' },
          { id: 'purpose', text: 'Смысл и служение', value: 'helper', karmaType: 'helper' },
          { id: 'security', text: 'Безопасность и стабильность', value: 'protector', karmaType: 'protector' }
        ]
      },
      {
        id: 'psych-3',
        type: 'scenario',
        question: 'В группе людей вы обычно...',
        weight: 2,
        options: [
          { id: 'lead', text: 'Естественно становлюсь лидером', value: 'leader', karmaType: 'leader' },
          { id: 'support', text: 'Поддерживаю и помогаю другим', value: 'helper', karmaType: 'helper' },
          { id: 'observe', text: 'Наблюдаю и анализирую', value: 'seeker', karmaType: 'seeker' },
          { id: 'mediate', text: 'Помогаю разрешить конфликты', value: 'healer', karmaType: 'healer' },
          { id: 'innovate', text: 'Предлагаю новые идеи', value: 'creator', karmaType: 'creator' }
        ]
      }
    ],
    resultMapping: {
      'independent': 'independent',
      'creator': 'creator',
      'helper': 'helper',
      'protector': 'protector',
      'leader': 'leader',
      'seeker': 'seeker',
      'healer': 'healer'
    }
  },

  chakras: {
    id: 'chakras-karma-test',
    beliefSystem: 'chakras',
    scoringMethod: 'weighted',
    questions: [
      {
        id: 'chakra-1',
        type: 'choice',
        question: 'Какая чакра чувствуется наиболее активной в вашем теле?',
        weight: 3,
        options: [
          { id: 'root', text: 'Корневая (основание позвоночника) - заземление', value: 'root', karmaType: 'independent' },
          { id: 'sacral', text: 'Сакральная (низ живота) - творчество', value: 'sacral', karmaType: 'creator' },
          { id: 'solar', text: 'Солнечное сплетение - личная сила', value: 'solar', karmaType: 'protector' },
          { id: 'heart', text: 'Сердечная - любовь и сострадание', value: 'heart', karmaType: 'helper' },
          { id: 'throat', text: 'Горловая - общение и истина', value: 'throat', karmaType: 'teacher' },
          { id: 'third-eye', text: 'Третий глаз - интуиция и мудрость', value: 'third-eye', karmaType: 'seeker' },
          { id: 'crown', text: 'Коронная - духовная связь', value: 'crown', karmaType: 'leader' }
        ]
      },
      {
        id: 'chakra-2',
        type: 'scenario',
        question: 'Когда вы медитируете, что происходит чаще всего?',
        weight: 2,
        options: [
          { id: 'grounded', text: 'Чувствую связь с землей и стабильность', value: 'independent', karmaType: 'independent' },
          { id: 'creative', text: 'Приходят творческие идеи и вдохновение', value: 'creator', karmaType: 'creator' },
          { id: 'powerful', text: 'Ощущаю внутреннюю силу и уверенность', value: 'protector', karmaType: 'protector' },
          { id: 'loving', text: 'Наполняюсь любовью и состраданием', value: 'helper', karmaType: 'helper' },
          { id: 'healing', text: 'Чувствую исцеляющую энергию', value: 'healer', karmaType: 'healer' },
          { id: 'wise', text: 'Получаю инсайты и понимание', value: 'seeker', karmaType: 'seeker' },
          { id: 'connected', text: 'Ощущаю связь с высшим', value: 'leader', karmaType: 'leader' }
        ]
      }
    ],
    resultMapping: {
      'independent': 'independent',
      'creator': 'creator',
      'protector': 'protector',
      'helper': 'helper',
      'healer': 'healer',
      'teacher': 'teacher',
      'seeker': 'seeker',
      'leader': 'leader'
    }
  },

  numerology: {
    id: 'numerology-karma-test',
    beliefSystem: 'numerology',
    scoringMethod: 'weighted',
    questions: [
      {
        id: 'num-1',
        type: 'choice',
        question: 'Какое число больше всего привлекает вас интуитивно?',
        weight: 3,
        options: [
          { id: '1', text: '1 - Лидерство и независимость', value: '1', karmaType: 'leader' },
          { id: '2', text: '2 - Сотрудничество и помощь', value: '2', karmaType: 'helper' },
          { id: '3', text: '3 - Творчество и самовыражение', value: '3', karmaType: 'creator' },
          { id: '4', text: '4 - Стабильность и защита', value: '4', karmaType: 'protector' },
          { id: '5', text: '5 - Свобода и независимость', value: '5', karmaType: 'independent' },
          { id: '6', text: '6 - Забота и исцеление', value: '6', karmaType: 'healer' },
          { id: '7', text: '7 - Поиск истины и мудрость', value: '7', karmaType: 'seeker' },
          { id: '8', text: '8 - Материальный успех и лидерство', value: '8', karmaType: 'leader' },
          { id: '9', text: '9 - Служение и обучение', value: '9', karmaType: 'teacher' }
        ]
      },
      {
        id: 'num-2',
        type: 'priority',
        question: 'Расставьте по приоритету (1-самое важное):',
        weight: 2,
        options: [
          { id: 'independence', text: 'Личная свобода', value: 'independent', karmaType: 'independent' },
          { id: 'creativity', text: 'Творческое самовыражение', value: 'creator', karmaType: 'creator' },
          { id: 'helping', text: 'Помощь другим', value: 'helper', karmaType: 'helper' },
          { id: 'leadership', text: 'Лидерство и влияние', value: 'leader', karmaType: 'leader' },
          { id: 'knowledge', text: 'Знания и мудрость', value: 'seeker', karmaType: 'seeker' }
        ]
      }
    ],
    resultMapping: {
      'leader': 'leader',
      'helper': 'helper',
      'creator': 'creator',
      'protector': 'protector',
      'independent': 'independent',
      'healer': 'healer',
      'seeker': 'seeker',
      'teacher': 'teacher'
    }
  },

  tarot: {
    id: 'tarot-karma-test',
    beliefSystem: 'tarot',
    scoringMethod: 'intuitive',
    questions: [
      {
        id: 'tarot-1',
        type: 'choice',
        question: 'Какая карта Таро больше всего резонирует с вашей душой?',
        weight: 3,
        options: [
          { id: 'fool', text: 'Дурак - новые начинания и независимость', value: 'fool', karmaType: 'independent' },
          { id: 'magician', text: 'Маг - творчество и манифестация', value: 'magician', karmaType: 'creator' },
          { id: 'empress', text: 'Императрица - забота и исцеление', value: 'empress', karmaType: 'healer' },
          { id: 'emperor', text: 'Император - лидерство и защита', value: 'emperor', karmaType: 'leader' },
          { id: 'hierophant', text: 'Иерофант - обучение и мудрость', value: 'hierophant', karmaType: 'teacher' },
          { id: 'hermit', text: 'Отшельник - поиск истины', value: 'hermit', karmaType: 'seeker' },
          { id: 'strength', text: 'Сила - защита и храбрость', value: 'strength', karmaType: 'protector' },
          { id: 'star', text: 'Звезда - помощь и вдохновение', value: 'star', karmaType: 'helper' }
        ]
      },
      {
        id: 'tarot-2',
        type: 'scenario',
        question: 'Если бы вы были картой Таро, какую роль играли бы в жизни людей?',
        weight: 2,
        options: [
          { id: 'guide', text: 'Направлял бы на правильный путь', value: 'teacher', karmaType: 'teacher' },
          { id: 'heal', text: 'Исцелял бы эмоциональные раны', value: 'healer', karmaType: 'healer' },
          { id: 'inspire', text: 'Вдохновлял бы на творчество', value: 'creator', karmaType: 'creator' },
          { id: 'protect', text: 'Защищал бы от опасностей', value: 'protector', karmaType: 'protector' },
          { id: 'lead', text: 'Вел бы к успеху и победе', value: 'leader', karmaType: 'leader' },
          { id: 'support', text: 'Поддерживал бы в трудные времена', value: 'helper', karmaType: 'helper' }
        ]
      }
    ],
    resultMapping: {
      'independent': 'independent',
      'creator': 'creator',
      'healer': 'healer',
      'leader': 'leader',
      'teacher': 'teacher',
      'seeker': 'seeker',
      'protector': 'protector',
      'helper': 'helper'
    }
  }
};

export const getTestByBeliefSystem = (beliefSystem: string): KarmaTest | undefined => {
  return karmaTests[beliefSystem];
};