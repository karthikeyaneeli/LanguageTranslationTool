export const LANGUAGE_TO_SPEECH_LOCALE: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  fr: 'fr-FR',
  de: 'de-DE',
  es: 'es-ES',
  pt: 'pt-PT',
  it: 'it-IT',
  ru: 'ru-RU',
  ja: 'ja-JP',
  zh: 'zh-CN',
  ko: 'ko-KR',
  ar: 'ar-SA',
  tr: 'tr-TR',
  nl: 'nl-NL',
  el: 'el-GR'
};

export const getLanguageName = (code: string, languagesList: { code: string; name: string }[]): string => {
  if (code === 'auto') return 'Auto Detect';
  const found = languagesList.find(lang => lang.code === code);
  return found ? found.name : code;
};
