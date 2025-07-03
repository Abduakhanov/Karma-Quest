import React from 'react';
import { Star, Sparkles, Target, Trophy, Heart, Brain, ArrowRight, Users, Zap } from 'lucide-react';
import { AppState } from '../types';

interface LandingPageProps {
  onNavigate: (page: AppState['currentPage']) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-teal-100 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-700">Discover Your Cosmic Potential</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Unlock Your
              <span className="block bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                Karma Quest
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Gamify your personal growth through the wisdom of multiple belief systems. 
              From astrology to psychology, discover personalized insights and transform them into actionable quests.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => onNavigate('onboarding')}
                className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
              >
                Begin Your Journey
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
              
              <button className="text-purple-600 font-semibold text-lg hover:text-purple-700 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Analysis</h3>
              <p className="text-gray-600">Get insights from multiple belief systems tailored to your unique profile</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Target className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Actionable Quests</h3>
              <p className="text-gray-600">Transform insights into specific tasks and habits for real-world growth</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rewarding Progress</h3>
              <p className="text-gray-600">Earn XP, unlock achievements, and track your transformation journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Multiple Paths to Self-Discovery
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the belief systems that resonate with you and get personalized guidance
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Astrology', icon: '🌟', desc: 'Cosmic influence' },
              { name: 'Psychology', icon: '🧠', desc: 'Scientific insights' },
              { name: 'Numerology', icon: '🔢', desc: 'Number patterns' },
              { name: 'Tarot', icon: '🔮', desc: 'Symbolic guidance' },
              { name: 'Chakras', icon: '🌈', desc: 'Energy centers' },
              { name: 'Human Design', icon: '🎯', desc: 'Life blueprint' },
              { name: 'MBTI', icon: '🎭', desc: 'Personality types' },
              { name: 'Enneagram', icon: '⭐', desc: 'Core motivations' }
            ].map((system) => (
              <div key={system.name} className="bg-gradient-to-br from-purple-50 to-teal-50 rounded-xl p-6 text-center hover:scale-105 transition-transform">
                <div className="text-3xl mb-2">{system.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{system.name}</h3>
                <p className="text-sm text-gray-600">{system.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-purple-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Journey in 4 Steps
            </h2>
            <p className="text-xl text-gray-600">
              Simple, effective, and engaging personal development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Choose Systems', desc: 'Select belief systems that resonate with you', icon: Star },
              { step: 2, title: 'Get Analysis', desc: 'Receive personalized karma insights and recommendations', icon: Sparkles },
              { step: 3, title: 'Complete Quests', desc: 'Transform insights into actionable tasks and habits', icon: Target },
              { step: 4, title: 'Earn Rewards', desc: 'Level up, unlock achievements, and track progress', icon: Trophy }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600">Karma Seekers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-600 mb-2">500K+</div>
              <div className="text-gray-600">Tasks Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-600 mb-2">8</div>
              <div className="text-gray-600">Belief Systems</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of seekers on their journey to self-discovery and personal growth
          </p>
          <button
            onClick={() => onNavigate('onboarding')}
            className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
          >
            Start Your Quest Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-2xl">🌟</div>
                <span className="text-xl font-bold">KarmaQuest</span>
              </div>
              <p className="text-gray-400">
                Gamify your personal growth through ancient wisdom and modern insights
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 KarmaQuest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;