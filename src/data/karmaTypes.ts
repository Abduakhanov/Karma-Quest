import { KarmaType } from '../types/karma';

export const karmaTypes: KarmaType[] = [
  {
    id: 'helper',
    name: 'Помощник людям',
    description: 'Ваша карма - служить другим и помогать им в их жизненном пути',
    icon: '🤝',
    traits: ['Эмпатия', 'Сострадание', 'Самоотверженность', 'Интуиция'],
    challenges: ['Забота о себе', 'Установление границ', 'Избегание выгорания'],
    lifeLesson: 'Научиться помогать, не теряя себя',
    spiritualGift: 'Способность исцелять других своим присутствием',
    recommendations: [
      'Практикуйте медитацию сострадания',
      'Устанавливайте здоровые границы',
      'Заботьтесь о своем энергетическом поле'
    ],
    compatibleTypes: ['healer', 'teacher', 'protector'],
    element: 'water',
    chakra: 'Сердечная чакра',
    color: '#4ade80'
  },
  {
    id: 'independent',
    name: 'Независимый путь',
    description: 'Ваша карма - следовать своему внутреннему голосу и быть верным себе',
    icon: '🦅',
    traits: ['Самостоятельность', 'Внутренняя сила', 'Аутентичность', 'Решительность'],
    challenges: ['Одиночество', 'Принятие помощи', 'Баланс независимости и связи'],
    lifeLesson: 'Быть собой, не теряя связи с миром',
    spiritualGift: 'Способность вдохновлять других на аутентичность',
    recommendations: [
      'Практикуйте медитацию на корневую чакру',
      'Развивайте здоровые отношения',
      'Доверяйте своей интуиции'
    ],
    compatibleTypes: ['seeker', 'creator', 'leader'],
    element: 'fire',
    chakra: 'Корневая чакра',
    color: '#f59e0b'
  },
  {
    id: 'creator',
    name: 'Творец и созидатель',
    description: 'Ваша карма - создавать красоту и новые возможности в мире',
    icon: '🎨',
    traits: ['Креативность', 'Воображение', 'Инновации', 'Вдохновение'],
    challenges: ['Самокритика', 'Завершение проектов', 'Материализация идей'],
    lifeLesson: 'Превращать видения в реальность',
    spiritualGift: 'Способность видеть потенциал во всем',
    recommendations: [
      'Практикуйте творческую медитацию',
      'Ведите дневник идей',
      'Окружайте себя красотой'
    ],
    compatibleTypes: ['independent', 'seeker', 'teacher'],
    element: 'air',
    chakra: 'Горловая чакра',
    color: '#8b5cf6'
  },
  {
    id: 'protector',
    name: 'Защитник и хранитель',
    description: 'Ваша карма - защищать слабых и сохранять важные ценности',
    icon: '🛡️',
    traits: ['Справедливость', 'Храбрость', 'Лояльность', 'Ответственность'],
    challenges: ['Контроль гнева', 'Избегание конфликтов', 'Баланс силы'],
    lifeLesson: 'Защищать с любовью, а не со страхом',
    spiritualGift: 'Способность создавать безопасное пространство',
    recommendations: [
      'Практикуйте медитацию на солнечное сплетение',
      'Изучайте техники управления гневом',
      'Развивайте дипломатические навыки'
    ],
    compatibleTypes: ['helper', 'leader', 'healer'],
    element: 'earth',
    chakra: 'Солнечное сплетение',
    color: '#dc2626'
  },
  {
    id: 'teacher',
    name: 'Учитель и наставник',
    description: 'Ваша карма - делиться знаниями и направлять других к мудрости',
    icon: '📚',
    traits: ['Мудрость', 'Терпение', 'Ясность', 'Понимание'],
    challenges: ['Принятие разных точек зрения', 'Избегание догматизма', 'Смирение'],
    lifeLesson: 'Учить, продолжая учиться',
    spiritualGift: 'Способность пробуждать мудрость в других',
    recommendations: [
      'Практикуйте медитацию на третий глаз',
      'Изучайте разные философии',
      'Развивайте навыки активного слушания'
    ],
    compatibleTypes: ['helper', 'creator', 'seeker'],
    element: 'air',
    chakra: 'Третий глаз',
    color: '#3b82f6'
  },
  {
    id: 'healer',
    name: 'Целитель душ',
    description: 'Ваша карма - исцелять эмоциональные и духовные раны',
    icon: '💚',
    traits: ['Исцеление', 'Интуиция', 'Сострадание', 'Чувствительность'],
    challenges: ['Энергетическая защита', 'Эмоциональные границы', 'Самоисцеление'],
    lifeLesson: 'Исцелять других, исцеляя себя',
    spiritualGift: 'Способность трансмутировать боль в любовь',
    recommendations: [
      'Практикуйте энергетическое очищение',
      'Изучайте техники исцеления',
      'Работайте с кристаллами и травами'
    ],
    compatibleTypes: ['helper', 'protector', 'teacher'],
    element: 'water',
    chakra: 'Сердечная чакра',
    color: '#10b981'
  },
  {
    id: 'leader',
    name: 'Лидер и вдохновитель',
    description: 'Ваша карма - вести людей к лучшему будущему',
    icon: '👑',
    traits: ['Лидерство', 'Видение', 'Харизма', 'Решительность'],
    challenges: ['Гордыня', 'Делегирование', 'Баланс власти и служения'],
    lifeLesson: 'Вести с любовью и смирением',
    spiritualGift: 'Способность вдохновлять на великие дела',
    recommendations: [
      'Практикуйте медитацию на коронную чакру',
      'Развивайте эмоциональный интеллект',
      'Изучайте принципы служащего лидерства'
    ],
    compatibleTypes: ['independent', 'protector', 'teacher'],
    element: 'fire',
    chakra: 'Коронная чакра',
    color: '#f59e0b'
  },
  {
    id: 'seeker',
    name: 'Искатель истины',
    description: 'Ваша карма - искать глубокие истины и духовное понимание',
    icon: '🔍',
    traits: ['Любознательность', 'Глубина', 'Интуиция', 'Мистицизм'],
    challenges: ['Практическое применение', 'Заземление', 'Социальные связи'],
    lifeLesson: 'Находить истину и делиться ею с миром',
    spiritualGift: 'Способность видеть скрытые связи и смыслы',
    recommendations: [
      'Практикуйте различные виды медитации',
      'Изучайте древние учения',
      'Ведите духовный дневник'
    ],
    compatibleTypes: ['independent', 'creator', 'teacher'],
    element: 'air',
    chakra: 'Третий глаз',
    color: '#6366f1'
  }
];

export const getKarmaTypeById = (id: string): KarmaType | undefined => {
  return karmaTypes.find(type => type.id === id);
};

export const getCompatibleTypes = (karmaTypeId: string): KarmaType[] => {
  const karmaType = getKarmaTypeById(karmaTypeId);
  if (!karmaType) return [];
  
  return karmaType.compatibleTypes
    .map(id => getKarmaTypeById(id))
    .filter(Boolean) as KarmaType[];
};