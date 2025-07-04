import React, { useEffect, useState } from 'react';
import { Search, Command, Zap, BookOpen, Target, Trophy } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const KeyboardShortcuts: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { tasks, diaryEntries, setCurrentPage } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for global search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      
      // Escape to close search
      if (e.key === 'Escape') {
        setShowSearch(false);
        setSearchQuery('');
      }
      
      // Quick navigation shortcuts (Cmd/Ctrl + Shift + Key)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
        switch (e.key) {
          case 'D':
            e.preventDefault();
            setCurrentPage('dashboard');
            setShowSearch(false);
            break;
          case 'T':
            e.preventDefault();
            setCurrentPage('tasks');
            setShowSearch(false);
            break;
          case 'J':
            e.preventDefault();
            setCurrentPage('diary');
            setShowSearch(false);
            break;
          case 'R':
            e.preventDefault();
            setCurrentPage('rewards');
            setShowSearch(false);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentPage]);

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) {
      // Show quick navigation when no search query
      return [
        { type: 'Navigation', title: 'Go to Dashboard', action: () => setCurrentPage('dashboard'), icon: '🏠', shortcut: '⌘⇧D' },
        { type: 'Navigation', title: 'Go to Tasks', action: () => setCurrentPage('tasks'), icon: '✅', shortcut: '⌘⇧T' },
        { type: 'Navigation', title: 'Go to Diary', action: () => setCurrentPage('diary'), icon: '📔', shortcut: '⌘⇧J' },
        { type: 'Navigation', title: 'Go to Rewards', action: () => setCurrentPage('rewards'), icon: '🏆', shortcut: '⌘⇧R' }
      ];
    }
    
    const query = searchQuery.toLowerCase();
    const results: Array<{ type: string; title: string; action: () => void; icon: string; shortcut?: string }> = [];
    
    // Search tasks
    tasks.forEach(task => {
      if (task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query)) {
        results.push({
          type: 'Task',
          title: task.title,
          action: () => setCurrentPage('tasks'),
          icon: task.completed ? '✅' : '⭕'
        });
      }
    });
    
    // Search diary entries
    diaryEntries.forEach(entry => {
      if (entry.title.toLowerCase().includes(query) || entry.content.toLowerCase().includes(query)) {
        results.push({
          type: 'Diary',
          title: entry.title,
          action: () => setCurrentPage('diary'),
          icon: '📔'
        });
      }
    });
    
    // Navigation shortcuts
    const pages = [
      { name: 'Dashboard', page: 'dashboard' as const, icon: '🏠' },
      { name: 'Tasks', page: 'tasks' as const, icon: '✅' },
      { name: 'Diary', page: 'diary' as const, icon: '📔' },
      { name: 'Rewards', page: 'rewards' as const, icon: '🏆' }
    ];
    
    pages.forEach(({ name, page, icon }) => {
      if (name.toLowerCase().includes(query)) {
        results.push({
          type: 'Navigation',
          title: `Go to ${name}`,
          action: () => setCurrentPage(page),
          icon
        });
      }
    });
    
    return results.slice(0, 8); // Limit results
  }, [searchQuery, tasks, diaryEntries, setCurrentPage]);

  if (!showSearch) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 border border-gray-200 dark:border-gray-700 animate-slide-up">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, diary entries, or navigate..."
              className="w-full pl-10 pr-4 py-3 bg-transparent text-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none"
              autoFocus
            />
          </div>
        </div>
        
        {searchResults.length > 0 && (
          <div className="max-h-96 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => {
                  result.action();
                  setShowSearch(false);
                  setSearchQuery('');
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{result.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {result.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {result.type}
                      </div>
                    </div>
                  </div>
                  {result.shortcut && (
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs text-gray-600 dark:text-gray-400">
                      {result.shortcut}
                    </kbd>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-xl">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs">↵</kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs">⌘K</kbd>
                <span>Search</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs">esc</kbd>
              <span>Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;