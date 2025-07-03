import { KarmaTest } from '../types/karma';

// Расширенные и более глубокие тесты для определения кармы
export const extendedKarmaTests: { [beliefSystem: string]: KarmaTest } = {
  astrology: {
    id: 'astrology-extended-karma-test',
    beliefSystem: 'astrology',
    scoringMethod: 'weighted',
    questions: [
      {
        id: 'astro-deep-1',
        type: 'scenario',
        question: 'Представьте: вы стоите под звездным небом в полночь. Что вы чувствуете?',
        weight: 4,
        options: [
          { id: 'connection', text: 'Глубокую связь с космосом и желание помочь другим найти свой путь', value: 'helper', karmaType: 'helper' },
          { id: 'power', text: 'Внутреннюю силу и понимание, что я создаю свою реальность', value: 'independent', karmaType: 'independent' },
          { id: 'inspiration', text: 'Творческое вдохновение и желание создать что-то прекрасное', value: 'creator', karmaType: 'creator' },
          { id: 'responsibility', text: 'Ответственность за защиту этой красоты для будущих поколений', value: 'protector', karmaType: 'protector' },
          { id: 'wisdom', text: 'Желание понять глубокие тайны вселенной и поделиться знанием', value: 'teacher', karmaType: 'teacher' },
          { id: 'healing', text: 'Исцеляющую энергию, которая течет через меня к другим', value: 'healer', karmaType: 'healer' },
          { id: 'leadership', text: 'Призвание вести людей к высшему пониманию', value: 'leader', karmaType: 'leader' },
          { id: 'mystery', text: 'Притяжение к скрытым истинам и древним знаниям', value: 'seeker', karmaType: 'seeker' }
        ]
      },
      {
        id: 'astro-deep-2',
        type: 'choice',
        question: 'Какая планетарная энергия наиболее сильно резонирует с вашей душой?',
        weight: 3,
        options: [
          { id: 'sun-leadership', text: 'Солнце - я излучаю свет и веду других к их потенциалу', value: 'leader', karmaType: 'leader' },
          { id: 'moon-intuition', text: 'Луна - я чувствую эмоции других и исцеляю их боль', value: 'healer', karmaType: 'healer' },
          { id: 'mercury-communication', text: 'Меркурий - я передаю знания и помогаю людям понять', value: 'teacher', karmaType: 'teacher' },
          { id: 'venus-harmony', text: 'Венера - я создаю красоту и гармонию в мире', value: 'creator', karmaType: 'creator' },
          { id: 'mars-action', text: 'Марс - я защищаю слабых и борюсь за справедливость', value: 'protector', karmaType: 'protector' },
          { id: 'jupiter-wisdom', text: 'Юпитер - я ищу высшую мудрость и расширяю сознание', value: 'seeker', karmaType: 'seeker' },
          { id: 'saturn-independence', text: 'Сатурн - я учусь через испытания и иду своим путем', value: 'independent', karmaType: 'independent' },
          { id: 'neptune-service', text: 'Нептун - я растворяю границы и служу всему человечеству', value: 'helper', karmaType: 'helper' }
        ]
      },
      {
        id: 'astro-deep-3',
        type: 'scenario',
        question: 'Во время ретроградного Меркурия вы замечаете, что...',
        weight: 2,
        options: [
          { id: 'help-others', text: 'Помогаю другим справиться с хаосом и находить ясность', value: 'helper', karmaType: 'helper' },
          { id: 'inner-work', text: 'Углубляюсь в себя и работаю над личным развитием', value: 'independent', karmaType: 'independent' },
          { id: 'creative-breakthrough', text: 'Получаю творческие прозрения и новые идеи', value: 'creator', karmaType: 'creator' },
          { id: 'protect-energy', text: 'Защищаю свою энергию и энергию близких', value: 'protector', karmaType: 'protector' },
          { id: 'teach-patience', text: 'Учу других терпению и принятию жизненных циклов', value: 'teacher', karmaType: 'teacher' },
          { id: 'heal-communication', text: 'Исцеляю старые раны через честное общение', value: 'healer', karmaType: 'healer' },
          { id: 'lead-through-chaos', text: 'Веду других через неопределенность с уверенностью', value: 'leader', karmaType: 'leader' },
          { id: 'seek-meaning', text: 'Ищу глубокий смысл в происходящих событиях', value: 'seeker', karmaType: 'seeker' }
        ]
      },
      {
        id: 'astro-deep-4',
        type: 'choice',
        question: 'Какая стихия наиболее точно описывает вашу кармическую природу?',
        weight: 3,
        options: [
          { id: 'fire-leader', text: 'Огонь лидерства - я зажигаю искру в других и веду к переменам', value: 'leader', karmaType: 'leader' },
          { id: 'fire-independent', text: 'Огонь независимости - я горю своим внутренним пламенем', value: 'independent', karmaType: 'independent' },
          { id: 'earth-protector', text: 'Земля защитника - я создаю стабильность и безопасность', value: 'protector', karmaType: 'protector' },
          { id: 'earth-healer', text: 'Земля целителя - я заземляю и исцеляю через природу', value: 'healer', karmaType: 'healer' },
          { id: 'air-teacher', text: 'Воздух учителя - я распространяю знания как ветер', value: 'teacher', karmaType: 'teacher' },
          { id: 'air-creator', text: 'Воздух творца - мои идеи летают свободно и вдохновляют', value: 'creator', karmaType: 'creator' },
          { id: 'water-helper', text: 'Вода помощника - я теку туда, где нужна поддержка', value: 'helper', karmaType: 'helper' },
          { id: 'water-seeker', text: 'Вода искателя - я погружаюсь в глубины истины', value: 'seeker', karmaType: 'seeker' }
        ]
      },
      {
        id: 'astro-deep-5',
        type: 'scenario',
        question: 'Во время полнолуния вы чувствуете призыв...',
        weight: 2,
        options: [
          { id: 'gather-community', text: 'Собрать сообщество и помочь людям соединиться', value: 'helper', karmaType: 'helper' },
          { id: 'solo-ritual', text: 'Провести личный ритуал и укрепить связь с собой', value: 'independent', karmaType: 'independent' },
          { id: 'create-art', text: 'Создать произведение искусства, вдохновленное лунной энергией', value: 'creator', karmaType: 'creator' },
          { id: 'cleanse-space', text: 'Очистить пространство и защитить его от негатива', value: 'protector', karmaType: 'protector' },
          { id: 'share-wisdom', text: 'Поделиться древними знаниями о лунных циклах', value: 'teacher', karmaType: 'teacher' },
          { id: 'healing-ceremony', text: 'Провести исцеляющую церемонию для нуждающихся', value: 'healer', karmaType: 'healer' },
          { id: 'lead-meditation', text: 'Возглавить групповую медитацию и направить энергию', value: 'leader', karmaType: 'leader' },
          { id: 'divine-connection', text: 'Искать прямую связь с божественным через созерцание', value: 'seeker', karmaType: 'seeker' }
        ]
      }
    ],
    resultMapping: {
      'helper': 'helper',
      'independent': 'independent',
      'creator': 'creator',
      'protector': 'protector',
      'teacher': 'teacher',
      'healer': 'healer',
      'leader': 'leader',
      'seeker': 'seeker'
    }
  },

  psychology: {
    id: 'psychology-extended-karma-test',
    beliefSystem: 'psychology',
    scoringMethod: 'categorical',
    questions: [
      {
        id: 'psych-deep-1',
        type: 'scenario',
        question: 'В сложной жизненной ситуации ваша первая реакция...',
        weight: 4,
        options: [
          { id: 'support-others', text: 'Я забочусь о том, как это влияет на других, и предлагаю поддержку', value: 'helper', karmaType: 'helper' },
          { id: 'analyze-self', text: 'Я анализирую свои чувства и ищу внутренние ресурсы', value: 'independent', karmaType: 'independent' },
          { id: 'find-solution', text: 'Я ищу творческие и нестандартные решения проблемы', value: 'creator', karmaType: 'creator' },
          { id: 'protect-vulnerable', text: 'Я думаю о том, кого нужно защитить от последствий', value: 'protector', karmaType: 'protector' },
          { id: 'learn-lesson', text: 'Я ищу урок, который можно извлечь и передать другим', value: 'teacher', karmaType: 'teacher' },
          { id: 'heal-wounds', text: 'Я фокусируюсь на исцелении эмоциональных ран', value: 'healer', karmaType: 'healer' },
          { id: 'take-charge', text: 'Я беру ответственность и организую действия', value: 'leader', karmaType: 'leader' },
          { id: 'understand-meaning', text: 'Я ищу глубокий смысл происходящего', value: 'seeker', karmaType: 'seeker' }
        ]
      },
      {
        id: 'psych-deep-2',
        type: 'scale',
        question: 'Насколько сильно вы чувствуете ответственность за эмоциональное благополучие других? (1-10)',
        weight: 3,
        category: 'empathy'
      },
      {
        id: 'psych-deep-3',
        type: 'choice',
        question: 'Что больше всего мотивирует вас в жизни?',
        weight: 4,
        options: [
          { id: 'helping-others', text: 'Знание, что я делаю жизнь других людей лучше', value: 'helper', karmaType: 'helper' },
          { id: 'personal-growth', text: 'Постоянное развитие и самопознание', value: 'independent', karmaType: 'independent' },
          { id: 'creative-expression', text: 'Возможность выразить себя и создать что-то уникальное', value: 'creator', karmaType: 'creator' },
          { id: 'justice-fairness', text: 'Борьба за справедливость и защита слабых', value: 'protector', karmaType: 'protector' },
          { id: 'sharing-knowledge', text: 'Передача знаний и помощь в обучении', value: 'teacher', karmaType: 'teacher' },
          { id: 'healing-pain', text: 'Исцеление боли и страданий других', value: 'healer', karmaType: 'healer' },
          { id: 'inspiring-change', text: 'Вдохновение других на позитивные изменения', value: 'leader', karmaType: 'leader' },
          { id: 'finding-truth', text: 'Поиск истины и глубокого понимания жизни', value: 'seeker', karmaType: 'seeker' }
        ]
      },
      {
        id: 'psych-deep-4',
        type: 'scenario',
        question: 'Когда вы видите страдающего человека, ваша первая мысль...',
        weight: 3,
        options: [
          { id: 'how-help', text: '"Как я могу помочь?" - я сразу думаю о практической поддержке', value: 'helper', karmaType: 'helper' },
          { id: 'respect-journey', text: '"Это их путь" - я уважаю их право на собственный опыт', value: 'independent', karmaType: 'independent' },
          { id: 'creative-solution', text: '"Есть ли нестандартный способ помочь?" - я ищу творческий подход', value: 'creator', karmaType: 'creator' },
          { id: 'who-hurt', text: '"Кто или что причинило вред?" - я хочу устранить источник проблемы', value: 'protector', karmaType: 'protector' },
          { id: 'what-learn', text: '"Чему это может научить?" - я вижу возможность для роста', value: 'teacher', karmaType: 'teacher' },
          { id: 'heal-pain', text: '"Как исцелить эту боль?" - я чувствую призыв к исцелению', value: 'healer', karmaType: 'healer' },
          { id: 'mobilize-help', text: '"Кого еще привлечь?" - я думаю о мобилизации ресурсов', value: 'leader', karmaType: 'leader' },
          { id: 'deeper-meaning', text: '"В чем глубокий смысл?" - я ищу духовное понимание', value: 'seeker', karmaType: 'seeker' }
        ]
      },
      {
        id: 'psych-deep-5',
        type: 'priority',
        question: 'Расставьте по важности ваши жизненные ценности (1 - самое важное):',
        weight: 3,
        options: [
          { id: 'compassion', text: 'Сострадание и забота о других', value: 'helper', karmaType: 'helper' },
          { id: 'authenticity', text: 'Аутентичность и верность себе', value: 'independent', karmaType: 'independent' },
          { id: 'creativity', text: 'Творческое самовыражение', value: 'creator', karmaType: 'creator' },
          { id: 'justice', text: 'Справедливость и защита слабых', value: 'protector', karmaType: 'protector' },
          { id: 'wisdom', text: 'Мудрость и передача знаний', value: 'teacher', karmaType: 'teacher' },
          { id: 'healing', text: 'Исцеление и восстановление', value: 'healer', karmaType: 'healer' },
          { id: 'leadership', text: 'Лидерство и вдохновение', value: 'leader', karmaType: 'leader' },
          { id: 'truth', text: 'Поиск истины и понимания', value: 'seeker', karmaType: 'seeker' }
        ]
      },
      {
        id: 'psych-deep-6',
        type: 'scale',
        question: 'Насколько важно для вас иметь контроль над ситуацией? (1-10)',
        weight: 2,
        category: 'control'
      }
    ],
    resultMapping: {
      'helper': 'helper',
      'independent': 'independent',
      'creator': 'creator',
      'protector': 'protector',
      'teacher': 'teacher',
      'healer': 'healer',
      'leader': 'leader',
      'seeker': 'seeker'
    }
  },

  chakras: {
    id: 'chakras-extended-karma-test',
    beliefSystem: 'chakras',
    scoringMethod: 'weighted',
    questions: [
      {
        id: 'chakra-deep-1',
        type: 'scenario',
        question: 'Во время глубокой медитации вы чувствуете наибольшую активность в области...',
        weight: 4,
        options: [
          { id: 'root-grounding', text: 'Основания позвоночника - я чувствую связь с землей и свою независимость', value: 'independent', karmaType: 'independent' },
          { id: 'sacral-creativity', text: 'Низа живота - творческая энергия пульсирует и требует выражения', value: 'creator', karmaType: 'creator' },
          { id: 'solar-power', text: 'Солнечного сплетения - я ощущаю личную силу и желание защищать', value: 'protector', karmaType: 'protector' },
          { id: 'heart-love', text: 'Сердца - любовь и сострадание переполняют меня', value: 'helper', karmaType: 'helper' },
          { id: 'heart-healing', text: 'Сердца - исцеляющая энергия течет через меня к другим', value: 'healer', karmaType: 'healer' },
          { id: 'throat-truth', text: 'Горла - я чувствую необходимость говорить истину и учить', value: 'teacher', karmaType: 'teacher' },
          { id: 'third-eye-wisdom', text: 'Между бровей - открываются каналы высшего знания', value: 'seeker', karmaType: 'seeker' },
          { id: 'crown-leadership', text: 'Макушки - я чувствую связь с божественным и призвание вести', value: 'leader', karmaType: 'leader' }
        ]
      },
      {
        id: 'chakra-deep-2',
        type: 'choice',
        question: 'Какой цвет наиболее сильно резонирует с вашей душой?',
        weight: 3,
        options: [
          { id: 'red-grounding', text: 'Красный - цвет жизненной силы и независимости', value: 'independent', karmaType: 'independent' },
          { id: 'orange-creativity', text: 'Оранжевый - цвет творчества и радости создания', value: 'creator', karmaType: 'creator' },
          { id: 'yellow-power', text: 'Желтый - цвет личной силы и защиты', value: 'protector', karmaType: 'protector' },
          { id: 'green-compassion', text: 'Зеленый - цвет сострадания и помощи', value: 'helper', karmaType: 'helper' },
          { id: 'pink-healing', text: 'Розовый - цвет безусловной любви и исцеления', value: 'healer', karmaType: 'healer' },
          { id: 'blue-truth', text: 'Голубой - цвет истины и мудрости', value: 'teacher', karmaType: 'teacher' },
          { id: 'indigo-intuition', text: 'Индиго - цвет интуиции и поиска истины', value: 'seeker', karmaType: 'seeker' },
          { id: 'violet-leadership', text: 'Фиолетовый - цвет духовного лидерства', value: 'leader', karmaType: 'leader' }
        ]
      },
      {
        id: 'chakra-deep-3',
        type: 'scenario',
        question: 'Когда вы работаете с энергией, вы чувствуете призвание...',
        weight: 3,
        options: [
          { id: 'ground-others', text: 'Помочь другим заземлиться и найти стабильность', value: 'helper', karmaType: 'helper' },
          { id: 'strengthen-self', text: 'Укрепить свою собственную энергетическую независимость', value: 'independent', karmaType: 'independent' },
          { id: 'create-beauty', text: 'Создать красивые энергетические формы и вибрации', value: 'creator', karmaType: 'creator' },
          { id: 'shield-others', text: 'Создать защитный энергетический щит для уязвимых', value: 'protector', karmaType: 'protector' },
          { id: 'teach-techniques', text: 'Обучить других техникам работы с энергией', value: 'teacher', karmaType: 'teacher' },
          { id: 'heal-blockages', text: 'Исцелить энергетические блокировки и травмы', value: 'healer', karmaType: 'healer' },
          { id: 'channel-power', text: 'Направить мощную энергию для трансформации', value: 'leader', karmaType: 'leader' },
          { id: 'explore-realms', text: 'Исследовать тонкие энергетические реальности', value: 'seeker', karmaType: 'seeker' }
        ]
      },
      {
        id: 'chakra-deep-4',
        type: 'choice',
        question: 'Какая мантра наиболее глубоко отзывается в вашем существе?',
        weight: 2,
        options: [
          { id: 'lam-stability', text: 'ЛАМ - я стою твердо на своем пути', value: 'independent', karmaType: 'independent' },
          { id: 'vam-flow', text: 'ВАМ - я теку как вода, создавая новые формы', value: 'creator', karmaType: 'creator' },
          { id: 'ram-power', text: 'РАМ - я излучаю силу и защищаю других', value: 'protector', karmaType: 'protector' },
          { id: 'yam-love', text: 'ЯМ - я дарю любовь всем существам', value: 'helper', karmaType: 'helper' },
          { id: 'yam-healing', text: 'ЯМ - через меня течет исцеляющая любовь', value: 'healer', karmaType: 'healer' },
          { id: 'ham-truth', text: 'ХАМ - я говорю истину с состраданием', value: 'teacher', karmaType: 'teacher' },
          { id: 'om-wisdom', text: 'ОМ - я един с космической мудростью', value: 'seeker', karmaType: 'seeker' },
          { id: 'silence-leadership', text: 'Тишина - я веду через пример и присутствие', value: 'leader', karmaType: 'leader' }
        ]
      },
      {
        id: 'chakra-deep-5',
        type: 'scenario',
        question: 'В состоянии энергетического дисбаланса вы инстинктивно...',
        weight: 2,
        options: [
          { id: 'help-balance', text: 'Помогаю другим восстановить их баланс', value: 'helper', karmaType: 'helper' },
          { id: 'retreat-restore', text: 'Ухожу в себя для восстановления', value: 'independent', karmaType: 'independent' },
          { id: 'express-creatively', text: 'Выражаю дисбаланс через творчество', value: 'creator', karmaType: 'creator' },
          { id: 'protect-energy', text: 'Защищаю свою энергию от внешних влияний', value: 'protector', karmaType: 'protector' },
          { id: 'study-causes', text: 'Изучаю причины дисбаланса для обучения', value: 'teacher', karmaType: 'teacher' },
          { id: 'heal-root', text: 'Ищу корень проблемы для исцеления', value: 'healer', karmaType: 'healer' },
          { id: 'transform-energy', text: 'Трансформирую негативную энергию в позитивную', value: 'leader', karmaType: 'leader' },
          { id: 'seek-meaning', text: 'Ищу духовный смысл в происходящем', value: 'seeker', karmaType: 'seeker' }
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
    id: 'numerology-extended-karma-test',
    beliefSystem: 'numerology',
    scoringMethod: 'weighted',
    questions: [
      {
        id: 'num-deep-1',
        type: 'scenario',
        question: 'Когда вы видите повторяющиеся числа (например, 11:11), ваша первая мысль...',
        weight: 4,
        options: [
          { id: 'help-sign', text: 'Это знак, что кому-то нужна моя помощь', value: 'helper', karmaType: 'helper' },
          { id: 'personal-message', text: 'Это личное послание для моего развития', value: 'independent', karmaType: 'independent' },
          { id: 'creative-inspiration', text: 'Это вдохновение для нового творческого проекта', value: 'creator', karmaType: 'creator' },
          { id: 'warning-protection', text: 'Это предупреждение о необходимости защиты', value: 'protector', karmaType: 'protector' },
          { id: 'teaching-moment', text: 'Это возможность поделиться знанием о числах', value: 'teacher', karmaType: 'teacher' },
          { id: 'healing-energy', text: 'Это исцеляющая энергия, которую нужно направить', value: 'healer', karmaType: 'healer' },
          { id: 'leadership-call', text: 'Это призыв к действию и лидерству', value: 'leader', karmaType: 'leader' },
          { id: 'mystery-explore', text: 'Это тайна, которую нужно исследовать', value: 'seeker', karmaType: 'seeker' }
        ]
      },
      {
        id: 'num-deep-2',
        type: 'choice',
        question: 'Какое число от 1 до 9 наиболее точно отражает вашу кармическую миссию?',
        weight: 4,
        options: [
          { id: 'one-leadership', text: '1 - Я пионер, который ведет других к новым возможностям', value: 'leader', karmaType: 'leader' },
          { id: 'two-cooperation', text: '2 - Я миротворец, который помогает людям сотрудничать', value: 'helper', karmaType: 'helper' },
          { id: 'three-expression', text: '3 - Я творец, который вдохновляет через искусство', value: 'creator', karmaType: 'creator' },
          { id: 'four-stability', text: '4 - Я строитель, который создает прочные основы', value: 'protector', karmaType: 'protector' },
          { id: 'five-freedom', text: '5 - Я свободный дух, который идет своим путем', value: 'independent', karmaType: 'independent' },
          { id: 'six-nurturing', text: '6 - Я целитель, который исцеляет семьи и сообщества', value: 'healer', karmaType: 'healer' },
          { id: 'seven-seeker', text: '7 - Я мистик, который ищет скрытые истины', value: 'seeker', karmaType: 'seeker' },
          { id: 'eight-power', text: '8 - Я лидер, который трансформирует материальный мир', value: 'leader', karmaType: 'leader' },
          { id: 'nine-service', text: '9 - Я учитель, который служит всему человечеству', value: 'teacher', karmaType: 'teacher' }
        ]
      },
      {
        id: 'num-deep-3',
        type: 'scenario',
        question: 'При принятии важного решения вы...',
        weight: 3,
        options: [
          { id: 'consult-others', text: 'Консультируюсь с другими и учитываю их потребности', value: 'helper', karmaType: 'helper' },
          { id: 'trust-intuition', text: 'Доверяю своей интуиции и внутреннему голосу', value: 'independent', karmaType: 'independent' },
          { id: 'visualize-outcome', text: 'Визуализирую творческие возможности', value: 'creator', karmaType: 'creator' },
          { id: 'assess-risks', text: 'Оцениваю риски и думаю о защите', value: 'protector', karmaType: 'protector' },
          { id: 'research-facts', text: 'Исследую факты и ищу мудрые советы', value: 'teacher', karmaType: 'teacher' },
          { id: 'feel-energy', text: 'Чувствую энергию ситуации и ищу исцеление', value: 'healer', karmaType: 'healer' },
          { id: 'consider-impact', text: 'Рассматриваю долгосрочное влияние на всех', value: 'leader', karmaType: 'leader' },
          { id: 'seek-meaning', text: 'Ищу глубокий духовный смысл', value: 'seeker', karmaType: 'seeker' }
        ]
      },
      {
        id: 'num-deep-4',
        type: 'choice',
        question: 'Какая числовая последовательность наиболее привлекает вас?',
        weight: 2,
        options: [
          { id: 'ascending', text: '1-2-3-4-5 - Постепенный рост и развитие', value: 'teacher', karmaType: 'teacher' },
          { id: 'mirrored', text: '1-2-1 или 3-4-3 - Баланс и гармония', value: 'helper', karmaType: 'helper' },
          { id: 'fibonacci', text: '1-1-2-3-5 - Природные паттерны и творчество', value: 'creator', karmaType: 'creator' },
          { id: 'powerful', text: '8-8-8 или 1-0-0 - Сила и трансформация', value: 'leader', karmaType: 'leader' },
          { id: 'mystical', text: '7-7-7 или 9-9-9 - Духовные тайны', value: 'seeker', karmaType: 'seeker' },
          { id: 'healing', text: '3-6-9 - Исцеляющие частоты', value: 'healer', karmaType: 'healer' },
          { id: 'protective', text: '4-4-4 или 6-6-6 - Стабильность и защита', value: 'protector', karmaType: 'protector' },
          { id: 'independent', text: '1-1-1 или 5-5-5 - Индивидуальность и свобода', value: 'independent', karmaType: 'independent' }
        ]
      }
    ],
    resultMapping: {
      'helper': 'helper',
      'independent': 'independent',
      'creator': 'creator',
      'protector': 'protector',
      'teacher': 'teacher',
      'healer': 'healer',
      'leader': 'leader',
      'seeker': 'seeker'
    }
  },

  tarot: {
    id: 'tarot-extended-karma-test',
    beliefSystem: 'tarot',
    scoringMethod: 'intuitive',
    questions: [
      {
        id: 'tarot-deep-1',
        type: 'scenario',
        question: 'Если бы ваша жизнь была путешествием Дурака через Старшие Арканы, на какой карте вы сейчас находитесь?',
        weight: 4,
        options: [
          { id: 'fool-beginning', text: 'Дурак - я начинаю новый независимый путь', value: 'independent', karmaType: 'independent' },
          { id: 'magician-creating', text: 'Маг - я манифестирую свои творческие видения', value: 'creator', karmaType: 'creator' },
          { id: 'high-priestess-intuition', text: 'Верховная Жрица - я развиваю интуицию и ищу тайны', value: 'seeker', karmaType: 'seeker' },
          { id: 'empress-nurturing', text: 'Императрица - я забочусь и исцеляю других', value: 'healer', karmaType: 'healer' },
          { id: 'emperor-protecting', text: 'Император - я создаю структуру и защищаю', value: 'protector', karmaType: 'protector' },
          { id: 'hierophant-teaching', text: 'Иерофант - я передаю традиционную мудрость', value: 'teacher', karmaType: 'teacher' },
          { id: 'lovers-connecting', text: 'Влюбленные - я помогаю людям соединяться', value: 'helper', karmaType: 'helper' },
          { id: 'chariot-leading', text: 'Колесница - я веду других к победе', value: 'leader', karmaType: 'leader' }
        ]
      },
      {
        id: 'tarot-deep-2',
        type: 'choice',
        question: 'Какая масть Младших Арканов наиболее точно отражает вашу кармическую природу?',
        weight: 3,
        options: [
          { id: 'cups-emotion', text: 'Кубки - я работаю с эмоциями и исцелением', value: 'healer', karmaType: 'healer' },
          { id: 'cups-love', text: 'Кубки - я дарю любовь и поддержку', value: 'helper', karmaType: 'helper' },
          { id: 'wands-passion', text: 'Жезлы - я следую своей страсти и интуиции', value: 'independent', karmaType: 'independent' },
          { id: 'wands-creativity', text: 'Жезлы - я воплощаю творческие проекты', value: 'creator', karmaType: 'creator' },
          { id: 'swords-truth', text: 'Мечи - я ищу истину и делюсь знанием', value: 'teacher', karmaType: 'teacher' },
          { id: 'swords-justice', text: 'Мечи - я борюсь за справедливость', value: 'protector', karmaType: 'protector' },
          { id: 'pentacles-manifestation', text: 'Пентакли - я материализую духовные идеи', value: 'leader', karmaType: 'leader' },
          { id: 'pentacles-mystery', text: 'Пентакли - я исследую материальные тайны', value: 'seeker', karmaType: 'seeker' }
        ]
      },
      {
        id: 'tarot-deep-3',
        type: 'scenario',
        question: 'Когда вы делаете расклад для другого человека, вы чувствуете...',
        weight: 3,
        options: [
          { id: 'responsibility-help', text: 'Ответственность помочь им найти ответы', value: 'helper', karmaType: 'helper' },
          { id: 'channel-wisdom', text: 'Что я канализирую высшую мудрость', value: 'independent', karmaType: 'independent' },
          { id: 'creative-interpretation', text: 'Творческое вдохновение в интерпретации', value: 'creator', karmaType: 'creator' },
          { id: 'protect-energy', text: 'Необходимость защитить их энергетически', value: 'protector', karmaType: 'protector' },
          { id: 'teach-symbols', text: 'Желание научить их понимать символы', value: 'teacher', karmaType: 'teacher' },
          { id: 'heal-wounds', text: 'Призвание исцелить их эмоциональные раны', value: 'healer', karmaType: 'healer' },
          { id: 'empower-choice', text: 'Важность дать им силу для выбора', value: 'leader', karmaType: 'leader' },
          { id: 'reveal-mystery', text: 'Возможность раскрыть скрытые тайны', value: 'seeker', karmaType: 'seeker' }
        ]
      },
      {
        id: 'tarot-deep-4',
        type: 'choice',
        question: 'Какая карта Таро лучше всего описывает вашу кармическую миссию?',
        weight: 4,
        options: [
          { id: 'star-hope', text: 'Звезда - я даю надежду и исцеление', value: 'healer', karmaType: 'healer' },
          { id: 'hermit-wisdom', text: 'Отшельник - я ищу и делюсь внутренней мудростью', value: 'seeker', karmaType: 'seeker' },
          { id: 'strength-courage', text: 'Сила - я защищаю слабых своей внутренней силой', value: 'protector', karmaType: 'protector' },
          { id: 'temperance-balance', text: 'Умеренность - я помогаю найти баланс и гармонию', value: 'helper', karmaType: 'helper' },
          { id: 'sun-joy', text: 'Солнце - я приношу радость и творческую энергию', value: 'creator', karmaType: 'creator' },
          { id: 'world-completion', text: 'Мир - я помогаю другим достичь целостности', value: 'teacher', karmaType: 'teacher' },
          { id: 'wheel-change', text: 'Колесо Фортуны - я веду через изменения', value: 'leader', karmaType: 'leader' },
          { id: 'hanged-sacrifice', text: 'Повешенный - я жертвую собой ради высшей цели', value: 'independent', karmaType: 'independent' }
        ]
      }
    ],
    resultMapping: {
      'independent': 'independent',
      'creator': 'creator',
      'seeker': 'seeker',
      'healer': 'healer',
      'protector': 'protector',
      'teacher': 'teacher',
      'helper': 'helper',
      'leader': 'leader'
    }
  }
};

export const getExtendedTestByBeliefSystem = (beliefSystem: string): KarmaTest | undefined => {
  return extendedKarmaTests[beliefSystem];
};