import { useState, useCallback } from 'react';
import { translateText } from '../services/translateService';
import { validateText } from '../utils/validators';
import { toast } from 'react-hot-toast';

export const useTranslation = (
  onSuccess?: (inputText: string, translatedText: string, sourceLang: string, targetLang: string) => void
) => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLanguageCode, setDetectedLanguageCode] = useState<string | undefined>(undefined);

  const translate = useCallback(async () => {
    const validation = validateText(inputText);
    if (!validation.isValid) {
      toast.error(validation.error || 'Please enter text.');
      return;
    }

    setIsLoading(true);
    // Keep translated text visible during load but clear errors
    setDetectedLanguageCode(undefined);
    
    try {
      const result = await translateText(inputText, sourceLanguage, targetLanguage);
      setTranslatedText(result.translatedText);
      if (result.detectedLanguageCode) {
        setDetectedLanguageCode(result.detectedLanguageCode);
      }
      toast.success('Translation completed.');
      
      if (onSuccess) {
        onSuccess(inputText, result.translatedText, sourceLanguage, targetLanguage);
      }
    } catch (err: any) {
      toast.error(err.message || 'Translation failed.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, sourceLanguage, targetLanguage, onSuccess]);

  const clear = useCallback(() => {
    setInputText('');
    setTranslatedText('');
    setDetectedLanguageCode(undefined);
  }, []);

  const swapLanguages = useCallback(() => {
    const actualSource = sourceLanguage === 'auto' ? (detectedLanguageCode || 'en') : sourceLanguage;
    
    // Auto Detect doesn't make sense as a target language, so fallback target language if swapping
    const nextTarget = actualSource === 'auto' ? 'en' : actualSource;
    const nextSource = targetLanguage === 'auto' ? 'en' : targetLanguage;

    setSourceLanguage(nextSource);
    setTargetLanguage(nextTarget);

    // Swap texts
    setInputText(translatedText);
    setTranslatedText(inputText);
    setDetectedLanguageCode(undefined);
  }, [inputText, translatedText, sourceLanguage, targetLanguage, detectedLanguageCode]);

  return {
    inputText,
    setInputText,
    translatedText,
    setTranslatedText,
    sourceLanguage,
    setSourceLanguage,
    targetLanguage,
    setTargetLanguage,
    isLoading,
    detectedLanguageCode,
    translate,
    clear,
    swapLanguages,
  };
};

export default useTranslation;
