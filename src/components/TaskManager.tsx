import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Filter, Search, Globe } from 'lucide-react';
import { AppState, Task } from '../types';
import { useQuests } from '../hooks/useQuests';
import QuestCard, { QuestCardSkeleton } from './QuestCard';
import TranslationStatus from './TranslationStatus';
import LoadingSkeleton from './LoadingSkeleton';

interface TaskManagerProps {
  state: AppState;
  onTaskToggle: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ state, onTaskToggle, onAddTask }) => {
  const { t } = useTranslation(['tasks', 'common']);
  const { data: questsData, isLoading, error, refetch } = useQuests();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'health' as Task['category'],
    priority: 3 as Task['priority'],
    xpReward: 10
  });

  const categories = [
    { id: 'all', name: t('categories.all'), color: 'gray' },
    { id: 'health', name: t('categories.health'), color: 'red' },
    { id: 'relationships', name: t('categories.relationships'), color: 'pink' },
    { id: 'finances', name: t('categories.finances'), color: 'green' },
    { id: 'spirituality', name: t('categories.spirituality'), color: 'purple' },
    { id: 'career', name: t('categories.career'), color: 'blue' }
  ];

  // Combine API quests with local tasks
  const allTasks = [
    ...(questsData?.quests.map(quest => ({
      id: quest.key,
      title: quest.title,
      description: quest.description || '',
      category: quest.category,
      priority: quest.priority,
      completed: quest.completed || false,
      xpReward: quest.xpReward,
      createdAt: new Date(),
      source: 'auto-generated' as const,
      beliefSystemSource: quest.beliefSystem
    })) || []),
    ...state.tasks
  ];

  const filteredTasks = allTasks.filter(task => {
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      ...newTask,
      completed: false,
      dueDate: undefined
    });
    setNewTask({
      title: '',
      description: '',
      category: 'health',
      priority: 3,
      xpReward: 10
    });
    setShowAddForm(false);
  };

  const completedTasks = allTasks.filter(task => task.completed).length;
  const totalTasks = allTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600 mb-4">{t('description')}</p>
          
          {/* Progress Bar */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{t('progress.title')}</h2>
              <span className="text-sm text-gray-600">
                {completedTasks} {t('common:navigation.tasks').toLowerCase()} {t('progress.of')} {totalTasks} {t('common:status.completed').toLowerCase()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-purple-600 to-teal-600 transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="text-sm text-gray-600">{completionRate}% {t('progress.complete')}</div>
          </div>
        </div>

        {/* Translation Status */}
        {questsData && (
          <TranslationStatus
            fallback={questsData.fallback}
            translationInProgress={questsData.translationInProgress}
            missingCount={questsData.missingCount}
            onRetry={refetch}
          />
        )}

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('addTask')}
            </button>
          </div>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('addForm.title')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addForm.taskTitle')}
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addForm.category')}
                  </label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value as Task['category']})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="health">{t('categories.health')}</option>
                    <option value="relationships">{t('categories.relationships')}</option>
                    <option value="finances">{t('categories.finances')}</option>
                    <option value="spirituality">{t('categories.spirituality')}</option>
                    <option value="career">{t('categories.career')}</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addForm.description')}
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addForm.priority')} (1-5)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: parseInt(e.target.value) as Task['priority']})}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600 mt-1">
                    {newTask.priority} ⭐
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addForm.xpReward')}
                  </label>
                  <input
                    type="number"
                    value={newTask.xpReward}
                    onChange={(e) => setNewTask({...newTask, xpReward: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="1"
                    max="100"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
                >
                  {t('common:buttons.add')} {t('common:navigation.tasks')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  {t('common:buttons.cancel')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <QuestCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="text-red-600">⚠️</div>
              <div>
                <h4 className="font-medium text-red-900">{t('error.title')}</h4>
                <p className="text-sm text-red-700">{t('error.message')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <QuestCard
                key={task.id}
                quest={{
                  key: task.id,
                  title: task.title,
                  description: task.description,
                  category: task.category,
                  priority: task.priority,
                  xpReward: task.xpReward,
                  beliefSystem: task.beliefSystemSource,
                  completed: task.completed
                }}
                onToggle={onTaskToggle}
                showTranslationStatus={true}
              />
            ))}
            
            {filteredTasks.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('empty.title')}</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterCategory !== 'all' 
                    ? t('empty.filtered')
                    : t('empty.noTasks')
                  }
                </p>
                {!searchTerm && filterCategory === 'all' && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
                  >
                    {t('empty.addFirst')}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;