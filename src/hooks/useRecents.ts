import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, MAX_RECENT_LANGUAGES } from '../utils/constants';

export const useRecents = (currentUser = 'Default') => {
  const [recents, setRecents] = useLocalStorage<string[]>(
    `${STORAGE_KEYS.RECENT}_${currentUser}`,
    []
  );

  const addRecent = useCallback(
    (code: string) => {
      if (code === 'auto') return;
      setRecents((prev) => {
        const filtered = prev.filter((c) => c !== code);
        return [code, ...filtered].slice(0, MAX_RECENT_LANGUAGES);
      });
    },
    [setRecents]
  );

  return {
    recents,
    addRecent,
  };
};

export default useRecents;
