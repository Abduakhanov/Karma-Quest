import React, { useState } from 'react';
import { Plus, Star, Calendar, CheckCircle, Circle, Filter, Search } from 'lucide-react';
import { AppState, Task } from '../types';

interface TaskManagerProps {
  state: AppState;
  onTaskToggle: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ state, onTaskToggle, onAddTask }) => {
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
    { id: 'all', name: 'All Tasks', color: 'gray' },
    { id: 'health', name: 'Health', color: 'red' },
    { id: 'relationships', name: 'Relationships', color: 'pink' },
    { id: 'finances', name: 'Finances', color: 'green' },
    { id: 'spirituality', name: 'Spirituality', color: 'purple' },
    { id: 'career', name: 'Career', color: 'blue' }
  ];

  const priorityColors = {
    1: 'bg-gray-100 text-gray-600',
    2: 'bg-blue-100 text-blue-600',
    3: 'bg-yellow-100 text-yellow-600',
    4: 'bg-orange-100 text-orange-600',
    5: 'bg-red-100 text-red-600'
  };

  const categoryColors = {
    health: 'bg-red-50 border-red-200 text-red-700',
    relationships: 'bg-pink-50 border-pink-200 text-pink-700',
    finances: 'bg-green-50 border-green-200 text-green-700',
    spirituality: 'bg-purple-50 border-purple-200 text-purple-700',
    career: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  const filteredTasks = state.tasks.filter(task => {
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

  const completedTasks = state.tasks.filter(task => task.completed).length;
  const totalTasks = state.tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Karma Tasks</h1>
          <p className="text-gray-600 mb-4">
            Complete tasks to earn XP and improve your karma score
          </p>
          
          {/* Progress Bar */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Progress Overview</h2>
              <span className="text-sm text-gray-600">{completedTasks} of {totalTasks} completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-purple-600 to-teal-600 transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="text-sm text-gray-600">{completionRate}% Complete</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks..."
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
              Add Task
            </button>
          </div>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title
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
                    Category
                  </label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value as Task['category']})}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
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
                    Priority (1-5)
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNewTask({...newTask, priority: num as Task['priority']})}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          newTask.priority >= num 
                            ? 'bg-yellow-400 border-yellow-400' 
                            : 'border-gray-300 hover:border-yellow-400'
                        }`}
                      >
                        <Star className={`w-4 h-4 mx-auto ${newTask.priority >= num ? 'text-white' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    XP Reward
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
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <div key={task.id} className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
              task.completed ? 'bg-gray-50 opacity-75' : ''
            } ${categoryColors[task.category]}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <button
                    onClick={() => onTaskToggle(task.id)}
                    className="mt-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {task.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                        {task.category}
                      </span>
                    </div>
                    
                    <p className={`text-sm mb-3 ${task.completed ? 'text-gray-500' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>Priority {task.priority}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>+{task.xpReward} XP</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                    {task.priority}★
                  </div>
                  {task.completed && (
                    <div className="text-xs text-green-600 font-medium">
                      ✓ Completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filter'
                  : 'Start your karma journey by adding your first task'
                }
              </p>
              {!searchTerm && filterCategory === 'all' && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
                >
                  Add Your First Task
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;