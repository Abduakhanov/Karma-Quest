import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Calendar, Heart, Tag, BookOpen, Edit3, Trash2, Search } from 'lucide-react';
import { AppState, DiaryEntry } from '../types';

interface DiarySystemProps {
  state: AppState;
  onAddEntry: (entry: Omit<DiaryEntry, 'id'>) => void;
  onDeleteEntry: (entryId: string) => void;
}

const DiarySystem: React.FC<DiarySystemProps> = ({ state, onAddEntry, onDeleteEntry }) => {
  const { t } = useTranslation(['diary', 'common']);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 3 as DiaryEntry['mood'],
    tags: [] as string[],
    date: new Date()
  });

  const moodEmojis = {
    1: '😢',
    2: '😔',
    3: '😐',
    4: '😊',
    5: '😄'
  };

  const moodColors = {
    1: 'bg-red-100 text-red-600',
    2: 'bg-orange-100 text-orange-600',
    3: 'bg-yellow-100 text-yellow-600',
    4: 'bg-green-100 text-green-600',
    5: 'bg-emerald-100 text-emerald-600'
  };

  const filteredEntries = state.diaryEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEntry(newEntry);
    setNewEntry({
      title: '',
      content: '',
      mood: 3,
      tags: [],
      date: new Date()
    });
    setShowAddForm(false);
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!newEntry.tags.includes(newTag)) {
        setNewEntry({
          ...newEntry,
          tags: [...newEntry.tags, newTag]
        });
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewEntry({
      ...newEntry,
      tags: newEntry.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const averageMood = state.diaryEntries.length > 0 
    ? Math.round(state.diaryEntries.reduce((sum, entry) => sum + entry.mood, 0) / state.diaryEntries.length)
    : 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600 mb-6">{t('description')}</p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('stats.totalEntries')}</p>
                  <p className="text-2xl font-bold text-purple-600">{state.diaryEntries.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('stats.averageMood')}</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {moodEmojis[averageMood as keyof typeof moodEmojis]}
                  </p>
                </div>
                <Heart className="w-8 h-8 text-teal-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('stats.thisWeek')}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {state.diaryEntries.filter(entry => {
                      const entryDate = new Date(entry.date);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return entryDate >= weekAgo;
                    }).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('newEntry')}
            </button>
          </div>
        </div>

        {/* Add Entry Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('addForm.title')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addForm.entryTitle')}
                </label>
                <input
                  type="text"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={t('addForm.placeholder.title')}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addForm.content')}
                </label>
                <textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={6}
                  placeholder={t('addForm.placeholder.content')}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addForm.mood')}
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map(mood => (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => setNewEntry({...newEntry, mood: mood as DiaryEntry['mood']})}
                        className={`w-12 h-12 rounded-full border-2 transition-all ${
                          newEntry.mood === mood
                            ? 'border-purple-500 bg-purple-50 scale-110'
                            : 'border-gray-300 hover:border-purple-300'
                        }`}
                        title={t(`mood.${mood}`)}
                      >
                        <span className="text-xl">{moodEmojis[mood as keyof typeof moodEmojis]}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addForm.tags')}
                  </label>
                  <input
                    type="text"
                    onKeyDown={handleTagInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={t('addForm.placeholder.tags')}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newEntry.tags.map(tag => (
                      <span key={tag} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-purple-500 hover:text-purple-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
                >
                  {t('common:buttons.save')} {t('common:navigation.diary')}
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

        {/* Entries List */}
        <div className="space-y-4">
          {filteredEntries.map(entry => (
            <div key={entry.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${moodColors[entry.mood]}`}>
                    <span className="text-lg">{moodEmojis[entry.mood]}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedEntry(entry)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {entry.content.substring(0, 200)}
                  {entry.content.length > 200 && '...'}
                </p>
              </div>
              
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {entry.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {entry.insights && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">
                    <strong>{t('insights.prefix')}</strong> {entry.insights}
                  </p>
                </div>
              )}
            </div>
          ))}
          
          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('empty.title')}</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? t('empty.filtered')
                  : t('empty.noEntries')
                }
              </p>
              {!searchTerm && (
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
      </div>
    </div>
  );
};

export default DiarySystem;