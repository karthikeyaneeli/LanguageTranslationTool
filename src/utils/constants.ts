import type { Language } from '../types/Language';

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'tr', name: 'Turkish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'el', name: 'Greek' }
];

export const SOURCE_LANGUAGES: Language[] = [
  { code: 'auto', name: 'Auto Detect' },
  ...LANGUAGES
];

export const TARGET_LANGUAGES: Language[] = LANGUAGES;

export const API_URLS = {
  TRANSLATE: 'https://libretranslate.com/translate',
  // Free fallback endpoints in case the primary requires keys or is down
  FALLBACKS: [
    'https://translate.argosopentech.com/translate',
    'https://libretranslate.de/translate',
    'https://translate.terraprint.co/translate'
  ]
};

export const STORAGE_KEYS = {
  THEME: 'translator_theme',
  HISTORY: 'translator_history',
  FAVORITES: 'translator_favorites',
  RECENT: 'translator_recent_languages'
};

export const MAX_CHARACTER_LIMIT = 5000;
export const MAX_HISTORY_ITEMS = 10;
export const MAX_RECENT_LANGUAGES = 5;
