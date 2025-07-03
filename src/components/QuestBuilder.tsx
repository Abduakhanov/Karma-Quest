import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Star, Target, Check, X, Shuffle, ArrowRight } from 'lucide-react';
import { Task } from '../types';

interface QuestBuilderProps {
  suggestedTasks: Task[];
  selectedTasks: string[];
  onTaskSelection: (taskIds: string[]) => void;
  onCustomTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onNext: () => void;
  onBack: () => void;
}

const QuestBuilder: React.FC<QuestBuilderProps> = ({
  suggestedTasks,
  selectedTasks,
  onTaskSelection,
  onCustomTask,
  onNext,
  onBack
}) => {
  const { t } = useTranslation(['onboarding', 'common']);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'health' | 'relationships' | 'finances' | 'spirituality' | 'career'>('all');
  const [customTask, setCustomTask] = useState({
    title: '',
    description: '',
    category: 'health' as Task['category'],
    priority: 3 as Task['priority'],
    xpReward: 20
  });

  const categoryColors = {
    health: 'bg-red-50 border-red-200 text-red-700',
    relationships: 'bg-pink-50 border-pink-200 text-pink-700',
    finances: 'bg-green-50 border-green-200 text-green-700',
    spirituality: 'bg-purple-50 border-purple-200 text-purple-700',
    career: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  const priorityColors = {
    1: 'text-gray-600',
    2: 'text-blue-600',
    3: 'text-yellow-600',
    4: 'text-orange-600',
    5: 'text-red-600'
  };

  const filteredTasks = suggestedTasks.filter(task => 
    filter === 'all' || task.category === filter
  );

  const handleTaskToggle = (taskId: string) => {
    if (selectedTasks.includes(taskId)) {
      onTaskSelection(selectedTasks.filter(id => id !== taskId));
    } else {
      onTaskSelection([...selectedTasks, taskId]);
    }
  };

  const handleCustomTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCustomTask({
      ...customTask,
      completed: false,
      source: 'user-created'
    });
    setCustomTask({
      title: '',
      description: '',
      category: 'health',
      priority: 3,
      xpReward: 20
    });
    setShowCustomForm(false);
  };

  const generateRandomSelection = () => {
    const shuffled = [...suggestedTasks].sort(() => 0.5 - Math.random());
    const randomSelection = shuffled.slice(0, Math.min(6, suggestedTasks.length));
    onTaskSelection(randomSelection.map(task => task.id));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t('quests.title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          {t('quests.description')}
        </p>
        
        {selectedTasks.length > 0 && (
          <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full">
            <Check className="w-4 h-4 mr-2" />
            <span className="font-medium">
              {selectedTasks.length === 1 
                ? t('quests.selected', { count: selectedTasks.length })
                : t('quests.selectedPlural', { count: selectedTasks.length })
              }
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {['all', 'health', 'relationships', 'finances', 'spirituality', 'career'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat
                    ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={generateRandomSelection}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              {t('quests.randomPick')}
            </button>
            <button
              onClick={() => setShowCustomForm(true)}
              className="flex items-center bg-gradient-to-r from-purple-600 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('quests.customQuest')}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Task Form */}
      {showCustomForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Create Custom Quest</h3>
            <button
              onClick={() => setShowCustomForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleCustomTaskSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quest Title</label>
                <input
                  type="text"
                  value={customTask.title}
                  onChange={(e) => setCustomTask({...customTask, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="What do you want to accomplish?"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={customTask.category}
                  onChange={(e) => setCustomTask({...customTask, category: e.target.value as Task['category']})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="health">Health</option>
                  <option value="relationships">Relationships</option>
                  <option value="finances">Finances</option>
                  <option value="spirituality">Spirituality</option>
                  <option value="career">Career</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={customTask.description}
                onChange={(e) => setCustomTask({...customTask, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder="Describe your quest in detail..."
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCustomTask({...customTask, priority: num as Task['priority']})}
                      className={`w-8 h-8 rounded-full border-2 transition-colors ${
                        customTask.priority >= num 
                          ? 'bg-yellow-400 border-yellow-400' 
                          : 'border-gray-300 hover:border-yellow-400'
                      }`}
                    >
                      <Star className={`w-4 h-4 mx-auto ${customTask.priority >= num ? 'text-white' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">XP Reward</label>
                <input
                  type="number"
                  value={customTask.xpReward}
                  onChange={(e) => setCustomTask({...customTask, xpReward: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="5"
                  max="100"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:scale-105 transition-transform"
              >
                Add Quest
              </button>
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {t('common:buttons.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Suggested Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            onClick={() => handleTaskToggle(task.id)}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
              selectedTasks.includes(task.id)
                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-teal-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  {selectedTasks.includes(task.id) && (
                    <Check className="w-5 h-5 text-purple-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[task.category]}`}>
                  {task.category}
                </span>
                {task.beliefSystemSource && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {task.beliefSystemSource}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(task.priority)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${priorityColors[task.priority]}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-500">+{task.xpReward} {t('common:units.xp')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No quests in this category</h3>
          <p className="text-gray-600 mb-4">Try a different category or create a custom quest</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          ← {t('common:buttons.back')}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            {selectedTasks.length === 0 ? t('quests.selectSome') : 
             selectedTasks.length === 1 ? `${selectedTasks.length} quest ${t('quests.ready')}` :
             `${selectedTasks.length} quests ${t('quests.readyPlural')}`}
          </p>
        </div>

        <button
          onClick={onNext}
          disabled={selectedTasks.length === 0}
          className={`flex items-center px-8 py-3 rounded-full font-semibold transition-all ${
            selectedTasks.length > 0
              ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white hover:scale-105 shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {t('quests.startJourney')}
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default QuestBuilder;