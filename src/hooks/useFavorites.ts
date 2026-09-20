import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { toast } from 'react-hot-toast';

export const useFavorites = (currentUser = 'Default') => {
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    `${STORAGE_KEYS.FAVORITES}_${currentUser}`,
    []
  );

  const toggleFavorite = useCallback(
    (code: string) => {
      if (code === 'auto') return;
      setFavorites((prev) => {
        const isFav = prev.includes(code);
        const nextFavorites = isFav ? prev.filter((c) => c !== code) : [...prev, code];
        toast.success('Favorites updated.');
        return nextFavorites;
      });
    },
    [setFavorites]
  );

  const isFavorite = useCallback(
    (code: string) => favorites.includes(code),
    [favorites]
  );

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
};

export default useFavorites;
