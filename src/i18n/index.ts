import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translations
import enTranslations from './locales/en.json';
import ruTranslations from './locales/ru.json';
import kzTranslations from './locales/kz.json';

const resources = {
  en: {
    translation: enTranslations
  },
  ru: {
    translation: ruTranslations
  },
  kz: {
    translation: kzTranslations
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    backend: {
      loadPath: '/locales/{{lng}}.json',
    }
  });

export default i18n;