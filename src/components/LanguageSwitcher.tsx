import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', nativeName: 'Русский' },
    { code: 'kz', name: 'Қазақша', flag: '🇰🇿', nativeName: 'Қазақша' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentLanguage.flag} {currentLanguage.nativeName}
        </span>
      </button>
      
      <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
              i18n.language === language.code ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>{language.flag}</span>
              <span>{language.nativeName}</span>
            </div>
            {i18n.language === language.code && (
              <Check className="w-4 h-4 text-purple-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;