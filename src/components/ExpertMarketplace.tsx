import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Calendar, MessageCircle, Award, Filter, Search, Clock, DollarSign } from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  languages: string[];
  description: string;
  verified: boolean;
  responseTime: string;
  completedSessions: number;
}

const ExpertMarketplace: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');

  const mockExperts: Expert[] = [
    {
      id: '1',
      name: 'Elena Kosmova',
      avatar: '🧘‍♀️',
      specialties: ['Astrology', 'Tarot', 'Chakras'],
      rating: 4.9,
      reviewCount: 127,
      hourlyRate: 75,
      languages: ['English', 'Russian'],
      description: 'Certified astrologer with 10+ years of experience in natal chart readings and spiritual guidance.',
      verified: true,
      responseTime: '< 2 hours',
      completedSessions: 450
    },
    {
      id: '2',
      name: 'Dr. James Chen',
      avatar: '🧠',
      specialties: ['Psychology', 'MBTI', 'Cognitive Therapy'],
      rating: 4.8,
      reviewCount: 89,
      hourlyRate: 120,
      languages: ['English', 'Mandarin'],
      description: 'Licensed psychologist specializing in personality assessment and cognitive behavioral therapy.',
      verified: true,
      responseTime: '< 4 hours',
      completedSessions: 320
    },
    {
      id: '3',
      name: 'Aida Nazarbayeva',
      avatar: '🌟',
      specialties: ['Numerology', 'Human Design', 'Life Coaching'],
      rating: 4.7,
      reviewCount: 156,
      hourlyRate: 60,
      languages: ['Kazakh', 'Russian', 'English'],
      description: 'Spiritual coach combining ancient wisdom with modern life coaching techniques.',
      verified: true,
      responseTime: '< 1 hour',
      completedSessions: 280
    }
  ];

  const specialties = ['all', 'Astrology', 'Psychology', 'Tarot', 'Numerology', 'Chakras', 'MBTI', 'Human Design'];
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-50', label: '$0 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100+', label: '$100+' }
  ];

  const filteredExperts = mockExperts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialty = selectedSpecialty === 'all' || 
                            expert.specialties.includes(selectedSpecialty);
    
    const matchesPrice = priceRange === 'all' ||
                        (priceRange === '0-50' && expert.hourlyRate <= 50) ||
                        (priceRange === '50-100' && expert.hourlyRate > 50 && expert.hourlyRate <= 100) ||
                        (priceRange === '100+' && expert.hourlyRate > 100);
    
    return matchesSearch && matchesSpecialty && matchesPrice;
  });

  const handleBookSession = (expertId: string) => {
    // This would open a booking modal or redirect to booking page
    console.log('Booking session with expert:', expertId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('marketplace.title')}</h1>
          <p className="text-gray-600 mb-6">{t('marketplace.description')}</p>
          
          <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Become a Certified Expert</h2>
                <p className="text-purple-100">Share your knowledge and earn income by helping others on their karma journey</p>
              </div>
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                {t('marketplace.becomeExpert')}
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search experts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>
                  {specialty === 'all' ? 'All Specialties' : specialty}
                </option>
              ))}
            </select>
            
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {priceRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            
            <button className="flex items-center justify-center border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Expert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map(expert => (
            <div key={expert.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              {/* Expert Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl">{expert.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{expert.name}</h3>
                    {expert.verified && (
                      <Award className="w-4 h-4 text-blue-500" title="Verified Expert" />
                    )}
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{expert.rating}</span>
                    <span className="text-sm text-gray-500">({expert.reviewCount} {t('marketplace.reviews')})</span>
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mb-4">
                {expert.specialties.map(specialty => (
                  <span key={specialty} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                    {specialty}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{expert.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{expert.responseTime}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span>{expert.completedSessions} sessions</span>
                </div>
              </div>

              {/* Languages */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1">Languages:</div>
                <div className="flex flex-wrap gap-1">
                  {expert.languages.map(lang => (
                    <span key={lang} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price and Book Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-900">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">{expert.hourlyRate}</span>
                  <span className="text-sm text-gray-500">/hour</span>
                </div>
                
                <button
                  onClick={() => handleBookSession(expert.id)}
                  className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform"
                >
                  {t('marketplace.bookSession')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredExperts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No experts found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Trust & Safety */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trust & Safety</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Verified Experts</h4>
              <p className="text-sm text-gray-600">All experts are thoroughly vetted and certified</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Secure Messaging</h4>
              <p className="text-sm text-gray-600">End-to-end encrypted communication</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Money-Back Guarantee</h4>
              <p className="text-sm text-gray-600">100% satisfaction guaranteed or full refund</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertMarketplace;