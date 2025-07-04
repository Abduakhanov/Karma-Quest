import React, { useState } from 'react';
import { Check, Filter, Star, Info } from 'lucide-react';
import { BeliefSystem } from '../types';
import { beliefSystems } from '../data/mockData';

interface BeliefSystemSelectorProps {
  selectedBeliefs: string[];
  onSelectionChange: (beliefs: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const BeliefSystemSelector: React.FC<BeliefSystemSelectorProps> = ({
  selectedBeliefs,
  onSelectionChange,
  onNext,
  onBack
}) => {
  const [filter, setFilter] = useState<'all' | 'popular' | 'spiritual' | 'psychological' | 'scientific' | 'traditional'>('popular');
  const [showInfo, setShowInfo] = useState<string | null>(null);

  const filteredSystems = beliefSystems.filter(system => {
    if (filter === 'all') return true;
    if (filter === 'popular') return system.popular;
    return system.category === filter;
  });

  const handleSystemToggle = (systemId: string) => {
    if (selectedBeliefs.includes(systemId)) {
      onSelectionChange(selectedBeliefs.filter(id => id !== systemId));
    } else {
      onSelectionChange([...selectedBeliefs, systemId]);
    }
  };

  const categoryColors = {
    spiritual: 'from-purple-500 to-pink-500',
    psychological: 'from-blue-500 to-teal-500',
    scientific: 'from-green-500 to-emerald-500',
    traditional: 'from-orange-500 to-red-500'
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Belief Systems
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Select the systems that resonate with you for personalized karma insights
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-center text-blue-700">
            <Info className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">You can select multiple systems for deeper insights</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { id: 'popular', label: 'Popular', icon: Star },
          { id: 'all', label: 'All Systems', icon: Filter },
          { id: 'spiritual', label: 'Spiritual', icon: null },
          { id: 'psychological', label: 'Psychological', icon: null },
          { id: 'scientific', label: 'Scientific', icon: null },
          { id: 'traditional', label: 'Traditional', icon: null }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                filter === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-purple-300 hover:text-purple-600'
              }`}
            >
              {Icon && <Icon className="w-4 h-4 mr-1 inline" />}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Selected Count */}
      {selectedBeliefs.length > 0 && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full">
            <Check className="w-4 h-4 mr-2" />
            <span className="font-medium">
              {selectedBeliefs.length} system{selectedBeliefs.length !== 1 ? 's' : ''} selected
            </span>
          </div>
        </div>
      )}

      {/* Belief Systems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredSystems.map((system) => (
          <div
            key={system.id}
            onClick={() => handleSystemToggle(system.id)}
            className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
              selectedBeliefs.includes(system.id)
                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-teal-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
            }`}
          >
            {/* Popular Badge */}
            {system.popular && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Popular
              </div>
            )}

            {/* Selection Indicator */}
            {selectedBeliefs.includes(system.id) && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            <div className="flex items-center justify-between mb-3">
              <div className="text-3xl">{system.icon}</div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categoryColors[system.category]} text-white`}>
                {system.category}
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">{system.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{system.description}</p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo(showInfo === system.id ? null : system.id);
              }}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium"
            >
              Learn more →
            </button>

            {/* Expanded Info */}
            {showInfo === system.id && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-700">
                  This system will analyze your personality and provide insights based on {system.name.toLowerCase()} principles.
                  You'll receive personalized recommendations and tasks aligned with this approach.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          ← Back
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">
            {selectedBeliefs.length === 0 ? 'Select at least one system to continue' : 
             selectedBeliefs.length === 1 ? 'Great! You can add more or continue' :
             `Perfect! ${selectedBeliefs.length} systems selected`}
          </p>
        </div>

        <button
          onClick={onNext}
          disabled={selectedBeliefs.length === 0}
          className={`flex items-center px-8 py-3 rounded-full font-semibold transition-all ${
            selectedBeliefs.length > 0
              ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white hover:scale-105 shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

export default BeliefSystemSelector;