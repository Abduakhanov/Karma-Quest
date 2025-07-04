#!/usr/bin/env node

/**
 * KarmaQuest i18n Lint Script
 * Checks for missing translations and fails CI if any are found
 */

import fs from 'fs';
import path from 'path';

const SUPPORTED_LANGUAGES = ['en', 'ru', 'kz'];
const NAMESPACES = ['common', 'landing', 'dashboard', 'tasks', 'diary', 'rewards', 'onboarding', 'marketplace'];

function loadTranslations(lng, ns) {
  const filePath = path.join(process.cwd(), 'public', 'locales', lng, `${ns}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return null;
  }
}

function flattenObject(obj, prefix = '') {
  const flattened = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }
  
  return flattened;
}

function checkMissingTranslations() {
  let hasErrors = false;
  const report = {
    missing: {},
    total: 0,
    translated: 0
  };

  for (const ns of NAMESPACES) {
    console.log(`\n📋 Checking namespace: ${ns}`);
    
    // Load English as reference
    const enTranslations = loadTranslations('en', ns);
    if (!enTranslations) {
      console.error(`❌ Missing English reference file for ${ns}`);
      hasErrors = true;
      continue;
    }
    
    const enKeys = flattenObject(enTranslations);
    const totalKeys = Object.keys(enKeys).length;
    report.total += totalKeys;
    
    for (const lng of SUPPORTED_LANGUAGES) {
      if (lng === 'en') continue; // Skip English as it's the reference
      
      const translations = loadTranslations(lng, ns);
      if (!translations) {
        console.error(`❌ Missing translation file: ${lng}/${ns}.json`);
        hasErrors = true;
        continue;
      }
      
      const translatedKeys = flattenObject(translations);
      const missingKeys = Object.keys(enKeys).filter(key => !(key in translatedKeys));
      
      if (missingKeys.length > 0) {
        console.error(`❌ ${lng}/${ns}.json missing ${missingKeys.length} keys:`);
        missingKeys.forEach(key => console.error(`   - ${key}`));
        
        if (!report.missing[lng]) report.missing[lng] = {};
        report.missing[lng][ns] = missingKeys;
        hasErrors = true;
      } else {
        console.log(`✅ ${lng}/${ns}.json - all keys present`);
        report.translated += totalKeys;
      }
    }
  }

  // Print summary
  console.log('\n📊 Translation Summary:');
  console.log(`Total keys: ${report.total}`);
  console.log(`Translated: ${report.translated}`);
  console.log(`Missing: ${report.total * (SUPPORTED_LANGUAGES.length - 1) - report.translated}`);
  
  const completionRate = Math.round((report.translated / (report.total * (SUPPORTED_LANGUAGES.length - 1))) * 100);
  console.log(`Completion rate: ${completionRate}%`);

  if (hasErrors) {
    console.error('\n❌ Translation check failed! Please add missing translations.');
    process.exit(1);
  } else {
    console.log('\n✅ All translations are complete!');
  }
}

// Run the check
checkMissingTranslations();