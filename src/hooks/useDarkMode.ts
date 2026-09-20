import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>(
    STORAGE_KEYS.THEME,
    typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return {
    isDarkMode,
    toggleDarkMode,
  };
};

export default useDarkMode;
