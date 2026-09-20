import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, MAX_HISTORY_ITEMS } from '../utils/constants';
import type { TranslationHistory } from '../types/Translation';
import { toast } from 'react-hot-toast';

export const useHistory = (currentUser = 'Default') => {
  const [history, setHistory] = useLocalStorage<TranslationHistory[]>(
    `${STORAGE_KEYS.HISTORY}_${currentUser}`,
    []
  );

  const addHistoryItem = useCallback(
    (inputText: string, translatedText: string, sourceLanguage: string, targetLanguage: string) => {
      if (!inputText.trim() || !translatedText.trim()) return;

      const newItem: TranslationHistory = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
        date: new Date().toISOString(),
        inputText,
        translatedText,
        sourceLanguage,
        targetLanguage,
      };

      setHistory((prev) => {
        // Prevent exact duplicates next to each other, or filter similar translations
        const filtered = prev.filter(
          (item) => !(item.inputText.toLowerCase() === inputText.toLowerCase() &&
                      item.sourceLanguage === sourceLanguage &&
                      item.targetLanguage === targetLanguage)
        );
        return [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      });
    },
    [setHistory]
  );

  const deleteHistoryItem = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((item) => item.id !== id));
      toast.success('History item removed.');
    },
    [setHistory]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    toast.success('History cleared.');
  }, [setHistory]);

  return {
    history,
    addHistoryItem,
    deleteHistoryItem,
    clearHistory,
  };
};

export default useHistory;
