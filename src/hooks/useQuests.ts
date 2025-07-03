import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Quest, QuestResponse } from '../types/quest';

// Mock API function - replace with actual tRPC call
const fetchQuests = async (lng: string): Promise<QuestResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data based on language
  const mockQuests: Quest[] = [
    {
      key: 'meditation_daily',
      title: lng === 'ru' ? 'Ежедневная медитация' : lng === 'kz' ? 'Күнделікті медитация' : 'Practice daily meditation',
      description: lng === 'ru' ? 'Проводите 10 минут в осознанной медитации для центрирования' : lng === 'kz' ? 'Өзіңізді орталықтандыру үшін 10 минут саналы медитацияда болыңыз' : 'Spend 10 minutes in mindful meditation to center yourself',
      category: 'spirituality',
      priority: 4,
      xpReward: 25,
      beliefSystem: 'psychology',
      translatedBy: lng === 'en' ? undefined : 'gpt',
      qualityScore: 0.9
    },
    {
      key: 'gratitude_journal',
      title: lng === 'ru' ? 'Дневник благодарности' : lng === 'kz' ? 'Ризашылық күнделігі' : 'Write in gratitude journal',
      description: lng === 'ru' ? 'Запишите 3 вещи, за которые вы благодарны сегодня' : lng === 'kz' ? 'Бүгін ризашылық білдіретін 3 нәрсені жазыңыз' : 'List 3 things you are grateful for today',
      category: 'spirituality',
      priority: 3,
      xpReward: 20,
      beliefSystem: 'psychology',
      translatedBy: lng === 'en' ? undefined : 'gpt',
      qualityScore: 0.85
    },
    {
      key: 'chakra_balance',
      title: lng === 'ru' ? 'Балансировка чакр' : lng === 'kz' ? 'Чакраларды теңгеру' : 'Balance your chakras',
      description: lng === 'ru' ? 'Выполните медитацию для балансировки чакр, сосредоточившись на энергетических центрах' : lng === 'kz' ? 'Энергетикалық орталықтарға назар аудара отырып, чакраларды теңгеру медитациясын орындаңыз' : 'Perform chakra balancing meditation focusing on energy centers',
      category: 'health',
      priority: 4,
      xpReward: 30,
      beliefSystem: 'chakras',
      translatedBy: lng === 'en' ? undefined : 'gpt',
      qualityScore: 0.88
    }
  ];

  // Simulate fallback scenario for missing translations
  if (lng !== 'en' && Math.random() > 0.7) {
    return {
      quests: mockQuests.map(q => ({ ...q, title: q.title, description: q.description })),
      fallback: 'en',
      translationInProgress: true,
      missingCount: 2
    };
  }

  return { quests: mockQuests };
};

export function useQuests() {
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['quests', i18n.language],
    queryFn: () => fetchQuests(i18n.language),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useQuestMutations() {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  const invalidateQuests = () => {
    queryClient.invalidateQueries({ queryKey: ['quests'] });
  };

  const requestTranslation = async (questKey: string, targetLng: string) => {
    // Mock API call to request translation
    console.log(`Requesting translation for ${questKey} to ${targetLng}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Invalidate queries to refetch
    invalidateQuests();
  };

  return {
    requestTranslation,
    invalidateQuests
  };
}